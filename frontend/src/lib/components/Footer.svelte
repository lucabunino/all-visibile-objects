<script>
	let { about, policies = [] } = $props()
	let scrollY = $state(0)
</script>

<svelte:window bind:scrollY />

<footer>
	{#if about.email}
		<a class="talk tag" href="mailto:{about.email}">A new project in mind? Let’s talk.</a>
	{/if}
	<div class="footer">
		<p class="year">© {new Date().getFullYear()} All Visible Object</p>
		{#if about.instagram?.href}
			<a class="instagram tag black" href={about.instagram.href} target="_blank" rel="noopener noreferrer">{about.instagram.handle}</a>
		{/if}
		{#if about.email}
			<a class="email tag black" href="mailto:{about.email}">Email us</a>
		{/if}
		{#each policies as policy (policy.slug?.current)}
			<a class="tag" href="/policy/{policy.slug?.current}">{policy.title}</a>
		{/each}
		<button class="tag" type="button" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top" disabled={scrollY === 0}>↑</button>
	</div>
</footer>


<style lang="scss">
footer {
	display: flex;
	flex-direction: column;
	padding: var(--sp-15);
	margin-top: auto;
	color: var(--black);
	background-color: var(--white);

	.talk {
		flex-basis: 100%;
		margin: var(--sp-200) auto;
		width: fit-content;
	}

	.footer {
		display: flex;
		gap: var(--sp-5);
		align-items: baseline;

		.year {
			margin-right: auto;
		}
	}
}
</style>