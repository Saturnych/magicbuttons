<script lang="ts">
	import Icon, { listIcons } from '@iconify/svelte';
	import { source } from 'sveltekit-sse';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { uid, logs } from '$lib/stores';
	import { delay, isValidUrl, parseJson } from '$lib/utils';
	import { DEBUG, EVENTS_URI, EVENT_NAME } from '$lib/vars/public';

	import Header from '$lib/components/Header.svelte';
	import Alert from '$lib/components/Alert.svelte';

	const repository = __REPO__;
	const eventText = EVENT_NAME;

	let { devisionNum, popEvent = '' } = page.data;
	if (DEBUG) console.log('devisionNum:', devisionNum);

	let { alertMessage = $bindable(''), buttonLink = $bindable(''), fpId = $bindable('') } = $props();

	let sseToken: string = $derived('');
	let sseMessage: string = $derived('');
	let sseEvent: object = $derived({ id: '?', authToken: uid.get(), name: popEvent });
	fpId = sseEvent.id;
	if (sseEvent?.name === eventText) {
		buttonLink = repository;
	}
	if (DEBUG) console.log('buttonLink:', buttonLink);

	const getConnection = () => {
		if (EVENTS_URI) {
			console.log('authToken:', authToken);
			const connection = source(EVENTS_URI, {
				options: {
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				},
				close({ connect }) {
					if (DEBUG) console.log('SSE reconnecting...');
					connect();
				}
			});
			const log = connection.select('log');
			log.subscribe((value) => {
				if (!!value) {
					logs.push(value);
				}
			});
			const message = connection.select('message');
			message.subscribe((value) => {
				sseMessage = value;
			});
			const token = connection.select('token');
			token.subscribe((value) => {
				sseToken = value;
			});
			const event = connection.select('event');
			event.subscribe((value) => {
				sseEvent = parseJson(value);
				fpId = sseEvent?.id;
				if (sseEvent?.name === eventText) {
					buttonLink = repository;
				}
				console.log('event.subscribe:', sseEvent);
			});

			if (DEBUG) {
				//const testConnectionTimer = setInterval(() => connection.close(), 10000);
			}
		}
	};

	let sseLog: string = $derived.by(() => {
		const arr = logs.get();
		return arr?.length > 0 ? arr[arr.length - 1] : '';
	});

	let sseLogs: string[] = $derived(logs.get());
	logs.subscribe((value) => {
		sseLogs = value;
		sseLog = value?.length > 0 ? value[value.length - 1] : '';
		return value;
	});

	let authToken: string = $derived(uid.get());
	uid.subscribe((value) => {
		authToken = value;
		getConnection();
		return value;
	});

	$effect(async () => {

	});
</script>

<Header />

<Alert bind:alertMessage />

<div id="messages">
	{sseMessage}<br />token okay: {sseToken === authToken}<br />{sseLog}
</div>

<div class="mt-auto">
	<div class="flex flex-wrap items-center justify-left gap-4 py-4">
		<h2 class="text-3xl">{fpId || '?'}</h2> <h2 class="text-xl"> / {devisionNum}</h2>
	</div>
</div>

<div id="buttons">
{#if isValidUrl(buttonLink)}
	<button
		title="PUSH ME!"
		class="justify-center text-xl text-neutral-600 hover:text-neutral-500 focus:outline-none"
		onclick={() => window.open(buttonLink, '_blank')}
	>
		<Icon icon="mdi:arrow-right" style="font-size: 90px;" />
	</button>
{/if}
</div>
