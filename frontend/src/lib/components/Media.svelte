<script>
	import { urlFor } from '$lib/utils/image.js'

	/** @type {{media: any, bp?: number, width?: number, class?: string}} */
	let { media, bp = 768, width = 100, class: className = '' } = $props()

	/** @param {() => string | undefined} fn */
	function safely(fn) {
		try {
			return fn()
		} catch {
			return undefined
		}
	}

	const widths = [400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600]

	/** @param {any} image */
	function srcset(image) {
		return widths.map((w) => `${safely(() => urlFor(image)?.width(w).url())} ${w}w`).join(', ')
	}

	const aspectRatio = $derived(media?.type === 'video' ? media?.posterAspectRatio : media?.aspectRatio)
	const lqip = $derived(media?.type === 'video' ? media?.posterLqip : media?.lqip)

	let loaded = $state(false)
	let entered = $state(false)

	/** @param {Element} node */
	function observeEntry(node) {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				entered = true
				observer.disconnect()
			}
		})
		observer.observe(node)
		return () => observer.disconnect()
	}
</script>

<div
	class="media-container {className}"
	style:aspect-ratio={aspectRatio}
	style:--aspect-ratio={aspectRatio}
	style:background-image={lqip ? `url(${lqip})` : undefined}
	{@attach observeEntry}
>
	{#if media?.type === 'video' && media.video}
		<video autoplay muted loop playsinline poster={safely(() => urlFor(media.videoPoster)?.url())} onloadeddata={() => (loaded = true)}>
			{#if media.videoMobile}
				<source media="(max-width: 768px)" src={media.videoMobile.asset?.url} type="video/mp4" />
			{/if}
			<source src={media.video.asset?.url} type="video/mp4" />
		</video>
	{:else if media?.image}
		<picture>
			{#if media.imageMobile}
				<source media="(max-width: {bp}px)" srcset={srcset(media.imageMobile)} />
			{/if}
			<img
				src={safely(() => urlFor(media.image)?.width(1200).url())}
				srcset={srcset(media.image)}
				sizes="(max-width: {bp}px) 100vw, {width}vw"
				loading="lazy"
				alt=""
				onload={() => (loaded = true)}
			/>
		</picture>
	{/if}

	<div class="blur-overlay" class:loaded={loaded && entered} aria-hidden="true"></div>
</div>

<style lang="scss">
	.media-container {
		display: block;
		position: relative;
		overflow: hidden;
		isolation: isolate;
		background-size: cover;
		background-position: center;

		picture {
			display: contents;
		}

		img,
		video {
			position: relative;
			z-index: 1;
			display: block;
			width: 100%;
			height: 100%;
			max-width: 100%;
		}

		.blur-overlay {
			position: absolute;
			inset: 0;
			z-index: 2;
			backdrop-filter: blur(20px);
			transition: var(--transition);
			transition-delay: 100ms;
			pointer-events: none;

			&.loaded {
				backdrop-filter: blur(0);
			}
		}

		&.gallery {
			display: inline-block;
			width: min(calc(100vw - var(--sp-15) * 2), calc((100vh - var(--sp-15) * 8) * var(--aspect-ratio, 1)));
			height: min(calc(100vh - var(--sp-15) * 8), calc((100vw - var(--sp-15) * 2) / var(--aspect-ratio, 1)));

			img,
			video {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
