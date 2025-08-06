<script lang="ts">
	import { page } from '$app/state';

	const title = __TITLE__;
</script>

<svelte:head>
	<title>{title} | Error {page.status}: {page.error.message}</title>
</svelte:head>

<h1 class="text-3xl">Error {page.status}: {page.error.message}</h1>
