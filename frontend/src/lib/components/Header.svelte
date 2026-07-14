<script>
	import { tick } from 'svelte'
	import { page } from '$app/state'
	import { getTemplate } from '$lib/utils/template'
	import { revealWidth } from '$lib/utils/transitions.js'

	let { nav = [], about } = $props()

	const DURATION = 400
	const STEP = 50
	const OPEN_DELAY = 150

	/** @type {'mouseover' | 'click'} */
	let navMode = $state('mouseover')

	let worksOpen = $state(false)
	/** @type {string | null | undefined} */
	let activeClientSlug = $state(null)
	/** @type {HTMLElement | undefined} */
	let headerEl = $state()
	/** @type {HTMLElement | undefined} */
	let navEl = $state()
	/** @type {HTMLButtonElement | undefined} */
	let worksButtonEl = $state()
	/** @type {HTMLButtonElement[]} */
	let clientRefs = $state([])
	/** @type {HTMLAnchorElement[]} */
	let workRefs = $state([])

	let activeClient = $derived(nav.find((c) => c.slug?.current === activeClientSlug))

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.shiftKey && e.key.toLowerCase() === 'n') {
			navMode = navMode === 'mouseover' ? 'click' : 'mouseover'
			closeAll()
		}
	}

	function closeAll() {
		clearTimeout(openTimeout)
		worksOpen = false
		activeClientSlug = null
	}

	// ---- mouseover mode: exactly how it worked before any click-mode work ----

	/** @type {ReturnType<typeof setTimeout>} */
	let openTimeout

	function openWorksHover() {
		clearTimeout(openTimeout)
		openTimeout = setTimeout(() => {
			worksOpen = true
		}, OPEN_DELAY)
	}

	function closeWorksHover() {
		closeAll()
	}

	/** focusout fires when the Works button loses focus to a client button
	 * (both inside the same <li>) — e.g. our own ArrowDown handler moving
	 * focus in. Unlike mouseleave, keyboard focus jumps genuinely move focus
	 * within the subtree, so this needs to check whether it actually left
	 * before closing, deferred to the next paint for cross-browser reliability. */
	/** @param {FocusEvent & {currentTarget: HTMLElement}} e */
	function handleWorksFocusOut(e) {
		const li = e.currentTarget
		requestAnimationFrame(() => {
			if (!li.contains(document.activeElement)) closeAll()
		})
	}

	// ---- click mode: minimal, click-to-select + click-outside-to-close ----

	// mousedown fires before focus, so this captures true prior state —
	// toggleWorksClick then toggles off that, not off the live worksOpen
	// (which onfocus may have just flipped true on this same interaction)
	let worksOpenBeforeInteraction = false

	function captureWorksOpenState() {
		worksOpenBeforeInteraction = worksOpen
	}

	function toggleWorksClick() {
		worksOpen = !worksOpenBeforeInteraction
		if (!worksOpen) activeClientSlug = null
	}

	/** @param {MouseEvent} e */
	function handleWindowClick(e) {
		if (navMode !== 'click' || !worksOpen) return
		if (e.target instanceof Node && !navEl?.contains(e.target)) closeAll()
	}

	// ---- keyboard: finder-column nav, same in both modes ----

	function focusWorksButton() {
		worksOpen = true
	}

	/** @param {KeyboardEvent} e */
	function handleWorksKeydown(e) {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			worksOpen = true
			tick().then(() => clientRefs[0]?.focus())
		}
	}

	/** @param {KeyboardEvent} e @param {number} i @param {string | undefined} slug */
	async function handleClientKeydown(e, i, slug) {
		if (e.key === 'ArrowUp' && i === 0) {
			e.preventDefault()
			activeClientSlug = null
			worksButtonEl?.focus()
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			clientRefs[i - 1]?.focus()
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			clientRefs[i + 1]?.focus()
		} else if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault()
			activeClientSlug = slug
			await tick()
			workRefs[0]?.focus()
		} else if (e.key === 'Escape') {
			e.preventDefault()
			closeAll()
			worksButtonEl?.focus()
		}
	}

	/** @param {KeyboardEvent} e @param {number} i */
	function handleWorkKeydown(e, i) {
		if (e.key === 'ArrowUp') {
			e.preventDefault()
			workRefs[i - 1]?.focus()
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			workRefs[i + 1]?.focus()
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault()
			clientRefs.find((el) => el?.getAttribute('data-slug') === activeClientSlug)?.focus()
		} else if (e.key === 'Escape') {
			e.preventDefault()
			closeAll()
			worksButtonEl?.focus()
		}
	}

	// left/right between top-level header items (logo, Works, About,
	// Instagram/Play). Delegated on the header — bubbled events from inside
	// the clients/works columns won't match any top-level item (they're not
	// direct children of #logo or a .menu-item), so this only fires for them.
	/** @param {KeyboardEvent} e */
	function handleTopLevelKeydown(e) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
		if (!(e.target instanceof HTMLElement)) return
		const items = Array.from(headerEl?.querySelectorAll('#logo, .menu-item > .tag') ?? [])
		const currentIndex = items.indexOf(e.target)
		if (currentIndex === -1) return
		e.preventDefault()
		const nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1
		if (items[nextIndex] instanceof HTMLElement) items[nextIndex].focus()
	}
</script>

