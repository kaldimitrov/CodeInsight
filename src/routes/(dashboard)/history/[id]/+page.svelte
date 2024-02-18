<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { getHistoryDetails } from '../../../../helpers/requests/history.requests';
	import { goto } from '$app/navigation';
	import { t } from 'svelte-i18n';
	import * as Highcharts from 'highcharts';
	import Exporting from 'highcharts/modules/exporting';
	import { theme } from '$lib/theme/themeStore';
	import { Themes } from '$lib/theme/enums/themes';
	import { NightThemeHighcharts, defaultOptions } from '../../../../lib/chart.options';
	import { getExecutionStatusColor } from '../../../../helpers/class.helper';
	import { formatEpochTime } from '../../../../helpers/date.helper';
	import { getLanguages } from '../../../../helpers/requests/code.requests';
	Exporting(Highcharts);

	/** @type {import('./$types').PageData} */
	export let data: { id: string };
	let history: any;
	const timeValues: string[] = ['0s'];
	const cpuValues: number[] = [0];
	const memoryValues: number[] = [0];
	let languages: any[] = [];

	afterUpdate(() => {
		generateChart();
	});

	onMount(async () => {
		const resLanguages = await getLanguages();
		languages = resLanguages?.data.languages;

		const res = await getHistoryDetails(data.id);
		history = res?.data;
		if (!history) {
			goto('/history');
		}

		for (const stat of history.stats) {
			timeValues.push((stat.time - history.start_time) / 1000 + 's');
			cpuValues.push(stat.cpu);
			memoryValues.push(stat.memory);
		}
		theme.subscribe((value) => {
			Highcharts.setOptions(value == Themes.DARK ? NightThemeHighcharts : defaultOptions);
			generateChart();
		});

		Highcharts.setOptions($theme == Themes.DARK ? NightThemeHighcharts : defaultOptions);
		generateChart();
	});

	function findLanguageName(key: string) {
		const lang = languages.find((lang) => lang.key === key);
		return lang?.name;
	}

	function generateChart() {
		if (!history?.stats?.length) {
			return;
		}

		try {
			Highcharts.chart('stats-container', {
				chart: {
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
					categories: timeValues
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
						name: 'Cpu',
						data: cpuValues
					},
					{
						name: 'Memory',
						data: memoryValues
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
</script>

<div class="card bg-base-100 m-4 shadow-xl" id="main">
	<div class="collapse collapse-close">
		<div class="collapse-title text-2xl font-bold flex justify-between pr-4">
			<div class="flex gap-4 w-full">
				<div
					class={`h-full aspect-square bg-${getExecutionStatusColor(history?.status)} rounded-full`}
				></div>
				<div class="hidden md:flex">
					{`${$t('details.id')}: ${data.id}`}
				</div>
			</div>
			<button
				class="btn btn-sm btn-primary"
				on:click={() => {
					goto('/history');
				}}>{$t('details.back_button')}</button
			>
		</div>
	</div>
</div>
<div class="card bg-base-100 m-4 shadow-xl">
	<div class="collapse collapse-arrow">
		<input type="checkbox" checked />
		<div class="collapse-title text-2xl font-bold flex items-center justify-center">
			<strong>
				{$t('details.information')}
			</strong>
		</div>
		<div class="collapse-content pt-0 max-w-full overflow-x-auto">
			<div
				class="stats bg-base-200 shadow flex flex-col md:flex-row items-center justify-center max-w-full"
			>
				<div class="stat flex items-center justify-center flex-col">
					<div class="stat-title">{$t('details.name')}</div>
					<div class="stat-value">{history?.name}</div>
				</div>
				<div class="stat flex items-center justify-center flex-col">
					<div class="stat-title">{$t('details.status')}</div>
					<div class="stat-value">
						{history?.status}
					</div>
				</div>
				<div class="stat flex items-center justify-center flex-col">
					<div class="stat-title">{$t('details.language')}</div>
					<div class="stat-value">{findLanguageName(history?.language)}</div>
				</div>
				<div class="stat flex items-center justify-center flex-col">
					<div class="stat-title">{$t('details.start_time')}</div>
					<div class="stat-value">{formatEpochTime(history?.start_time)}</div>
				</div>
				<div class="stat flex items-center justify-center flex-col">
					<div class="stat-title">{$t('details.end_time')}</div>
					<div class="stat-value">{formatEpochTime(history?.end_time)}</div>
				</div>
			</div>
		</div>
	</div>
</div>
{#if history?.stats?.length}
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
						<div class="stat-title">{$t('details.max_cpu')}</div>
						<div class="stat-value">{history?.max_cpu}%</div>
					</div>
					<div class="stat flex items-center justify-center flex-col">
						<div class="stat-title">{$t('details.execution_time')}</div>
						<div class="stat-value">{history?.execution_time / 1000}s</div>
					</div>
					<div class="stat flex items-center justify-center flex-col">
						<div class="stat-title">{$t('details.max_memory')}</div>
						<div class="stat-value">{history?.max_memory}MB</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
{#if history?.logs}
	<div class="card bg-base-100 m-4 shadow-xl">
		<div class="collapse collapse-arrow">
			<input type="checkbox" checked />
			<div class="collapse-title text-2xl font-bold flex items-center justify-center">
				<strong>
					{$t('details.logs_title')}
				</strong>
			</div>
			<div class="collapse-content pt-0">
				<textarea
					class="textarea flex-1 min-w-full shadow-inner rounded-md bg-base-200 h-64"
					bind:value={history.logs}
					readonly
				/>
			</div>
		</div>
	</div>
{/if}
