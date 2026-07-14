import { browser } from '$app/environment'

/** @param {number} mX1 @param {number} mY1 @param {number} mX2 @param {number} mY2 */
function cubicBezier(mX1, mY1, mX2, mY2) {
	/** @param {number} a1 @param {number} a2 */
	const A = (a1, a2) => 1 - 3 * a2 + 3 * a1
	/** @param {number} a1 @param {number} a2 */
	const B = (a1, a2) => 3 * a2 - 6 * a1
	/** @param {number} a1 */
	const C = (a1) => 3 * a1
	/** @param {number} t @param {number} a1 @param {number} a2 */
	const calcBezier = (t, a1, a2) => ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t
	/** @param {number} t @param {number} a1 @param {number} a2 */
	const calcSlope = (t, a1, a2) => 3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1)
	/** @param {number} x */
	function getTForX(x) {
		let guess = x
		for (let i = 0; i < 4; i++) {
			const slope = calcSlope(guess, mX1, mX2)
			if (slope === 0) return guess
			guess -= (calcBezier(guess, mX1, mX2) - x) / slope
		}
		return guess
	}
	/** @param {number} x */
	return (x) => calcBezier(getTForX(x), mY1, mY2)
}

// matches --transition: cubic-bezier(.77, 0, .175, 1) .3s in main.scss
const transitionEasing = cubicBezier(0.77, 0, 0.175, 1)

/**
 * @param {HTMLElement} node
 * @param {{duration?: number, delay?: number, easing?: (t: number) => number}} [params]
 */
export function revealWidth(node, { duration = 300, delay = 0, easing = transitionEasing } = {}) {
	const width = node.getBoundingClientRect().width
	const style = getComputedStyle(node)
	const paddingLeft = parseFloat(style.paddingLeft) || 0
	const paddingRight = parseFloat(style.paddingRight) || 0
	return {
		duration,
		delay,
		easing,
		/** @param {number} t */
		css: (t) =>
			`width: ${t * width}px; padding-left: ${t * paddingLeft}px; padding-right: ${t * paddingRight}px; overflow: hidden;`
	}
}

/**
 * @param {HTMLElement} node
 * @param {{duration?: number, blur?: number, easing?: (t: number) => number, fixed?: boolean}} [params]
 */
export function pageIn(node, { duration = 500, blur = 100, easing = transitionEasing, fixed = false } = {}) {
	const position = fixed ? 'position: fixed; inset: 0;' : 'position: absolute; inset: 0;'
	return {
		duration,
		easing,
		/** @param {number} t */
		css: (t) => `${position} opacity: ${t}; filter: blur(${(1 - t) * blur}px);`
	}
}

/**
 * @param {HTMLElement} node
 * @param {{duration?: number, blur?: number, easing?: (t: number) => number, fixed?: boolean}} [params]
 */
export function pageOut(node, { duration = 500, blur = 100, easing = transitionEasing, fixed = false } = {}) {
	// Freeze the outgoing page at its current scroll position: SvelteKit resets
	// the document scroll to top on navigation, and without this the outgoing
	// page would visibly jump while fading out. Viewport-fixed elements
	// (fixed: true) skip the scroll compensation and pin to the viewport.
	const scrollY = browser && !fixed ? window.scrollY : 0
	const position = fixed
		? 'position: fixed; inset: 0;'
		: `position: fixed; top: ${-scrollY}px; left: 0; right: 0;`
	return {
		duration,
		easing,
		/** @param {number} t */
		css: (t) => `${position} opacity: ${t}; filter: blur(${(1 - t) * blur}px);`
	}
}
