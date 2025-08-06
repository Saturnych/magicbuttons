import type { ServerLoadEvent, RequestHandler, Response } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import { clients } from '$lib/clients';
import { delay, isDivisible, returnJson, sleep } from '$lib/utils';
import { supabaseAdminClient, supabaseClient } from '$lib/utils/supabase.ts';
import { EVENT_NAME } from '$lib/vars/public';
import ENV from '$lib/vars/private';
const { DEBUG } = ENV;

const DEVISION_NUM = 10;

const getAuthToken = (request) => (request.headers.get('Authorization') ?? '').split('Bearer ')[1];

const getTime = () => Math.round(Date.now() / 1000);

export const POST: RequestHandler = (event: ServerLoadEvent): Response => {
	try {
		return produce(
			async function start({ source, emit, lock }) {
				const emitAction = (name: string, value: string): void => {
					const { error } = emit(name, value);
					if (error) {
						const { message } = error;
						emit('log', `${getTime()}: ${message}`);
						if (DEBUG) console.error(`${name} error:`, message);
						return;
					}
				};

				const authToken = getAuthToken(event.request);
				if (!authToken) {
					const message: string = 'SSE client authToken not found.';
					emit('log', `${getTime()}: ${message}`);
					return function stop() {
						if (DEBUG) console.error('auth error:', error);
					};
				} else {
					let id: number;
					const { data, error } = await supabaseAdminClient.from('mb_fingerprints').select().is('deleted_at', null).eq('fingerprint', authToken).limit(1);
					if (DEBUG) console.error('getting fingerprint:', { data, error });
					if (!error && data?.length>0) {
						id = Number(data[0].id);
					} else {
						const { data, error } = await supabaseAdminClient.from('mb_fingerprints').upsert({ fingerprint: authToken }).select();
						if (DEBUG) console.error('upserting fingerprint:', { data, error });
						id = Number(data[0].id);
					}
					if (DEBUG) console.error('id:', id);
					if (isDivisible(id, DEVISION_NUM)) emitAction('event', EVENT_NAME);
				}

				// Map the session id to an emitter.
				// This will also indicate to you that the client is "online".
				clients.set(authToken, {
					token: authToken,
					func: () => emitAction('token', authToken),
				});

				if (DEBUG) {
					emit('log', `${getTime()}: SSE client ${authToken} connected.`);
					if (DEBUG) console.log(`SSE client ${authToken} connected.`);
					console.log('SSE clients:', clients);
					delay(() => {
						if (DEBUG) console.log('SSE event:', EVENT_NAME);
						emitAction('event', EVENT_NAME);
					}, 10000);
					while (true) {
						emitAction('message', `the time is ${getTime()}`)
						const client = clients.get(authToken);
						if (client?.token) client.func();
						await sleep(1000);
					}
				}
			},
			{
				//ping: 4000, // Custom ping interval
				stop() {
					const authToken = getAuthToken(event.request);
					if (!authToken) {
						return;
					}
					if (DEBUG) console.log(`SSE client ${authToken} disconnected.`);
					clients.delete(authToken);
					if (DEBUG) console.log('SSE clients:', clients);
				}
			}
		);
	} catch (e) {
		console.error(e);
		return returnJson({ error: true }, 500, e?.message || 'Server Error');
	}
};

export const GET: RequestHandler = async (event: ServerLoadEvent): Response => {
	return returnJson({ error: true }, 400, 'Wrong Credentials');
};
