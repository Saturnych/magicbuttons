import { browser } from '$app/environment';
import { parseJson } from '$lib/utils';
import { useSharedStore, writableStore } from '$lib/utils/store';
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
	if (browser && localStorage) localStorage.setItem('uid', !!value ? value : '');
	return value;
});

const useLogs = () =>
	useSharedStore<object, string[]>('logs', writableStore<string[]>, () =>
		browser && localStorage ? parseJson(localStorage.getItem('logs') || '[]') : []
	);

export const logs = useLogs();
logs.subscribe((value) => {
	if (browser && localStorage) localStorage.setItem('logs', JSON.stringify(Array.isArray(value) && value?.length>0 ? value : []));
	return value;
});
