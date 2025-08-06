import { createClient } from '@supabase/supabase-js';
import ENV from '$lib/vars/private';
const { DEBUG, APP_NAME, SB_URL, SB_ANON_KEY, SB_SERVICE_ROLE_KEY, SB_DB_SCHEMA = 'public' } = ENV;

export const supabaseCreateClient = (schema: string = SB_DB_SCHEMA) => {
	const options = {
		db: { schema },
		headers: { 'x-app-name': APP_NAME },
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true
	};
	return createClient(SB_URL, SB_ANON_KEY, options);
};

export const supabaseClient = supabaseCreateClient();

export const supabaseAdminClient = createClient(SB_URL, SB_SERVICE_ROLE_KEY);
