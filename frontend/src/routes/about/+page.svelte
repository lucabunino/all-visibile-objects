<script>
	import { PortableText } from '@portabletext/svelte'
	import PortableTextStyle from '$lib/components/PortableTextStyle.svelte'
	import Media from '$lib/components/Media.svelte'

	let { data } = $props()
	const about = $derived(data.about)

	const ptComponents = {
		block: PortableTextStyle,
		types: { break: PortableTextStyle },
		marks: { link: PortableTextStyle }
	}
</script>

<article>
	<h1 class="sr-only">About</h1>

	<PortableText value={about.description} components={ptComponents} />

	{#if about.email}
		<p class="email"><a class="hover-gray" href="mailto:{about.email}">{about.email}</a></p>
	{/if}

	{#if about.instagram?.href}
		<p class="instagram"><a class="hover-gray" href={about.instagram.href} target="_blank" rel="noopener noreferrer">{about.instagram.handle || 'Instagram'}</a></p>
	{/if}

	<PortableText value={about.approach} components={ptComponents} />
	<PortableText value={about.philosophy} components={ptComponents} />
	<PortableText value={about.methodology} components={ptComponents} />

	{#if about.capabilities?.length}
		<ul class="capabilities">
			<h2>Capabilities</h2>
			{#each about.capabilities as capability (capability._key)}
				<li class="capability">{capability.title}</li>
			{/each}
		</ul>
	{/if}

	{#if about.clients?.length}
		<ul class="clients">
			<h2>Clients</h2>
			{#each about.clients as clientRef (clientRef._key)}
				<li class="client">{clientRef.title}</li>
			{/each}
		</ul>
	{/if}

	{#if about.commissions?.length}
		<ul class="commissions">
			<h2>Commissions and General Enquiries</h2>
			{#each about.commissions as commission (commission._key)}
				<li class="commission"><a class="hover-gray" href={commission.href}>{commission.label}</a></li>
			{/each}
		</ul>
	{/if}

	{#if about.images?.length}
		<ul>
			{#each about.images as image (image._key)}
				<li>
					<Media media={image} />
				</li>
			{/each}
		</ul>
	{/if}
</article>
