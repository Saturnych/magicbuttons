import { isDivisible } from '$lib/utils';
import { supabaseAdminClient } from '$lib/utils/supabase.ts';
import { EVENT_NAME } from '$lib/vars/public';
import ENV from '$lib/vars/private';
const { DEBUG, DEVISION_NUM = 10 } = ENV;

export const load = async ({ cookies, setHeaders }) => {
	const devisionNum: number = Number(DEVISION_NUM);
	const popEvent: Record<string, string> = { id: '', authToken: '', name: '' };
	try {
		const uid: string = cookies.get('uid');
		if (!!uid) {
			const { data, error } = await supabaseAdminClient
				.from('mb_fingerprints')
				.select()
				.eq('fingerprint', uid)
				.limit(1);
			if (DEBUG) console.log('page.server fingerprint:', { data, error });
			if (data?.length > 0 && isDivisible(data[0].id, devisionNum)) {
				popEvent.id = String(data[0].id);
				popEvent.authToken = uid;
				popEvent.name = EVENT_NAME;
			}
		}
	} catch (err) {
		console.error(err);
	}
	setHeaders({
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Embedder-Policy': 'require-corp'
	});
	return { devisionNum, popEvent };
};
