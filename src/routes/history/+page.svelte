<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	import { getHistory } from '../../helpers/requests/history.requests';
	import { OrderOptions, OrderTypes } from '../../helpers/requests/enums/orderOptions';
	import type { TableHistory } from '$lib/models/table.model';
	import { deleteHistory } from '../../helpers/requests/history.requests';
	import { t } from 'svelte-i18n';
	import { getExecutionStatusColor } from '../../helpers/class.helper';

	let data: TableHistory[] = [];
	onMount(async () => {
		fetchData();
	});

	const urlParamsDefaults = {
		page: 1,
		pageSize: 20,
		orderBy: OrderTypes.DESC,
		orderOptions: OrderOptions.CREATED_AT,
	};

	function getAllUrlParamsWithDefaults() {
		const urlParams = new URLSearchParams(window.location.search);
		const paramsWithDefaults: any = {};

		for (const key in urlParamsDefaults) {
			if (urlParamsDefaults.hasOwnProperty(key)) {
				const value: any = urlParams.get(key) !== null ? urlParams.get(key) : urlParamsDefaults[key as keyof typeof urlParamsDefaults];
				paramsWithDefaults[key] = isNaN(value) ? value : Number(value);
			}
		}

		return paramsWithDefaults;
	}

	async function fetchData() {
		const { page, pageSize, orderBy, orderOptions } = getAllUrlParamsWithDefaults();

		const res = await getHistory({ page, pageSize, orderBy, orderOptions });
		data = res?.data?.data;
	}

	function handleTableClick(id: string) {
	}

	async function handleDelete(id: string) {
		await deleteHistory(id);
		fetchData();
	}
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th class="text-center">{$t('history.table_name')}</th>
				<th class="text-center">{$t('history.table_status')}</th>
				<th class="text-center">{$t('history.table_language')}</th>
				<th class="text-center">{$t('history.table_execution_time')}</th>
				<th class="text-center">{$t('history.table_max_cpu')}</th>
				<th class="text-center">{$t('history.table_max_memory')}</th>
				<th class="text-center">{$t('history.table_date')}</th>
				<th class="text-center">{$t('history.table_actions')}</th>
			</tr>
		</thead>
		<tbody>
			{#each data as row (row.id)}
				<tr on:click|stopPropagation={() => handleTableClick(row.id)}>
					<td class="text-center">{row.name}</td>
					<td class="text-center">
						<div class={`badge badge-${getExecutionStatusColor(row.status)} gap-2`}>
							{row.status}
						</div>
					</td>
					<td class="text-center">{row.language}</td>
					<td class="text-center">{row.execution_time}s</td>
					<td class="text-center">{row.max_cpu}%</td>
					<td class="text-center">{row.max_memory}MB</td>
					<td class="text-center">{new Date(row.created_at)}</td>
					<td class="text-center">
						<button
							on:click|stopPropagation={() => handleTableClick(row.id)}
							class="btn btn-xs btn-info"
						>
							{$t('history.action_view')}
						</button>
						<button
							on:click|stopPropagation={() => handleDelete(row.id)}
							class="btn btn-xs btn-error"
						>
							{$t('history.action_delete')}
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
