<script>
	import '$lib/scss/main.scss'
	import '$lib/scss/reset.scss'
	import '$lib/scss/typography.scss'

	import Head from '$lib/components/Head.svelte'
	import Header from '$lib/components/Header.svelte'
	import HeaderWork from '$lib/components/HeaderWork.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import { pageIn, pageOut } from '$lib/utils/transitions.js'
	import { getTemplate } from '$lib/utils/template.js'
	import { page } from '$app/state'

	let { data, children } = $props()
	const DURATION = 500
	
</script>

<Head />
<Header nav={data.nav} about={data.about}/>
<HeaderWork nav={data.nav} />

{#key page.url.pathname}
	<div class="page" data-template={getTemplate(page.route.id)} in:pageIn={{ duration: DURATION, delay: DURATION/2 }} out:pageOut={{ duration: DURATION }}>
		<main data-template={getTemplate(page.route.id)}>
			{@render children()}
		</main>
		{#if page.route.id !== '/about'}
			<Footer about={data.about} policies={data.policies} />
		{/if}
	</div>
{/key}

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
	}
</style>