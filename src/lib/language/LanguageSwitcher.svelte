<script lang="ts">
	import { locale } from 'svelte-i18n';
	import EnFlag from '../../assets/icons/BgFlag.svelte';
	import BgFlag from '../../assets/icons/BgFlag.svelte';
	import { onMount } from 'svelte';

	let currentLocale: LocaleKey;
	type LocaleKey = keyof typeof locales;

	onMount(() => {
		currentLocale = $locale as LocaleKey;
	});

	function changeLocale(newLocale: string) {
		$locale = newLocale;
	}

	const locales = {
		en: { Component: EnFlag, name: 'English' },
		bg: { Component: BgFlag, name: 'Bulgarian' }
	};
</script>

{#if currentLocale}
	<div class="dropdown dropdown-end">
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label tabindex="0" class="btn m-1">
			<svelte:component this={locales[currentLocale]?.Component} classList="w-6 h-6" />
		</label>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
			{#each Object.entries(locales) as [localeKey, { Component, name }]}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<a on:click={() => changeLocale(localeKey)}>
						<svelte:component this={Component} classList="w-6 h-6" />
						{name}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
