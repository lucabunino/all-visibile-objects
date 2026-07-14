const hrefField = {
	name: 'href',
	type: 'string',
	validation: Rule =>
		Rule.custom(href => {
			if (!href) return true
			return /^(https?:\/\/|mailto:|tel:)/.test(href)
				? true
				: 'Must be a valid URL, mailto:, or tel: link'
		}),
}

export function link(name, {label = true} = {}) {
	return {
		name,
		type: 'object',
		fields: label ? [{name: 'label', type: 'string'}, hrefField] : [hrefField],
	}
}
