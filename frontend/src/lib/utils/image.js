import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '$lib/utils/sanity.js'

const builder = createImageUrlBuilder(client)

/** @param {any} source */
export function urlFor(source) {
	if (source) return builder.image(source).auto('format')
}

export const GALLERY_HEIGHTS = [400, 800, 1200, 1600, 2000]

/** @param {any} image @param {number} [aspectRatio] */
export function gallerySrcset(image, aspectRatio = 1) {
	return GALLERY_HEIGHTS.map((h) => {
		try {
			const url = urlFor(image)?.height(h).url()
			return url ? `${url} ${Math.round(h * aspectRatio)}w` : null
		} catch {
			return null
		}
	})
		.filter(Boolean)
		.join(', ')
}

/** @param {number} [bp] @param {number} [width] */
export function gallerySizes(bp = 768, width = 50) {
	return `(max-width: ${bp}px) 100vw, ${width}vw`
}
