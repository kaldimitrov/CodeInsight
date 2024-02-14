<script lang="ts">
	import { onMount } from 'svelte';
	import { getHistoryDetails } from '../../../../helpers/requests/history.requests';
	import { goto } from '$app/navigation';
	import { t } from 'svelte-i18n';
	import * as Highcharts from 'highcharts';
	import * as Exporting from 'highcharts/modules/exporting';
	// @ts-ignore	$
	Exporting(Highcharts);

	/** @type {import('./$types').PageData} */
	export let data: any;
	let history: any;
	const timeValues: string[] = ['0s'];
	const cpuValues: number[] = [0];
	const memoryValues: number[] = [0];

	onMount(async () => {
		const res = await getHistoryDetails(data.id);
		history = res?.data;
		if (!history) {
			goto('/history');
		}

		for (const stat of history.stats) {
			timeValues.push(((stat.time - history.start_time) / 1000).toPrecision(1) + 's');
			cpuValues.push(stat.cpu);
			memoryValues.push(stat.memory);
		}

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
	});
</script>

<div class="card bg-base-100 m-4 shadow-xl" id="main">
	<div class="collapse collapse-close">
		<div class="collapse-title text-xl font-medium flex justify-between pr-4">
			<div>
				{`${$t('details.id')}: ${data.id}`}
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
		<div class="collapse-title text-xl font-medium flex items-center justify-center">
			{$t('details.stats_title')}
		</div>
		<div class="collapse-content pt-0">
			<div class="max-w-full rounded-md" id="stats-container"></div>
		</div>
	</div>
</div>
{#if history?.logs}
	<div class="card bg-base-100 m-4 shadow-xl">
		<div class="collapse collapse-arrow">
			<input type="checkbox" checked />
			<div class="collapse-title text-xl font-medium flex items-center justify-center">
				{$t('details.logs_title')}
			</div>
			<div class="collapse-content pt-0">
				<textarea
					class="textarea flex-1 min-w-full shadow-lg rounded-md h-full"
					bind:value={history.logs}
					readonly
				/>
			</div>
		</div>
	</div>
{/if}
