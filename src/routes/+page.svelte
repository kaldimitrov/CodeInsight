<script lang="ts">
	import { goto } from '$app/navigation';
	import background from '../assets/images/landing_background.jpg';
	import { t } from 'svelte-i18n';
	import LanguageSwitcher from '$lib/language/LanguageSwitcher.svelte';
</script>

<div class="hero min-h-screen" style={`background-image: url(${background});`}>
	<div class="absolute top-0 right-0 m-2">
		<LanguageSwitcher classList="w-12 h-12" />
	</div>
	<div class="hero-overlay bg-opacity-60"></div>
	<div class="hero-content text-center text-neutral-content">
		<div class="max-w-2xl">
			<h1 class="mb-8 text-6xl font-bold text-pretty">{$t('title')}</h1>
			<p class="mb-5 text-lg">
				{$t('landing.description')}
			</p>
			<div class="flex gap-8 justify-center align-middle">
				<button on:click={() => goto('/login')} class="btn btn-lg btn-primary"
					>{$t('landing.get_started')}</button
				>
			</div>
		</div>
	</div>
</div>
