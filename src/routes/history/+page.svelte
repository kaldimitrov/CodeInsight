<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	import { getHistory } from '../../helpers/requests/history.requests';
	import type { TableHistory } from '$lib/models/table.model';
	import { deleteHistory } from '../../helpers/requests/history.requests';
	import { t } from 'svelte-i18n';
	import { getExecutionStatusColor } from '../../helpers/class.helper';
	import { formatShortDateTime } from '../../helpers/date.helper';
	import { GetHistoryDto } from '../../helpers/requests/dto/history.dto';
	import { pushState } from '$app/navigation';

	let data: TableHistory[] = [];
	let currentPage = 1;
	let pages: number;
	let pageSize: number;
	onMount(async () => {
		fetchData();
	});

	function getAllUrlParamsWithDefaults() {
		const urlParams = new URLSearchParams(window.location.search);
		const dto = new GetHistoryDto({});

		for (const key of Object.keys(dto)) {
			let value = urlParams.get(key);
			if (value === null) continue;

			const parsedValue = isNaN(Number(value)) ? value : Number(value);
			dto[key] = parsedValue;
		}

		for (const key in dto) {
			if (dto[key] === undefined) {
				delete dto[key];
			}
		}

		return dto;
	}

	async function fetchData() {
		const filters = getAllUrlParamsWithDefaults();

		const res = await getHistory(filters);

		currentPage = filters.page;
		pages = res?.data?.pages;
		pageSize = res?.data?.pageSize;
		data = res?.data?.data;
	}

	function handleTableClick(id: string) {
	}

	async function handleDelete(id: string) {
		await deleteHistory(id);
		fetchData();
	}

	function goToPage(page: number) {
		currentPage = page;		
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('page', String(page));
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

		pushState(newUrl, {});
		fetchData();
	}

	function nextPage() {
		if (currentPage < pages) {
			goToPage(currentPage + 1);
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			goToPage(currentPage - 1);
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="table min-w-full">
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
					<td class="text-center">{formatShortDateTime(new Date(row.created_at))}</td>
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
<div class="flex justify-center items-center mt-4 mx-auto gap-4">
	<button class="btn btn-sm" on:click={prevPage} disabled={currentPage <= 1}>{$t('history.prev')}</button>
	<div>
		{#each Array(pages) as _, i}
			<button
				class={`btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
				on:click={() => goToPage(i + 1)}>
				{i + 1}
			</button>
		{/each}
	</div>
	<button class="btn btn-sm" on:click={nextPage} disabled={currentPage >= pages}>{$t('history.next')}</button>
</div>