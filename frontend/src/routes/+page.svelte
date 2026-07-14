<script>
	import Media from '$lib/components/Media.svelte'
	import CursorTag from '$lib/components/CursorTag.svelte'

	let { data } = $props()

	let hovered = $state(null)
</script>

<h1 class="sr-only">All Visible Object</h1>

<ul class="works">
	{#each data.works as work (work.slug?.current)}
		<li class="work">
			<a
				href="/works/{work.client?.slug?.current}/{work.slug?.current}"
				onmouseenter={() => (hovered = work)}
				onmouseleave={() => (hovered = null)}
			>
				<Media media={work.thumbnail} class="homepage" width=50/>
				<div class="tags">
					<span class="tag client">{work.client ? work.client.title : 'Missing client'}</span>
					<span class="tag title">{work.title}</span>
				</div>
			</a>
		</li>
	{/each}
</ul>

{#if hovered}
	{#key hovered}
		<CursorTag label="View project" />
	{/key}
{/if}

<style lang="scss">
.works {
	display: grid;
	grid-template-columns: repeat(2, 1fr);

	.work {
		position: relative;

		a {
			display: block;
			&:focus-visible {
				border: outset;
			}

			.tags {
				position: absolute;
				inset: var(--sp-15);
				pointer-events: none;
				// margin-top: calc(50% - var(--tagHeight)/2);

				.tag {
					position: sticky;
					top: calc(50% - var(--tagHeight)/2);
				}
			}
		}

	}
}
</style>
