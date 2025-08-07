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
		success: {
			message: 'Push the arrow button!',
			isError: false,
			isShown: false
		}
	};

	const showAlert = async (blockId: string, message?: string): Promise<void> => {
		alert = alerts[blockId];
		if (!!message) alert.message = message;
		alert.isShown = true;
		await sleep(4000);
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
			class="fixed top-[8%] right-[40%] z-100 flex w-fit"
		>
			<div class="container-fluid mx-auto mt-5 px-4">
				{#if alert?.isError}
					<div
						class="mb-5 rounded bg-gray-200 px-4 py-4 text-red-800 ring-2 ring-red-500"
						role="alert"
					>
						{alert?.message}
					</div>
				{:else}
					<div
						class="mb-5 rounded bg-gray-200 px-4 py-4 text-green-800 ring-2 ring-green-500"
						role="alert"
					>
						{alert?.message}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
