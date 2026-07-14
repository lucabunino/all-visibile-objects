import { getSeo, getNav, getAbout, getPolicies } from '$lib/utils/sanity.js'

export async function load() {
	const [seo, nav, about, policies] = await Promise.all([getSeo(), getNav(), getAbout(), getPolicies()])
	return { seo, nav, about, policies }
}
