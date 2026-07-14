let open = $state(false)

export function getGallery() {
	return {
		get open() {
			return open
		},
		/** @param {boolean} v */
		setOpen(v) {
			open = v
		}
	}
}
