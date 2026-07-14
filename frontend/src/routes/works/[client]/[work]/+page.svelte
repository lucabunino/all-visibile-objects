<script>
	import { PortableText } from '@portabletext/svelte'
	import PortableTextStyle from '$lib/components/PortableTextStyle.svelte'
	import Media from '$lib/components/Media.svelte'
	import Gallery from '$lib/components/Gallery.svelte'
	import CursorTag from '$lib/components/CursorTag.svelte'
	import { browser } from '$app/environment'
	import { pageIn, pageOut } from '$lib/utils/transitions.js'

	let { data } = $props()
	const work = $derived(data.work)

	let galleryOpen = $state(false)
	let hovered = $state(null)

	/** @param {MouseEvent} e */
	function scrollToDetails(e) {
		if (!browser) return
		e.preventDefault()
		document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })
	}
	const galleryMedia = $derived(
		/** @type {any[]} */ (work.blocks ?? [])
			.flatMap((/** @type {any} */ block) => block.items ?? [])
			.filter((/** @type {any} */ item) => item._type === 'mediaItem')
	)
</script>

{#if galleryOpen && galleryMedia.length}
	<div class="gallery-wrapper" in:pageIn={{ fixed: true }} out:pageOut={{ fixed: true }}>
		<Gallery media={galleryMedia} bind:galleryOpen={galleryOpen}/>
	</div>
{/if}

<article>
	<header>
		{#if work.client}<h2 class="tag no-pointer">{work.client.title}</h2>{/if}
		{#if work.title}<h1 class="tag no-pointer">{work.title}</h1>{/if}
		<a href="#details" class="tag black" onclick={scrollToDetails}>Details +</a>
		{#if galleryMedia.length}
			<button class="tag play" type="button" onclick={() => (galleryOpen = true)}>Play
				<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M9.75 5.19615L4.64275e-07 10.3923L9.18537e-07 -9.03023e-07L9.75 5.19615Z"/>
				</svg>
			</button>
		{/if}
	</header>

	{#if work.blocks}
		<section id="blocks">
			{#each work.blocks || [] as block (block._key)}
				<div class="blocks">
					{#each block.items || [] as item (item._key)}
						<div class="block {item._type} {item._type == 'textItem' ? 'portableText su-m' : undefined}">
							{#if item._type === 'mediaItem'}
								<Media media={item} width={100 / block.items.length}/>
							{:else if item._type === 'textItem'}
								{#if item.text}
									<PortableText value={item.text} components={{ block: PortableTextStyle, types: { break: PortableTextStyle }, marks: { link: PortableTextStyle } }} />
								{:else}
									<span class="empty su-s">This text block is empty. <br>Use "Empty" block instead</span>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</section>
	{:else}
		<span id="empty">No blocks found</span>
	{/if}

	<section id="details">
		<dl class="details">
			<dt>Client</dt>
			<dd>{work.client?.title}</dd>
			{#if work.typology}
				<dt>Typology</dt>
				<dd>{work.typology.title}</dd>
			{/if}
			{#if work.year}
				<dt>Year</dt>
				<dd>{work.year.slice(0, 4)}</dd>
			{/if}
			{#if work.services?.length}
				<dt>Services</dt>
				<dd>
					{#each work.services as service, i}
						{#if i > 0}{@html ', '}{/if}{service.title}
					{/each}
				</dd>
			{/if}
			{#if work.credits?.length}
				{#each work.credits as credit (credit._key)}
					<dt>{credit.role}</dt>
					<dd>
						{#each credit.collaborators as collaborator, i}
							{#if i > 0}{@html ', '}{/if}
							{#if collaborator.href}
								<a class="hover-gray" href={collaborator.href} target="_blank" rel="noopener noreferrer">{collaborator.title}</a>
							{:else}
								{collaborator.title}
							{/if}
						{/each}
					</dd>
				{/each}
			{/if}
		</dl>
		{#if work.workInformation}
			<div class="informations">
				<h3>Project Information</h3>
				<div class="portableText informations su-m">
					<PortableText value={work.workInformation} components={{ block: PortableTextStyle, types: { break: PortableTextStyle }, marks: { link: PortableTextStyle } }} />
				</div>
			</div>
		{/if}
	</section>

	{#if work.related?.length}
		<nav id="related" aria-label="Related works">
			<h3>More projects to explore</h3>
			<ul class="related">
				{#each work.related as related (related.slug?.current)}
					<li class="work">
						<a
							href="/works/{related.client?.slug.current}/{related.slug?.current}"
							onmouseenter={() => (hovered = related)}
							onmouseleave={() => (hovered = null)}
						>
							<Media media={related.thumbnail} width={25}/>
							<span class="title">{related.title}</span>
							{#if related.subtitle}<span class="subtitle">{related.subtitle}</span>{/if}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</article>

{#if hovered}
	{#key hovered}
		<CursorTag label="View project" />
	{/key}
{/if}

<style lang="scss">
	.gallery-wrapper {
		position: fixed;
		inset: 0;
		z-index: 100;
	}
	header {
		display: flex;
		column-gap: var(--sp-5);
		position: fixed;
		// left: calc((100% - var(--sp-15)*2 - var(--sp-15)*11)/12*4 + var(--sp-15)*5);
		right: var(--sp-15);
		top: var(--sp-15);
		z-index: 11;

		.play {
			display: flex;
			column-gap: var(--sp-7);
			// position: fixed;
			// top: var(--sp-15);
			// right: var(--sp-15);
			z-index: 11;

			svg {
				fill: var(--white);
			}
		}
	}
	#blocks {

		.blocks {
			display: flex;

			.block {
				width: 100%;
				&.textItem {
					display: block;
					padding: var(--sp-15);
					width: calc(100% - var(--sp-15)*2);

					.empty {
						display: block;
						min-height: 200px;
						place-content: center;
						text-align: center;
						background-color: var(--gray);
						color: var(--white);
						margin: calc(var(--sp-15)*-1);
					}
				}

				&.emptyItem {
					display: block;
				}
			}
		}
	}
	#empty {
		display: block;
		min-height: 50vh;
		place-content: center;
		text-align: center;
		background-color: var(--gray);
		color: var(--white);
	}
	#details {
		display: grid;
		align-items: start;
		grid-template-columns: repeat(12, 1fr);
		column-gap: var(--sp-15);
		padding: var(--sp-100) var(--sp-15) 0;

		.details {
			grid-column: 1 / span 6;
			display: grid;
			row-gap: var(--sp-4);
			grid-template-columns: repeat(6, 1fr);
			column-gap: var(--sp-15);

			dt { grid-column: 1 / span 1; }
			dd { grid-column: 2 / span 5; }
		}

		.informations {
			grid-column: 7 / span 6;

			h3 + .portableText {
				margin-top: var(--sp-6);
			}
		}
	}
	#related {
		padding: var(--sp-196) var(--sp-15) 0;

		h3 {
			margin-bottom: var(--sp-20);
		}
		.related {
			display: grid;
			grid-template-columns: repeat(6, 1fr);
			column-gap: var(--sp-15);

			.work {
				a {
					padding-bottom: var(--sp-2);
					
					.title {
						display: block;
						margin-top: var(--sp-7);
					}
					.subtitle {
						color: var(--gray);
					}
				}
			}
		}
	}
</style>
