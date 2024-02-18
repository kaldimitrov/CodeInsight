<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { deleteUser, getUserInfo, updateUser } from '../../../helpers/requests/user.requests';
	import { clearUser, user } from '$lib/stores/userStore';
	import type { User } from '$lib/models/user.model';
	import { formatShortDateTime } from '../../../helpers/date.helper';

	let userDetails: User;
	onMount(async () => {
		await getUserInfo();
		userDetails = user.value;
	});

	async function handleDelete() {
		clearUser();
		await deleteUser();
		goto('/');
	}

	async function handleSubmit() {
		await updateUser({ firstName: userDetails.firstName, lastName: userDetails.lastName });
		userDetails = user.value;
	}
</script>

{#if userDetails}
	<div class="card bg-base-100 m-4 shadow-xl">
		<div class="collapse collapse-arrow">
			<input type="checkbox" checked />
			<div class="collapse-title text-2xl font-bold flex items-center justify-center">
				{$t('user.title')}
			</div>
			<div class="collapse-content pt-0 w-full">
				<div class="flex flex-col w-full lg:flex-row">
					<div class="grid flex-grow h-full card rounded-box w-1/2">
						<div class="flex items-center justify-center text-2xl font-medium">
							{$t('user.details')}
						</div>
						<form class="flex flex-col flex-wrap gap-4">
							<div class="flex gap-4">
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.first_name')}</span>
									</label>
									<input
										type="text"
										maxlength="20"
										bind:value={userDetails.firstName}
										class="input input-bordered"
										required
									/>
								</div>
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.last_name')}</span>
									</label>
									<input
										type="text"
										maxlength="20"
										bind:value={userDetails.lastName}
										class="input input-bordered"
										required
									/>
								</div>
							</div>
							<div class="flex gap-4">
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.email')}</span>
									</label>
									<input
										type="email"
										bind:value={userDetails.email}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.role')}</span>
									</label>
									<input
										type="text"
										placeholder={userDetails.role}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
							</div>
							<div class="flex gap-4 w-full">
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.created_at')}</span>
									</label>
									<input
										type="text"
										placeholder={formatShortDateTime(new Date(userDetails.created_at))}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.updated_at')}</span>
									</label>
									<input
										type="text"
										placeholder={formatShortDateTime(new Date(userDetails.updated_at))}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
							</div>
							<div class="form-control flex w-full flex-row-reverse gap-4 pt-4">
								<button on:click={handleSubmit} type="submit" class="btn btn-success min-w-36"
									>{$t('user.save')}</button
								>
								<button on:click={handleDelete} type="button" class="btn btn-error min-w-36"
									>{$t('user.delete')}</button
								>
							</div>
						</form>
					</div>
					<div class="divider lg:divider-horizontal"></div>
					<div class="grid flex-grow h-full card rounded-box w-1/2">
						<div class="flex items-center justify-center text-2xl font-medium">
							{$t('user.limits')}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
