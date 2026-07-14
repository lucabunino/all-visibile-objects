/** @param {string | null} routeId */
export function getTemplate(routeId) {
	switch (routeId) {
		case '/':
			return 'homepage'
		case '/about':
			return 'about'
		case '/works/[client]/[work]':
			return 'work'
		case '/policy/[slug]':
			return 'policy'
		default:
			return ''
	}
}
