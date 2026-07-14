import {useEffect} from 'react'

export function AutoCloseItem(props) {
	const {open, onClose, renderDefault} = props

	useEffect(() => {
		if (open) onClose()
	}, [open, onClose])

	return renderDefault(props)
}