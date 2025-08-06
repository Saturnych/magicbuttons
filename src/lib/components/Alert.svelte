<script lang="ts">
	import { fade } from 'svelte/transition';
	import { sleep } from '$lib/utils';
	import { alertId } from '$lib/stores';

	let { alertMessage = $bindable() } = $props();

	let y: number = $state(0);
	let height: number = $state(0);
	let fromTop = $derived(y > 50 ? y - 40 : 10);

	let alert = $state({ message: '', isError: false, isShown: false });

	const alerts: Record<string, object> = {
		error: {
			message: 'Error!',
			isError: true,
			isShown: false
		},
		getLinkError: {
			message: 'Input the text!',
			isError: true,
			isShown: false
		},
		linkCopied: {
			message: 'Link copied',
			isError: false,
			isShown: false
		},
		linkCreated: {
			message: 'Link created',
			isError: false,
			isShown: false
		},
		textCopied: {
			message: 'Text copied',
			isError: false,
			isShown: false
		}
	};

	const showAlert = async (blockId: string, message?: string): Promise<void> => {
		alert = alerts[blockId];
		if (!!message) alert.message = message;
		alert.isShown = true;
		await sleep(3000);
		alerts[blockId].isShown = false;
		alert = {};
		alertMessage = '';
		alertId.update('');
	};

	alertId.subscribe((value) => {
		if (!!value) showAlert(value, alertMessage);
	});
</script>

<svelte:window bind:scrollY={y} bind:innerHeight={height} />

<div class="relative {!!alert?.isShown ? '' : 'hidden'}">
	{#if alert?.isShown}
		<div
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			class="fixed z-100 top-[8%] right-[40%] flex w-fit"
		>
			<div class="container-fluid mx-auto px-4 mt-5">
				{#if alert?.isError}
					<div
						class="px-4 py-4 mb-5 bg-gray-200 text-red-800 rounded ring-2 ring-red-500"
						role="alert"
					>
						{alert?.message}
					</div>
				{:else}
					<div
						class="px-4 py-4 mb-5 bg-gray-200 text-green-800 rounded ring-2 ring-green-500"
						role="alert"
					>
						{alert?.message}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
