import type { ServerLoadEvent, RequestHandler, Response } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import { clients } from '$lib/clients';
import { delay, isDivisible, returnJson, sleep } from '$lib/utils';
import { supabaseAdminClient } from '$lib/utils/supabase.ts';
import { EVENT_NAME } from '$lib/vars/public';
import ENV from '$lib/vars/private';
const { DEBUG, DEVISION_NUM = 10 } = ENV;

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
						//console.error(`${name} error:`, message);
						return;
					}
				};

				let id: number;
				const devisionNum: number = Number(DEVISION_NUM);
				const authToken = getAuthToken(event.request);
				const eventData = { id, authToken, name: '' };
				if (!authToken) {
					const message: string = 'SSE client authToken not found.';
					emit('log', `${getTime()}: ${message}`);
					return function stop() {
						console.error('auth error:');
					};
				} else {
					const { data, error } = await supabaseAdminClient
						.from('mb_fingerprints')
						.select()
						.eq('fingerprint', authToken)
						.limit(1);
					if (DEBUG) console.log('getting fingerprint:', { data, error });
					if (!error && data?.length > 0) {
						id = Number(data[0].id);
					} else {
						const { data, error } = await supabaseAdminClient
							.from('mb_fingerprints')
							.upsert({ fingerprint: authToken })
							.select();
						if (DEBUG) console.log('upserting fingerprint:', { data, error });
						id = Number(data[0].id);
					}
					if (DEBUG) console.log('id:', id);
					eventData.id = id;
					if (isDivisible(id, devisionNum)) {
						eventData.name = EVENT_NAME;
					}
				}

				if (DEBUG) console.log('SSE eventData:', eventData);
				emitAction('event', JSON.stringify(eventData));

				// Map the session id to an emitter.
				// This will also indicate to you that the client is "online".
				clients.set(authToken, {
					token: authToken,
					func: () => emitAction('token', authToken)
				});

				emit('log', `${getTime()}: SSE client ${authToken} connected.`);
				console.log(`SSE client ${authToken} connected.`);
				console.log('SSE clients:', clients);

				const client = clients.get(authToken);
				if (client?.token) client.func();

				if (DEBUG) {
					delay(() => {
						eventData.name = EVENT_NAME;
						if (DEBUG) console.log('SSE eventData:', eventData);
						emitAction('event', JSON.stringify(eventData));
					}, 10000);
					while (true) {
						emitAction('message', `the time is ${getTime()}`);
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
