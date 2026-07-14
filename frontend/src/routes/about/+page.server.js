import { getAbout } from '$lib/utils/sanity.js'

export async function load() {
	const about = await getAbout()
	return {
		about,
		seoSingle: {
			seoTitle: 'About',
		}
	}
}