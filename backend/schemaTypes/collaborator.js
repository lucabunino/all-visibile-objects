import {UserIcon} from '@sanity/icons'

export default {
	name: 'collaborator',
	type: 'document',
	icon: UserIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'slug',
			type: 'slug',
			validation: Rule => Rule.required(),
			options: {source: 'title', maxLength: 96},
		},
		{
			name: 'href',
			type: 'string',
			validation: Rule =>
				Rule.custom(href => {
					if (!href) return true
					return /^https?:\/\//.test(href) ? true : 'Must be a valid URL'
				}),
		},
	],
}
