<script lang="ts">
	import { locale } from 'svelte-i18n';
	import EnFlag from '../../assets/icons/EnFlag.svelte';
	import BgFlag from '../../assets/icons/BgFlag.svelte';
	import { onMount } from 'svelte';

	export let classList = '';
	export let dropdownStart = false;
	let currentLocale: LocaleKey;
	type LocaleKey = keyof typeof locales;

	onMount(() => {
		currentLocale = $locale as LocaleKey;
	});

	function changeLocale(newLocale: string) {
		$locale = newLocale;
		currentLocale = $locale as LocaleKey;
	}

	const locales = {
		en: { Component: EnFlag, name: 'English' },
		bg: { Component: BgFlag, name: 'Bulgarian' }
	};
</script>

{#if currentLocale}
	<div class={`dropdown ${dropdownStart ? 'dropdown-start' : 'dropdown-end'}`}>
		<button class="btn btn-ghost px-2">
			<svelte:component
				this={locales[currentLocale]?.Component}
				classList={`w-8 h-8 ${classList}`}
			/>
		</button>
		<ul tabindex="-1" class="dropdown-content menu shadow bg-base-100 rounded-box w-52">
			{#each Object.entries(locales) as [localeKey, { Component, name }]}
				<li>
					<button on:click={() => changeLocale(localeKey)}>
						<svelte:component this={Component} classList={`w-8 h-8 ${classList}`} />
						{name}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}
