<script lang="ts">
	import { onMount } from 'svelte';
	import { connectSocket } from '../../helpers/socket.helper';
	import ThemeSwitcher from '$lib/theme/ThemeSwitcher.svelte';
	import { t } from 'svelte-i18n';
	import Logo from '../../assets/icons/Logo.svelte';
	import Profile from '../../assets/icons/Profile.svelte';
	import { clearToken, clearRefreshToken } from '$lib/stores/userStore';
	import { getUserInfo } from '../../helpers/requests/user.requests';
	import LanguageSwitcher from '$lib/language/LanguageSwitcher.svelte';

	onMount(async () => {
		Promise.all([await getUserInfo(), connectSocket()]);
	});
</script>

<div class="flex flex-col items-center min-h-screen bg-base-200">
	<div class="fixed top-0 z-40 flex justify-center w-full rounded-b-md">
		<div class="navbar bg-base-100 w-full rounded-b-2xl shadow-lg p-2 justify-between">
			<div class="md:w-1/3 justify-start pr-0">
				<div class="dropdown">
					<div tabindex="0" role="button" class="btn btn-ghost md:hidden pl-0 pr-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/></svg
						>
					</div>
					<ul
						class="menu menu-sm dropdown-content mt-3 p-2 bg-base-100 rounded-box w-64 shadow-2xl"
					>
						<li><a class="hover:text-primary" href="/">{$t('navbar.home')}</a></li>
						<li><a class="hover:text-primary" href="/editor">{$t('navbar.editor')}</a></li>
						<li><a class="hover:text-primary" href="/history">{$t('navbar.history')}</a></li>
					</ul>
				</div>
				<div class="flex md:hidden">
					<LanguageSwitcher classList="w-4 h-4" dropdownStart />
				</div>
				<a href="/" class="pl-4 hidden md:flex text-3xl font-bold">
					<div class="flex flex-row gap-4 w-11 h-11">
						<Logo classList="min-w-full min-h-full" />
						<h1 class="text-4xl font-bold">{$t('title')}</h1>
					</div></a
				>
			</div>
			<a href="/" class="md:hidden btn btn-ghost text-3xl font-bold px-0">
				<div class="flex flex-row justify-end items-center">
					<h1 class="text-3xl font-extrabold">{$t('title')}</h1>
				</div>
			</a>
			<section
				class="hidden md:flex justify-center items-center text-3xl font-bold px-2 w-1/3 h-full"
			>
				<ul class="menu menu-horizontal px-1">
					<li><a class="hover:text-primary text-2xl" href="/editor">{$t('navbar.editor')}</a></li>
					<li><a class="hover:text-primary text-2xl" href="/">{$t('navbar.home')}</a></li>
					<li><a class="hover:text-primary text-2xl" href="/history">{$t('navbar.history')}</a></li>
				</ul>
			</section>
			<div class="md:w-1/3 justify-between md:justify-end">
				<div class="flex justify-end items-center">
					<div class="hidden md:flex">
						<LanguageSwitcher />
					</div>
					<ThemeSwitcher classList="btn btn-ghost p-2 pl-0 md:p-2" />
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn btn-ghost p-2 px-0 md:px-2">
							<Profile classList="w-8 h-8" />
						</div>
						<ul class="menu menu-sm dropdown-content mt-3 p-2 bg-base-100 rounded-box shadow-2xl">
							<li>
								<a class="hover:text-primary" href="/user">{$t('navbar.user_view_profile')}</a>
							</li>
							<li>
								<a
									class="hover:text-primary"
									href="/"
									on:click={() => {
										clearToken();
										clearRefreshToken();
									}}>{$t('navbar.user_logout')}</a
								>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
	<main class="mx-auto w-full box-border flex flex-col pt-20">
		<slot />
	</main>
</div>
