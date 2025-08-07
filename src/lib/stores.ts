import { browser } from '$app/environment';
import { parseJson } from '$lib/utils';
import { useSharedStore, writableStore } from '$lib/utils/store';
import { deleteCookie, setCookie } from '$lib/utils/cookie';
import type { BrowserTheme } from '$lib/types';

const useAlertId = () =>
	useSharedStore<object, string>('alertId', writableStore<string>, () =>
		browser && localStorage ? localStorage.getItem('alertId') || '' : ''
	);

export const alertId = useAlertId();
alertId.subscribe((value) => {
	if (browser && localStorage) localStorage.setItem('alertId', !!value ? value : '');
	return value;
});

const useBrowserTheme = () =>
	useSharedStore<object, BrowserTheme>('browserTheme', writableStore<BrowserTheme>, () =>
		browser && localStorage ? localStorage.getItem('browserTheme') || '' : ''
	);

export const browserTheme = useBrowserTheme();
browserTheme.subscribe((value) => {
	if (browser && localStorage) localStorage.setItem('browserTheme', !!value ? value : '');
	return value;
});

const useUid = () =>
	useSharedStore<object, string>('uid', writableStore<string>, () =>
		browser && localStorage ? localStorage.getItem('uid') || '' : ''
	);

export const uid = useUid();
uid.subscribe((value) => {
	if (browser) {
		if (localStorage) localStorage.setItem('uid', !!value ? value : '');
		if (!!value) {
			setCookie('uid', value, 10000);
		} else {
			deleteCookie('uid');
		}
	}
	return value;
});

const useFp2 = () =>
	useSharedStore<object, string>('fp2', writableStore<string>, () =>
		browser && localStorage ? localStorage.getItem('fp2') || '' : ''
	);

export const fp2 = useFp2();
fp2.subscribe((value) => {
	if (browser && localStorage) localStorage.setItem('fp2', !!value ? value : '');
	return value;
});

const useLogs = () =>
	useSharedStore<object, string[]>('logs', writableStore<string[]>, () =>
		browser && localStorage ? parseJson(localStorage.getItem('logs') || '[]') : []
	);

export const logs = useLogs();
logs.subscribe((value) => {
	if (browser && localStorage)
		localStorage.setItem(
			'logs',
			JSON.stringify(Array.isArray(value) && value?.length > 0 ? value : [])
		);
	return value;
});
