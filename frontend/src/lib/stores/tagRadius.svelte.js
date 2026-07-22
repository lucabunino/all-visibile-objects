let rounded = $state(false)

export function getTagRadius() {
	return {
		get rounded() {
			return rounded
		},
		toggle() {
			rounded = !rounded
		}
	}
}
