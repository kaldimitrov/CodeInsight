<script lang="ts">
	import hero from '../../../assets/images/login_hero.jpg';
	import { t } from 'svelte-i18n';
	import { loginUser } from '../../../helpers/requests/auth.requests';
	import { refreshToken, token } from '$lib/stores/userStore';
	import { onMount } from 'svelte';
	import { isTokenValid } from '../../../helpers/token.helper';
	import { goto } from '$app/navigation';
	import Logo from '../../../assets/icons/Logo.svelte';

	let isLoading = false;
	const form = {
		email: '',
		password: ''
	};

	onMount(() => {
		if (isTokenValid(token.value) || isTokenValid(refreshToken.value)) {
			return goto('/editor');
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();

		isLoading = true;
		if (await loginUser({ email: form.email, password: form.password })) {
			isLoading = false;
			return goto('/editor');
		}
		isLoading = false;
	}
</script>

<section class="flex flex-col md:flex-row h-screen items-center">
	<div class="bg-primary hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
		<img src={hero} alt="" class="w-full h-full object-cover" />
	</div>

	<div
		class="bg-base w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
          flex items-center justify-center"
	>
		<div class="w-full h-100">
			<div class="flex flex-row gap-4 w-11 h-11">
				<Logo classList="min-w-full min-h-full" />
				<h1 class="text-4xl font-bold">{$t('title')}</h1>
			</div>
			<h1 class="text-xl md:text-2xl font-bold leading-tight mt-12">{$t('auth.login_title')}</h1>

			<form class="mt-6" on:submit={handleSubmit}>
				<div>
					<label for="email" class="block">{$t('auth.email_title')}</label>
					<input
						type="email"
						name=""
						id=""
						placeholder={$t('auth.email_placeholder')}
						class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-primary focus:bg-white focus:outline-none"
						bind:value={form.email}
						required
					/>
				</div>

				<div class="mt-4">
					<label for="password" class="block">{$t('auth.password_title')}</label>
					<input
						type="password"
						name=""
						id=""
						placeholder={$t('auth.password_placeholder')}
						class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-primary
                  focus:bg-white focus:outline-none"
						bind:value={form.password}
						required
					/>
				</div>

				<button
					type="submit"
					class={`w-full block bg-primary hover:opacity-80 focus:opacity-80 text-primary-content font-semibold rounded-lg
                px-4 py-3 mt-6 ${isLoading ? 'tab-disabled' : ''}`}
					>{$t('auth.login_button')}</button
				>
			</form>

			<!-- <hr class="my-6 border-gray-300 w-full" /> -->

			<!-- <button
				type="button"
				class="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
			>
				<div class="flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						class="w-6 h-6"
						viewBox="0 0 48 48"
						><defs
							><path
								id="a"
								d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
							/></defs
						><clipPath id="b"><use xlink:href="#a" overflow="visible" /></clipPath><path
							clip-path="url(#b)"
							fill="#FBBC05"
							d="M0 37V11l17 13z"
						/><path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" /><path
							clip-path="url(#b)"
							fill="#34A853"
							d="M0 37l30-23 7.9 1L48 0v48H0z"
						/><path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" /></svg
					>
					<span class="ml-4"> Log in with Google </span>
				</div>
			</button> -->

			<p class="mt-8">
				{$t('auth.need_account')}
				<a href="/register" class="text-primary opacity-80 hover:opacity-100 font-semibold">
					{$t('auth.create_account')}
				</a>
			</p>
		</div>
	</div>
</section>
