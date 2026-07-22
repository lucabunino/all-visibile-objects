import { pushState } from '$app/navigation'
import { page } from '$app/state'
import { browser } from '$app/environment'

let open = $state(false)
let startIndex = $state(0)

export function getGallery() {
	return {
		get open() {
			return open
		},
		get startIndex() {
			return startIndex
		},
		/** @param {boolean} v */
		setOpen(v) {
			open = v
		},
		// opening pushes a history entry so the browser Back button closes the
		// gallery instead of leaving the work page — see closeGallery
		/** @param {number} index */
		openGallery(index = 0) {
			startIndex = index
			open = true
			if (browser) pushState('', { gallery: true })
		},
		// closing via UI (not Back) consumes that same history entry, so the
		// stack stays consistent either way and Forward never "reopens" it
		closeGallery() {
			if (browser && page.state.gallery) history.back()
			else open = false
		}
	}
}
