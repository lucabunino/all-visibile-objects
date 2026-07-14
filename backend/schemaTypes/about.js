import {InfoOutlineIcon} from '@sanity/icons'
import wysiwyg from './fields/wysiwyg'
import {media} from './fields/media'
import {link} from './fields/link'

export default {
	name: 'about',
	type: 'document',
	icon: InfoOutlineIcon,
	groups: [
		{name: 'Contacts'},
		{name: 'Content'},
		{name: 'Media'},
	],
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'email',
			type: 'string',
			group: 'Contacts',
		},
		{
			name: 'instagram',
			type: 'object',
			group: 'Contacts',
			fields: [
				{name: 'handle', type: 'string'},
				{
					name: 'href',
					title: 'URL',
					type: 'string',
					validation: Rule =>
						Rule.custom(href => {
							if (!href) return true
							return /^https?:\/\//.test(href) ? true : 'Must be a valid URL'
						}),
				},
			],
		},
		wysiwyg('description', 'Content'),
		wysiwyg('approach', 'Content'),
		wysiwyg('philosophy', 'Content'),
		wysiwyg('methodology', 'Content'),
		{
			name: 'capabilities',
			type: 'array',
			of: [{type: 'reference', to: [{type: 'capability'}]}],
			group: 'Content',
			validation: Rule => Rule.unique(),
		},
		{
			name: 'clients',
			type: 'array',
			of: [{type: 'reference', to: [{type: 'client'}]}],
			group: 'Content',
			validation: Rule => Rule.unique(),
		},
		{
			name: 'commissions',
			type: 'array',
			of: [link('commission')],
			group: 'Content',
		},
		{
			name: 'images',
			type: 'array',
			of: [media('media')],
			group: 'Media',
		},
	],
}
