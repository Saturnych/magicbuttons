import { EVENT_NAME } from '$lib/vars/public';
import ENV from '$lib/vars/private';
const { SB_URL } = ENV;

export const load = async ({ setHeaders }) => {
	let popEvent: string;// = EVENT_NAME;
	try {

	} catch (err) {
		console.error(err);
	}
	setHeaders({
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Embedder-Policy': 'require-corp'
	});
	return { popEvent };
};
