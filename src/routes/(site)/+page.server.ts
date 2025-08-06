import { EVENT_NAME } from '$lib/vars/public';
import ENV from '$lib/vars/private';
const { DEBUG, DEVISION_NUM = 10 } = ENV;

export const load = async ({ setHeaders }) => {
	const devisionNum: number = Number(DEVISION_NUM);
	let popEvent: string;// = EVENT_NAME;
	try {

	} catch (err) {
		console.error(err);
	}
	setHeaders({
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Embedder-Policy': 'require-corp'
	});
	return { devisionNum, popEvent };
};
