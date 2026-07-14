import { error } from '@sveltejs/kit'
import { getPolicy } from '$lib/utils/sanity.js'

export async function load({ params }) {
	const policy = await getPolicy(params.slug)
	if (!policy) error(404, 'Not found')

	return {
		policy,
		seoSingle: { seoTitle: policy.title }
	}
}
