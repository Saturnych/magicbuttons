<script lang="ts">
	const title = __TITLE__;
	const description = __DESC__;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<script
		async
		src="https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.4/dist/fingerprint2.min.js"
	></script>
</svelte:head>
