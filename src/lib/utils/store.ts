import { get, readable, writable } from 'svelte/store';
import type { SharedStore } from '$lib/types';

export const stores: Record<string, SharedStore>[] = [];

// context for any type of store
export const useSharedStore = <T, V>(
	name: string,
	storeFn: () => T,
	defaultValueFn?: () => V
): T => {
	const defaultValue: V = defaultValueFn ? defaultValueFn() : undefined;
	const methods: T = storeFn(defaultValue);
	stores[name] = {
		valueType: Array.isArray(defaultValue) ? 'array' : typeof defaultValue,
		methods
	};
	return methods;
};

// writable store context
export const useWritable = <V>(name: string, value: V) =>
	useSharedStore(name, writable, () => value);

// readable store context
export const useReadable = <V>(name: string, value: V) =>
	useSharedStore(name, readable, () => value);

export const writableStore = <V>(defaultValue: V) => {
	const store = writable<V>(defaultValue);
	const { set, subscribe, update } = store;
	return {
		set,
		subscribe,
		push: (value) =>
			Array.isArray(defaultValue) ? set([...new Set([].concat(get(store), value))]) : get(store),
		update: (value) =>
			Array.isArray(defaultValue) ? set([...new Set([].concat(get(store), value))]) : set(value),
		clear: () => set(null),
		get: () => get(store),
		getDefault: () => defaultValue,
		setDefault: () => set(defaultValue)
	};
};
