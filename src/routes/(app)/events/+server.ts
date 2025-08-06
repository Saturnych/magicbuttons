import type { ServerLoadEvent, RequestHandler, Response } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import { clients } from '$lib/clients';
import { delay, returnJson, sleep } from '$lib/utils';
import { EVENT_NAME } from '$lib/vars/public';
import ENV from '$lib/vars/private';
const { DEBUG } = ENV;

const getAuthToken = (request) => (request.headers.get('Authorization') ?? '').split('Bearer ')[1];

const getTime = () => Math.round(Date.now() / 1000);

export const POST: RequestHandler = (event: ServerLoadEvent): Response => {
	try {
		return produce(
			async function start({ source, emit, lock }) {
				const authToken = getAuthToken(event.request);
				if (!authToken) {
					const message: string = 'SSE client authToken not found.';
					emit('log', `${getTime()}: ${message}`);
					return function stop() {
						if (DEBUG) console.error('auth error:', error);
					};
				}
				emit('log', `${getTime()}: SSE client ${authToken} connected.`);
				if (DEBUG) console.log(`SSE client ${authToken} connected.`);
				// Map the session id to an emitter.
				// This will also indicate to you that the client is "online".
				clients.set(authToken, {
					token: authToken,
					func: () => {
						const { error } = emit('token', authToken);
						if (error) {
							const { message } = error;
							emit('log', `${getTime()}: ${message}`);
							if (DEBUG) console.error('token error:', message);
						}
					}
				});
				if (DEBUG) console.log('SSE clients:', clients);
				delay(() => {
					if (DEBUG) console.log('SSE event:', EVENT_NAME);
					const { error } = emit('event', EVENT_NAME);
					if (error) {
						const { message } = error;
						emit('log', `${getTime()}: ${message}`);
						if (DEBUG) console.error('event error:', message);
						return;
					}
				}, 10000);
				while (true) {
					const { error } = emit('message', `the time is ${getTime()}`);
					if (error) {
						const { message } = error;
						emit('log', `${getTime()}: ${message}`);
						if (DEBUG) console.error('message error:', message);
						return;
					}
					const client = clients.get(authToken);
					if (client?.token) client.func();
					await sleep(1000);
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
