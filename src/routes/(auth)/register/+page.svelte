<script lang="ts">
	import hero from '../../../assets/images/login_hero.jpg';
	import { t } from 'svelte-i18n';
	import { registerUser } from '../../../helpers/requests/auth.requests';
	import { goto } from '$app/navigation';
	import { pushNotification } from '$lib/stores/notificationStore';
	import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
	import { validatePassword } from '../../../helpers/regex.helper';
	import { onMount } from 'svelte';
	import { isTokenValid } from '../../../helpers/token.helper';
	import { token } from '$lib/stores/userStore';

	const form = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	};

	onMount(() => {
		if (isTokenValid(token.value)) {
			return goto('/editor');
		}
	});

	async function handleSubmit(event: any) {
		event.preventDefault();

		if (form.password !== form.confirmPassword) {
			return pushNotification('errors.passwords_do_not_match', AlertLevels.ERROR)
		}

		if (!validatePassword(form.password)) {
			return pushNotification('errors.invalid_password', AlertLevels.ERROR)
		}

		if (await registerUser({firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password})) {
			return goto('/editor')
		}	
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
			<h1 class="text-4xl font-bold">{$t('title')}</h1>
			<h1 class="text-xl md:text-2xl font-bold leading-tight mt-12">{$t('auth.register_title')}</h1>

			<form class="mt-6" action="#" on:submit={handleSubmit}>
				<div>
					<label for="firstName" class="block">{$t('auth.first_name_title')}</label>
					<input
						type="text"
						placeholder={$t('auth.first_name_placeholder')}
						class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-primary
                  focus:bg-white focus:outline-none"
						bind:value={form.firstName}
						required
					/>
				</div>
				<div class="mt-4">
					<label for="lastName" class="block">{$t('auth.last_name_title')}</label>
					<input
						type="text"
						placeholder={$t('auth.last_name_placeholder')}
						class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-primary
                  focus:bg-white focus:outline-none"
						bind:value={form.lastName}
						required
					/>
				</div>
				<div class="mt-4">
					<label for="email" class="block">{$t('auth.email_title')}</label>
					<input
						type="email"
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
						placeholder={$t('auth.password_placeholder')}
						class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-primary
                  focus:bg-white focus:outline-none"
						bind:value={form.password}
						required
					/>
				</div>
				<div class="mt-4">
					<label for="confirmPassword" class="block">{$t('auth.confirm_password_title')}</label>
					<input
						type="password"
						placeholder={$t('auth.confirm_password_placeholder')}
						class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-primary
                  focus:bg-white focus:outline-none"
						bind:value={form.confirmPassword}
						required
					/>
				</div>

				<button
					type="submit"
					class="w-full block bg-primary hover:opacity-80 focus:opacity-80 text-primary-content font-semibold rounded-lg
                px-4 py-3 mt-6">{$t('auth.register_button')}</button
				>
			</form>

			<p class="mt-8">
				{$t('auth.have_account')}
				<a href="/login" class="text-primary opacity-80 hover:opacity-100 font-semibold">
					{$t('auth.login_account')}
				</a>
			</p>
		</div>
	</div>
</section>
