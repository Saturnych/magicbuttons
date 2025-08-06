<script lang="ts">
	import { fade } from 'svelte/transition';
	import { alertId, browserTheme, uid } from '$lib/stores';
	import { setStore } from '$lib/utils/context';
	import { delay, hashWithTextEncoder, parseFingerprint2 } from '$lib/utils';
	import { DEBUG } from '$lib/vars/public';
	import type { BrowserTheme } from '$lib/types';
	import Head from '$lib/components/Head.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();

	let showLoader: boolean = $state(true);
	let darkMode: boolean = $derived(browserTheme.get() === 'dark');

	$effect(async () => {
		setStore<string>('alertId', alertId.get());
		setStore<string>('browserTheme', browserTheme.get());
		setStore<string>('uid', uid.get());

		const getFingerprint2 = () => {
			if (window.Fingerprint2 && 'get' in window.Fingerprint2)
				window.Fingerprint2.get((comps) => {
					const { components, hash } = parseFingerprint2(comps);
					const fp2Hash = hashWithTextEncoder(hash);
					//if (DEBUG) console.log('components:', components);
					//if (DEBUG) console.log('fp2Hash:', fp2Hash);
					uid.update(fp2Hash);
				});
		};

		if (window.requestIdleCallback) {
			window.requestIdleCallback(() => delay(getFingerprint2, 500));
		} else {
			delay(getFingerprint2, 500);
		}

		showLoader = false;
	});
</script>

<Head />

<div
	id="loader"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 300 }}
	class="{showLoader
		? ''
		: 'hidden '}bg-gray-500 min-h-screen min-w-screen flex w-fit fixed z-1000 top-0 right-0 grid gap-3"
>
	<div class="flex items-center justify-center">
		<svg
			class="animate-spin border-indigo-600"
			xmlns="http://www.w3.org/2000/svg"
			width="62"
			height="62"
			viewBox="0 0 62 62"
			fill="none"
		>
			<g id="Group 1000003711">
				<circle
					id="Ellipse 717"
					cx="31.0018"
					cy="30.9993"
					r="26.5091"
					stroke="#D1D5DB"
					stroke-width="8"
					stroke-dasharray="5 5"
				/>
				<path
					id="Ellipse 715"
					d="M38.7435 56.3529C45.0336 54.4317 50.3849 50.2409 53.7578 44.5947C57.1307 38.9484 58.2842 32.25 56.9942 25.8008C55.7043 19.3516 52.063 13.6122 46.7779 9.69765C41.4928 5.78314 34.9412 3.97307 28.396 4.61912"
					stroke="grey"
					stroke-width="8"
				/>
			</g>
		</svg>
	</div>
</div>

<div
	class="flex min-h-screen flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
>
	<main class="container mx-auto flex flex-grow items-center justify-center p-4">
		<div>
			{@render children?.()}
			<Footer />
		</div>
	</main>
</div>
