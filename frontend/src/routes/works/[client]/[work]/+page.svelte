<script>
	import { PortableText } from '@portabletext/svelte'
	import PortableTextStyle from '$lib/components/PortableTextStyle.svelte'
	import Media from '$lib/components/Media.svelte'
	import Gallery from '$lib/components/Gallery.svelte'
	import CursorTag from '$lib/components/CursorTag.svelte'
	import { pageIn, pageOut } from '$lib/utils/transitions.js'
	import { getGallery } from '$lib/stores/gallery.svelte.js'
	import { page } from '$app/state'

	let { data } = $props()
	const work = $derived(data.work)

	const gallery = getGallery()

	// gallery.open tracks the pushed history entry both ways: Back pops it
	// (closes), Forward restores it (reopens) — see gallery.svelte.js
	$effect(() => {
		gallery.setOpen(!!page.state.gallery)
	})

	let hovered = $state(null)

	const galleryMedia = $derived(
		/** @type {any[]} */ (work.blocks ?? [])
			.flatMap((/** @type {any} */ block) => block.items ?? [])
			.filter((/** @type {any} */ item) => item._type === 'mediaItem')
	)
</script>

{#if gallery.open && galleryMedia.length}
	<div class="gallery-wrapper" in:pageIn={{ fixed: true }} out:pageOut={{ fixed: true }}>
		<Gallery media={galleryMedia} />
	</div>
{/if}

<article>
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
		z-index: 5;
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
					width: 100%;
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
