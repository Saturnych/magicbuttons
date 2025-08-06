import pkg from './package.json' with { type: 'json' };
import ENV from '$lib/vars/private';
const { SB_URL } = ENV;

export const load = async ({ setHeaders }) => {
	let buttonLink: string = pkg?.homepage;
	try {

	} catch (err) {
		console.error(err);
	}
	setHeaders({
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Embedder-Policy': 'require-corp'
	});
	return { buttonLink };
};
