import {EnterIcon, TextIcon, ImageIcon, BlockElementIcon} from '@sanity/icons'
import {media} from './fields/media'
import {AutoCloseItem} from './components/AutoCloseItem'
import wysiwyg from './fields/wysiwyg'

const textItem = {
	name: 'textItem',
	title: 'Text',
	type: 'object',
	icon: TextIcon,
	fields: [
		wysiwyg('text'),
	],
	preview: {
		prepare() {
			return {title: 'Text'}
		},
	},
}

const mediaItem = {
	...media('mediaItem'),
	title: 'Media',
	icon: ImageIcon,
	preview: {
		select: {type: 'type', image: 'image', videoPoster: 'videoPoster'},
		prepare({type, image, videoPoster}) {
			return {
				title: type === 'video' ? 'Media (video)' : 'Media (image)',
				media: type === 'video' ? videoPoster : image,
			}
		},
	},
}

const emptyItem = {
	name: 'emptyItem',
	title: 'Empty',
	type: 'object',
	icon: EnterIcon,
	components: {item: AutoCloseItem},
	fields: [
		{name: 'style', type: 'string', hidden: true, initialValue: 'Empty'},
	],
	preview: {
		prepare() {
			return {title: 'Empty'}
		},
	},
}

const itemLabels = {
	mediaItem: 'Media',
	textItem: 'Text',
	emptyItem: 'Empty',
}

export const workBlock = {
	name: 'workBlock',
	title: 'Block',
	type: 'object',
	icon: BlockElementIcon,
	fields: [
		{
			name: 'items',
			type: 'array',
			of: [mediaItem, textItem, emptyItem],
			options: {layout: 'grid'},
			validation: Rule => Rule.min(1).max(4),
		},
	],
	preview: {
		select: {items: 'items'},
		prepare({items}) {
			const count = items?.length || 0
			const subtitle = items?.map(item => itemLabels[item._type] || item._type).join(', ')
			const firstMedia = items?.find(item => item._type === 'mediaItem' && (item.image || item.videoPoster))
			const media = firstMedia && (firstMedia.type === 'video' ? firstMedia.videoPoster : firstMedia.image)
			return {title: `Block (${count} item${count === 1 ? '' : 's'})`, subtitle, media}
		},
	},
}
