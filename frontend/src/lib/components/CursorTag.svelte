<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window'
	import { fadeBlur, revealWidth } from '$lib/utils/transitions.js'
    import { fade } from 'svelte/transition';

	/** @type {{label?: string, direction?: 'left' | 'right'}} */
	let { label, direction } = $props()

	// Cursor-to-tag-center distance. Matches the old margin-top: var(--sp-40)
	// (root font-size is fixed at 14px, so --sp-40 is always 40px).
	const OFFSET = 40

	/** @type {number | null} */
	let x = $state(null)
	/** @type {number | null} */
	let y = $state(null)
	/** @type {HTMLElement | undefined} */
	let tagEl = $state()

	/** @param {MouseEvent} e */
	function track(e) {
		x = e.clientX
		y = e.clientY
	}

	const centerX = $derived.by(() => {
		if (x === null) return 0
		const half = (tagEl?.offsetWidth ?? 0) / 2
		const vw = innerWidth.current ?? 0
		return Math.max(half, Math.min(x, vw - half))
	})

	const centerY = $derived.by(() => {
		if (y === null) return 0
		const half = (tagEl?.offsetHeight ?? 0) / 2
		const vh = innerHeight.current ?? 0
		return y + OFFSET + half <= vh ? y + OFFSET : y - OFFSET/2
	})
</script>

<svelte:window onmousemove={track} />

{#if x !== null && y !== null}
	<span class="wrapper" bind:this={tagEl} 
	style:left="{centerX}px"
	style:top="{centerY}px"
	aria-hidden="true"
	>
		<!-- <div class="tag no-pointer cursor-tag" transition:revealWidth|global> -->
		<div class="tag no-pointer cursor-tag">
			{#if direction}
				<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg" class:rotate={direction === 'left'}>
					<path d="M9.75 5.19615L4.64275e-07 10.3923L9.18537e-07 -9.03023e-07L9.75 5.19615Z" />
				</svg>
			{:else if label}
				{label}
			{/if}
		</div>
	</span>
{/if}

<style lang="scss">
.wrapper {
	position: fixed;
	transform: translate(-50%, -50%);
	pointer-events: none;
	z-index: 1000;
	padding: var(--sp-15);
	
	.cursor-tag {
		white-space: nowrap;
		width: max-content;

		svg {
			display: block;
			fill: var(--white);

			&.rotate {
				transform: rotate(180deg);
			}
		}

		@media (pointer: coarse) {
			display: none;
		}
	}
}
</style>
