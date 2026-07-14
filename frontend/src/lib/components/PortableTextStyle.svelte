<script>
    import { page } from "$app/state";
    import { getTemplate } from "$lib/utils/template";

	let { portableText, children } = $props()

	const value = $derived(portableText.value)
	const style = $derived(value?.style)
</script>

{#if value._type === 'link'}
	<a class="underline hover-gray" href={value?.href} target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noopener noreferrer' : undefined}>
		{@render children()}
	</a>
{:else if value._type === 'break'}
	<br />
{:else if style === 'h3'}
	<h3 class={getTemplate(page.route.id) === 'work' || getTemplate(page.route.id) === 'policy' ? 'su-s' : 'su-m'}>{@render children()}</h3>
{:else if style === 'h6'}
	<h6 class={getTemplate(page.route.id) === 'work' || getTemplate(page.route.id) === 'policy' ? 'su-s' : 'su-m'}>{@render children()}</h6>
{:else}
	<p>{@render children()}</p>
{/if}

<style lang="scss">
:global(.portableText h3 + *) {
	margin-top: .8em;
}
:global(.portableText * + h3) {
	text-transform: uppercase;
	margin-top: 2.4em;
}
:global(.portableText ul) {
	list-style: disc;
	padding: 0 1em;
}
:global(.portableText ol) {
	list-style: numeral;
	padding: 0 1em;
}
:global([data-template="policy"] .portableText h6 + *),
:global([data-template="policy"] .portableText h3 + *),
:global([data-template="work"] .portableText h6 + *),
:global([data-template="work"] .portableText h3 + *) {
	margin-top: var(--sp-6);
}
:global([data-template="policy"] .portableText * + h6),
:global([data-template="policy"] .portableText * + h3),
:global([data-template="work"] .portableText * + h6),
:global([data-template="work"] .portableText * + h3) {
	margin-top: var(--sp-48);
}
:global([data-template="policy"] .portableText p + p),
:global([data-template="work"] .portableText p + p) {
	
}
</style>