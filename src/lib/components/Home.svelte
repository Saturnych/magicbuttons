<script lang="ts">
	import Icon from '@iconify/svelte';

	const title = __TITLE__;
</script>

<div class="mt-12 px-1">
	<a
		href="/"
		{title}
		class="flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-400"
	>
		<Icon icon="mdi:arrow-left" />&nbsp;home&nbsp;<Icon icon="mdi:arrow-right" />
	</a>
</div>