<svelte:window onkeydown={handleKeydown} onclick={handleWindowClick} />

{#snippet worksDropdown()}
	{#if worksOpen}
		<div id="clients">
			<ul role="menu" aria-label="Clients" class="clients overflow-y">
				{#each nav as client, i (client.slug?.current)}
					<li role="none" class="client">
						<button class="tag" class:no-pointer={navMode === 'mouseover'} type="button" role="menuitem"
						bind:this={clientRefs[i]}
						data-slug={client.slug?.current}
						in:revealWidth|global={{ duration: DURATION, delay: i * STEP }}
						out:revealWidth|global={{ duration: worksOpen ? 0 : DURATION }}
						class:active={activeClientSlug === client.slug?.current}
						class:inactive={activeClient && activeClientSlug !== client.slug?.current}
						aria-expanded={activeClientSlug === client.slug?.current}
						onmouseenter={() => navMode === 'mouseover' && (activeClientSlug = client.slug?.current)}
						onclick={() => (activeClientSlug = client.slug?.current)}
						onfocus={() => (activeClientSlug = client.slug?.current)}
						onkeydown={(e) => handleClientKeydown(e, i, client.slug?.current)}
						>
							<span class="title">{client.title}</span>
							{#if activeClientSlug === client.slug?.current}
								<span class="length">{String(client.works.length).padStart(2, '0')}</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
			{#if activeClient}
				<ul class="works overflow-y" aria-label="Works for {activeClient.title}">
					{#each activeClient.works as work, i (work.slug?.current)}
						<li class="work">
							<a class="tag" href="/works/{activeClient.slug?.current}/{work.slug?.current}"
							bind:this={workRefs[i]}
							onkeydown={(e) => handleWorkKeydown(e, i)}
							in:revealWidth|global={{ duration: DURATION, delay: i * STEP }}
							out:revealWidth|global={{ duration: activeClient ? 0 : DURATION }}
							>
							{work.title}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
{/snippet}

<header>
	<div style:display="contents" role="menubar" tabindex="-1" bind:this={headerEl} onkeydown={handleTopLevelKeydown}>
		<a id="logo" class="tag" href="/">All Visible Object</a>
		<nav aria-label="Main" id="menu" style:--clientsCount={nav.length}>
			<ul class="menu" bind:this={navEl}>
				{#if navMode === 'mouseover'}
					<li id="works" class="menu-item" onmouseenter={openWorksHover} onmouseleave={closeWorksHover} onfocusin={openWorksHover} onfocusout={handleWorksFocusOut}>
						<button class="tag no-pointer" class:active={worksOpen} type="button" bind:this={worksButtonEl} onkeydown={handleWorksKeydown} aria-haspopup="true" aria-expanded={worksOpen} aria-controls="clients">Works</button>
						{@render worksDropdown()}
					</li>
				{:else}
					<li id="works" class="menu-item">
						<button class="tag" class:active={worksOpen} type="button" bind:this={worksButtonEl} onmousedown={captureWorksOpenState} onclick={toggleWorksClick} onfocus={focusWorksButton} onkeydown={handleWorksKeydown} aria-haspopup="true" aria-expanded={worksOpen} aria-controls="clients">Works</button>
						{@render worksDropdown()}
					</li>
				{/if}
				<li class="menu-item about"><a class="tag" href="/about">About</a></li>
				{#if about.instagram?.href && getTemplate(page.route.id) !== 'work'}
					<li class="menu-item instagram">
						<a class="tag" href={about.instagram.href} target="_blank" rel="noopener noreferrer">{about.instagram.handle}</a>
					</li>
				{/if}
			</ul>
		</nav>
	</div>
</header>

<style lang="scss">
header {
	position: fixed;
	z-index: 10;
	inset: var(--sp-15) var(--sp-15) auto var(--sp-15);
	display: grid;
	align-items: start;
	grid-template-columns: repeat(12, 1fr);
	gap: var(--sp-15);
	--worksWidth: 20rem;
	pointer-events: none;

	.tag,
	#works {
		pointer-events: all;
	}

	#logo {
		grid-column: 1 / span 2;
		width: fit-content;
	}

	#menu {
		grid-column: 3 / span 10;

		.menu {
			display: flex;
			gap: var(--sp-5);

			#works {
				button {
					&:hover {
						background-color: var(--black);
					}
				}

				#clients {
					position: relative;

					.tag {
						width: var(--worksWidth);
						white-space: pre;
					}

					.clients {
						position: absolute;
						display: flex;
						flex-direction: column;
						row-gap: var(--sp-5);
						padding: var(--sp-5) 0;
						max-height: calc(100vh - var(--tagHeight) - var(--sp-15));

						.client {
							button {
								display: flex;
								justify-content: space-between;
							}
						}
					}

					.works {
						position: absolute;
						padding: var(--sp-5) calc(var(--worksWidth) + var(--sp-5));
						z-index: -1;
						display: flex;
						flex-direction: column;
						row-gap: var(--sp-5);
						min-height: calc(var(--clientsCount)*var(--tagHeight) + var(--clientsCount)*var(--sp-5));
						max-height: calc(100vh - var(--tagHeight) - var(--sp-15));

						.work {
							display: contents;
						}
					}
				}
			}

			.instagram {
				margin-left: auto;
			}
		}
	}
}
</style>
