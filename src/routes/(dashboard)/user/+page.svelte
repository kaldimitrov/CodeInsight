<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { deleteUser, getUserInfo, updateUser } from '../../../helpers/requests/user.requests';
	import { clearUser, user } from '$lib/stores/userStore';
	import type { User } from '$lib/models/user.model';
	import { formatShortDateTime } from '../../../helpers/date.helper';
	import { MAX_FILE_DEPTH } from '$lib/constants';
	import { getHistoryReport } from '../../../helpers/requests/history.requests';
	import { NightThemeHighcharts, defaultOptions } from '../../../lib/chart.options';
	import * as Highcharts from 'highcharts';
	import Exporting from 'highcharts/modules/exporting';
	import { theme } from '$lib/theme/themeStore';
	import { Themes } from '$lib/theme/enums/themes';
	Exporting(Highcharts);

	let userDetails: User;
	let reportData: any;

	onMount(async () => {
		await getUserInfo();
		userDetails = user.value;

		const res = await getHistoryReport();
		reportData = res?.data;

		theme.subscribe((value) => {
			Highcharts.setOptions(value == Themes.DARK ? NightThemeHighcharts : defaultOptions);
			generateCharts();
		});
		Highcharts.setOptions($theme == Themes.DARK ? NightThemeHighcharts : defaultOptions);
		generateCharts();
	});

	afterUpdate(() => {
		generateCharts();
	});

	function generateCharts() {
		try {
			Highcharts.chart('stats-container', {
				chart: {
					type: 'column',
					styledMode: false,
					animation: true
				},
				accessibility: {
					enabled: true
				},
				credits: {
					enabled: false
				},
				xAxis: {
					categories: reportData.chartData.days
				},
				title: {
					text: '',
					align: 'center'
				},
				yAxis: {
					title: {
						text: $t('details.usage')
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle'
				},
				plotOptions: {
					series: {
						groupPadding: 0
					}
				},
				series: [
					{
						name: 'Cpu (%)',
						data: reportData.chartData.maxCpu
					},
					{
						name: 'Memory (MB)',
						data: reportData.chartData.maxMemory
					},
					{
						name: 'Execution Time (s)',
						data: reportData.chartData.executionTime.map((time: number) => time / 1000)
					}
				],
				responsive: {
					rules: [
						{
							condition: {
								maxWidth: 500
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								}
							}
						}
					]
				}
			});
		} catch (e) {}
	}

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
							<div class="flex gap-4 flex-wrap">
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
							<div class="flex gap-4 flex-wrap">
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.email')}</span>
									</label>
									<input
										type="email"
										placeholder={userDetails.email}
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
							<div class="flex gap-4 w-full flex-wrap">
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
						</form>
					</div>
					<div class="divider lg:divider-horizontal"></div>
					<div class="grid flex-grow h-full card rounded-box w-1/2">
						<div class="flex items-center justify-center text-2xl font-medium">
							{$t('user.limits')}
						</div>
						<form class="flex flex-col flex-wrap gap-4">
							<div class="flex gap-4 flex-wrap">
								<div class="form-control flex flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.max_files')}</span>
									</label>
									<input
										type="text"
										placeholder={String(userDetails.max_files)}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.max_file_depth')}</span>
									</label>
									<input
										type="text"
										placeholder={String(MAX_FILE_DEPTH)}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
							</div>
							<div class="flex gap-4 w-full flex-wrap">
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.max_runtime_duration')}</span>
									</label>
									<input
										type="text"
										placeholder={`${userDetails.max_runtime_duration / 1000}s`}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.max_memory_limit')}</span>
									</label>
									<input
										type="text"
										placeholder={`${userDetails.max_memory_limit}MB`}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
							</div>
							<div class="flex gap-4 w-full flex-wrap">
								<div class="form-control flex-1">
									<label for="name" class="label">
										<span class="label-text">{$t('user.execution_concurrency')}</span>
									</label>
									<input
										type="text"
										placeholder={String(userDetails.execution_concurrency)}
										class="input input-bordered disabled"
										disabled
									/>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div class="form-control flex flex-row w-full items-center justify-end gap-4 pt-4">
					<button on:click={handleDelete} type="button" class="btn btn-error min-w-36"
						>{$t('user.delete')}</button
					>
					<button on:click={handleSubmit} type="submit" class="btn btn-success min-w-36"
						>{$t('user.save')}</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
{#if reportData}
	<div class="card bg-base-100 m-4 shadow-xl">
		<div class="collapse collapse-arrow">
			<input type="checkbox" checked />
			<div class="collapse-title text-2xl font-bold flex items-center justify-center">
				<strong>
					{$t('details.stats_title')}
				</strong>
			</div>
			<div class="collapse-content pt-0">
				<div class="max-w-full rounded-md" id="stats-container"></div>
				<div class="stats bg-base-200 shadow flex flex-col md:flex-row items-center justify-center">
					<div class="stat flex items-center justify-center flex-col">
						<div class="stat-title">{$t('user.cpu_usage')}</div>
						<div class="stat-value">{reportData.totalMaxMemory}%</div>
					</div>
					<div class="stat flex items-center justify-center flex-col">
						<div class="stat-title">{$t('user.execution_time')}</div>
						<div class="stat-value">{reportData.totalExecutionTime / 1000}s</div>
					</div>
					<div class="stat flex items-center justify-center flex-col">
						<div class="stat-title">{$t('user.memory_usage')}</div>
						<div class="stat-value">{reportData.totalMaxMemory}MB</div>
					</div>
				</div>
				<div class="divider"></div>
			</div>
		</div>
	</div>
{/if}
