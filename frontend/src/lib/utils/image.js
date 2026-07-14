import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '$lib/utils/sanity.js'

const builder = createImageUrlBuilder(client)

/** @param {any} source */
export function urlFor(source) {
	if (source) return builder.image(source).auto('format')
}
