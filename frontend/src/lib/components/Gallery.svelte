<script>
	import Media from '$lib/components/Media.svelte'
	import CursorTag from '$lib/components/CursorTag.svelte'
	import { useScrollLock } from '$lib/utils/scrollLock.svelte.js'
	import { revealWidth } from '$lib/utils/transitions.js'
	import { getGallery } from '$lib/stores/gallery.svelte.js'

	const DURATION = 200

	/** @type {{media: any[]}} */
	let { media = [] } = $props()

	const gallery = getGallery()

	let index = $state(0)
	/** @type {'left' | 'right' | null} */
	let hovered = $state(null)

	useScrollLock(() => true)

	function close() { gallery.closeGallery() }
	function prev() { index = (index - 1 + media.length) % media.length }
	function next() { index = (index + 1) % media.length }

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key === 'Escape') close()
		else if (e.key === 'ArrowLeft') prev()
		else if (e.key === 'ArrowRight') next()
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="overlay" role="dialog" aria-modal="true" aria-label="Media gallery">
	<div class="tag-wrapper index" in:revealWidth|global={{ duration: DURATION, delay: DURATION }} out:revealWidth|global={{ duration: DURATION }}>
		<span class="tag no-pointer">{index + 1}/{media.length}</span>
	</div>

	<button
		class="zone prev"
		type="button"
		onclick={prev}
		onmouseenter={() => (hovered = 'left')}
		onmouseleave={() => (hovered = null)}
		aria-label="Previous"
	></button>
	<button
		class="zone next"
		type="button"
		onclick={next}
		onmouseenter={() => (hovered = 'right')}
		onmouseleave={() => (hovered = null)}
		aria-label="Next"
	></button>

	{#key media[index]}
		<Media media={media[index]} class="gallery" />
	{/key}
</div>

{#if hovered}
	{#key hovered}
		<CursorTag direction={hovered} />
	{/key}
{/if}

<style lang="scss">
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--white);

		.index {
			position: absolute;
			top: var(--sp-15);
			left: var(--sp-15);
			z-index: 2;
		}

		.zone {
			position: absolute;
			inset: 0;
			width: 50%;
			cursor: pointer;
			z-index: 1;

			&:focus-visible {
				outline: none;
			}

			&.next {
				left: auto;
			}
		}
	}
</style>
