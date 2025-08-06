import { hasContext, getContext, setContext } from 'svelte';
import * as stores from '$lib/stores';

export const hasStore = (key: string): boolean => hasContext(key) || !!stores[key];

export const setStore = <T>(key: string, val?: T): void => {
	setContext(key, val);
};

export const getStore = <T>(key: string): T =>
	hasContext(key) ? getContext(key) : stores[key].get();
