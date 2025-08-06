<script lang="ts">
	import Icon, { listIcons } from '@iconify/svelte';
	import { source } from 'sveltekit-sse';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { uid, logs } from '$lib/stores';
	import { delay, isValidUrl } from '$lib/utils';
	import { DEBUG, EVENTS_URI, EVENT_NAME } from '$lib/vars/public';

	import Header from '$lib/components/Header.svelte';
	import Alert from '$lib/components/Alert.svelte';

	const repository = __REPO__;
	const eventText = EVENT_NAME;

	const getConnection = () => {
		if (EVENTS_URI) {
			console.log('EVENTS_URI:', EVENTS_URI);
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
				sseEvent = value;
				if (sseEvent === eventText) buttonLink = repository;
			});

			if (DEBUG) {
				//const testConnectionTimer = setInterval(() => connection.close(), 10000);
			}
		}
	};

	let { popEvent = '' } = page.data;
	if (DEBUG) console.log('popEvent:', popEvent);

	let { alertMessage = $bindable(''), buttonLink = $bindable('') } = $props();

	let sseToken: string = $derived('');
	let sseEvent: string = $derived('');
	let sseMessage: string = $derived(popEvent);
	if (sseMessage === eventText) buttonLink = repository;
	if (DEBUG) console.log('buttonLink:', buttonLink);

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
		getConnection()
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

<div id="buttons">
{#if isValidUrl(buttonLink)}
	<button
		title="{sseEvent}"
		class="justify-center text-xl text-neutral-600 hover:text-neutral-500 focus:outline-none"
		onclick={() => window.open(buttonLink, '_blank')}
	>
		<Icon icon="mdi:arrow-right" style="font-size: 90px;" />
	</button>
{/if}
</div>
