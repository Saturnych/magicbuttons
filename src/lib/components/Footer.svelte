<script lang="ts">
	import Icon, { listIcons } from '@iconify/svelte';
	import { browser } from '$app/environment';
	import { browserTheme } from '$lib/stores';
	import type { BrowserTheme } from '$lib/types';
	//import Home from '$lib/components/Home.svelte';
	import { DEBUG } from '$lib/vars/public';

	const title = __TITLE__;
	const repository = __REPO__;

	let darkMode: boolean = $derived(browserTheme.get() === 'dark');

	const isDarkTheme = (): boolean => {
		const theme: BrowserTheme = browserTheme.get();
		return (
			theme === 'dark' ||
			(!theme && browser && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	};

	const setTheme = (theme?: BrowserTheme): void => {
		if (theme === 'system') {
			browserTheme.clear();
		} else {
			browserTheme.update(theme);
		}
		document.documentElement.classList.toggle('dark', isDarkTheme());
		darkMode = document.documentElement.classList.contains('dark');
	};

	browserTheme.subscribe((value) => {
		if (!!value) setTheme(value);
	});

	$effect(() => {
		const theme: BrowserTheme = browserTheme.get();
		setTheme(!!theme ? theme : 'system');

		window.addEventListener(
			'storage',
			(evt) => {
				if (DEBUG)
					console.log(
						`storage event key: '${evt.key}'`,
						'values:',
						evt.oldValue,
						'=>',
						evt.newValue
					);
				if (evt.key === 'browserTheme' && !!evt.newValue) setTheme(evt.newValue);
			},
			false
		);
	});
</script>

<div class="mt-auto">
	<div class="flex items-center justify-center gap-8 py-4">
		<a href={repository} {title} target="_blank">
			<Icon icon="mdi:github" class="text-3xl text-neutral-500 hover:text-neutral-400" />
		</a>
		<a
			href="#"
			onclick={() => browserTheme.update(darkMode ? 'light' : 'dark')}
			title="Change Theme"
		>
			<Icon
				icon={darkMode ? 'mdi:white-balance-sunny' : 'mdi:moon-and-stars'}
				class="text-3xl text-neutral-500 hover:text-neutral-400"
			/>
		</a>
	</div>
</div>

{#if darkMode}
	<style>
		html {
			color-scheme: dark;
		}
	</style>
{:else}
	<style>
		html {
			color-scheme: light;
		}
	</style>
{/if}
