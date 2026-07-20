<script>
	import { PortableText } from '@portabletext/svelte'
	import PortableTextStyle from '$lib/components/PortableTextStyle.svelte'
	import Media from '$lib/components/Media.svelte'

	let { data } = $props()
</script>

<article>
	<h1 class="sr-only">About</h1>
	{#if data.about.description}
		<div class="portableText about su-m">
			<PortableText value={data.about.description} components={{ block: PortableTextStyle, types: { break: PortableTextStyle }, marks: { link: PortableTextStyle } }} />
		</div>
	{/if}

	{#if data.about.email}
		<p class="email"><a class="hover-gray" href="mailto:{data.about.email}">{data.about.email}</a></p>
	{/if}

	{#if data.about.instagram?.href}
		<p class="instagram"><a class="hover-gray" href={data.about.instagram.href} target="_blank" rel="noopener noreferrer">{data.about.instagram.handle || 'Instagram'}</a></p>
	{/if}

	<!-- {#if data.about.approach}
		<div class="portableText approach su-s">
			<PortableText value={data.about.approach} components={{ block: PortableTextStyle, types: { break: PortableTextStyle }, marks: { link: PortableTextStyle } }} />
		</div>
	{/if}
	{#if data.about.philosophy}
		<div class="portableText philosophy su-s">
			<PortableText value={data.about.philosophy} components={{ block: PortableTextStyle, types: { break: PortableTextStyle }, marks: { link: PortableTextStyle } }} />
		</div>
	{/if}
	{#if data.about.methodology}
		<div class="portableText methodology su-s">
			<PortableText value={data.about.methodology} components={{ block: PortableTextStyle, types: { break: PortableTextStyle }, marks: { link: PortableTextStyle } }} />
		</div>
	{/if} -->

	{#if data.about.capabilities?.length}
		<ul class="capabilities">
			<h2>Capabilities</h2>
			{#each data.about.capabilities as capability (capability._key)}
				<li class="capability">{capability.title}</li>
			{/each}
		</ul>
	{/if}

	{#if data.about.clients?.length}
		<ul class="clients">
			<h2>Clients</h2>
			{#each data.about.clients as clientRef (clientRef._key)}
				<li class="client">{clientRef.title}</li>
			{/each}
		</ul>
	{/if}

	{#if data.about.commissions?.length}
		<ul class="commissions">
			<h2>Commissions and General Enquiries</h2>
			{#each data.about.commissions as commission (commission._key)}
				<li class="commission"><a class="hover-gray" href={commission.href}>{commission.label}</a></li>
			{/each}
		</ul>
	{/if}

	{#if data.about.images?.length}
		<ul>
			{#each data.about.images as image (image._key)}
				<li>
					<Media media={image} />
				</li>
			{/each}
		</ul>
	{/if}
</article>
