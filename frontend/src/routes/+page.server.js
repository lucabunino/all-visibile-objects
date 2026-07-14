import { getHomepage } from '$lib/utils/sanity.js'

export async function load() {
	const homepage = await getHomepage()
	return { works: homepage?.works || [] }
}
