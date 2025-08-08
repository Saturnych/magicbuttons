import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { BrowserTheme } from '$lib/types';

export const addHeaders: Handle = async ({ event, resolve }) => {
	const { url, cookies } = event;

	// '/.well-known/appspecific/com.chrome.devtools.json'
	if (url.pathname.includes('.well-known')) {
		return error(404, { message: 'Not found' });
	}

	const browserTheme: BrowserTheme = cookies.get('browserTheme');
	const resolveOptions: Record<string, Function> = {};
	if (!!browserTheme && ['dark', 'light', 'system'].includes(browserTheme)) {
		resolveOptions.transformPageChunk = ({ html }) => {
			return html.replace('data-theme=""', `data-theme="${browserTheme}"`);
		};
	}

	const response = await resolve(event, resolveOptions);
	//response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	//response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp'); // credentialless require-corp
	return response;
};

export const handle: Handle = sequence(addHeaders);
