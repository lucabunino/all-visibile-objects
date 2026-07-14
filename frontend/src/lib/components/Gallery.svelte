<script>
	import Media from '$lib/components/Media.svelte'
	import CursorTag from '$lib/components/CursorTag.svelte'
	import { useScrollLock } from '$lib/utils/scrollLock.svelte.js'

	/** @type {{media: any[], galleryOpen?: boolean}} */
	let { media = [], galleryOpen = $bindable() } = $props()

	let index = $state(0)
	/** @type {'left' | 'right' | null} */
	let hovered = $state(null)

	useScrollLock(() => true)

	function close() { galleryOpen = false }
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
	<button class="close tag" type="button" onclick={close} aria-label="Close gallery">Close</button>
	<span class="tag no-pointer index">{index + 1}/{media.length}</span>

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
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--white);

		.close {
			position: absolute;
			top: var(--sp-15);
			right: var(--sp-15);
			z-index: 2;
		}

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
