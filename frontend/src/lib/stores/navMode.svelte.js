/** @type {'mouseover' | 'click'} */
let mode = $state('mouseover')

export function getNavMode() {
	return {
		get mode() {
			return mode
		},
		toggle() {
			mode = mode === 'mouseover' ? 'click' : 'mouseover'
		}
	}
}
