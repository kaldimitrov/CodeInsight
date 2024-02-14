<script>
	import { onMount } from 'svelte';
	import { getHistoryDetails } from '../../../../helpers/requests/history.requests';
	import { goto } from '$app/navigation';
	import { t } from 'svelte-i18n';
	import * as Highcharts from 'highcharts';
	import * as Exporting from 'highcharts/modules/exporting';
	// @ts-ignore	$
	Exporting(Highcharts);

	/** @type {import('./$types').PageData} */
	export let data;
	let history;

	onMount(async () => {
		const res = await getHistoryDetails(data.id);
		history = res?.data;
		if (!history) {
			goto('/history');
		}
		console.log(history);
		Highcharts.chart('container', {
			title: {
				text: 'U.S Solar Employment Growth',
				align: 'left'
			},

			subtitle: {
				text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
				align: 'left'
			},

			yAxis: {
				title: {
					text: 'Number of Employees'
				}
			},

			xAxis: {
				accessibility: {
					rangeDescription: 'Range: 2010 to 2020'
				}
			},

			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					},
					pointStart: 2010
				}
			},

			series: [
				{
					name: 'Installation & Developers',
					data: [43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157, 161454, 154610]
				},
				{
					name: 'Manufacturing',
					data: [24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243, 31050]
				},
				{
					name: 'Sales & Distribution',
					data: [11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213, 25663]
				},
				{
					name: 'Operations & Maintenance',
					data: [null, null, null, null, null, null, null, null, 11164, 11218, 10077]
				},
				{
					name: 'Other',
					data: [21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906, 10073]
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

<div class="card bg-base-100 m-4 shadow-xl">
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
			{$t('details.details_title')}
		</div>
		<div class="collapse-content pt-0">
			<div class="max-w-full" id="container"></div>
		</div>
	</div>
</div>
