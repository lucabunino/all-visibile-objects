<script>
	import '$lib/scss/main.scss'
	import '$lib/scss/reset.scss'
	import '$lib/scss/typography.scss'

	import Head from '$lib/components/Head.svelte'
	import Header from '$lib/components/Header.svelte'
	import HeaderWork from '$lib/components/HeaderWork.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import CookieBanner from '$lib/components/CookieBanner.svelte'
	import { pageIn, pageOut } from '$lib/utils/transitions.js'
	import { getTemplate } from '$lib/utils/template.js'
	import { page } from '$app/state'
	import { getTagRadius } from '$lib/stores/tagRadius.svelte.js'
	import { innerWidth } from 'svelte/reactivity/window'
	import bp from '$lib/scss/breakpoints.module.scss'

	let { data, children } = $props()
	const DURATION = 500
	const tagRadius = getTagRadius()
</script>

{#if innerWidth.current && innerWidth.current <= parseInt(bp.xxxs)}
	<p class="notice su-s">Please view this site on a larger screen.</p>
{:else}
	<Head />
	<div class={tagRadius.rounded ? 'mo mo-s' : 'su su-s'} style:--tagRadius={tagRadius.rounded ? '3px' : '0px'}>
		<Header nav={data.nav} about={data.about}/>
		<HeaderWork nav={data.nav} />
		<CookieBanner policies={data.policies} />

		{#key page.url.pathname}
			<div class="page" data-template={getTemplate(page.route.id)} in:pageIn={{ duration: DURATION, delay: 0 }} out:pageOut={{ duration: DURATION }}>
				<main data-template={getTemplate(page.route.id)}>
					{@render children()}
				</main>
				{#if page.route.id !== '/about'}
					<Footer about={data.about} policies={data.policies} />
				{/if}
			</div>
		{/key}
	</div>
{/if}

<style lang="scss">
	@use '$lib/scss/breakpoints.module' as bp;

	.page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
	}

	.notice {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 100vh;
		padding: var(--sp-15);
	}

	@media (width <= #{bp.$md}) {
	}
</style>