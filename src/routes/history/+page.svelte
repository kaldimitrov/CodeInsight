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
	import { ExecutionStatus } from '../../helpers/requests/enums/executionStatus';
	import { getLanguages } from '../../helpers/requests/code.requests';

	let data: TableHistory[] = [];
	let currentPage = 1;
	let pages: number;
	let pageSize: number;
	let languages: any[] = [];

	const filters = {
		name: null,
		language: null,
		status: null,
		min_cpu_usage: null,
		max_cpu_usage: null,
		min_memory_usage: null,
		max_memory_usage: null,
		min_execution_time: null,
		max_execution_time: null,
		date_start: null,
		date_end: null
	};

	onMount(async () => {
		const res = await getLanguages();
		languages = res?.data.languages;
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

	function handleTableClick(id: string) {}

	async function handleDelete(id: string) {
		await deleteHistory(id);
		fetchData();
	}

	function setSearchParam(key: string, value: any) {
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set(key, value);
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

		pushState(newUrl, {});
	}

	function nextPage() {
		if (currentPage < pages) {
			currentPage++;
			setSearchParam('page', currentPage);
			fetchData();
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			setSearchParam('page', currentPage);
			fetchData();
		}
	}

	$: visiblePages = calculateVisiblePages(pages, currentPage);

	function calculateVisiblePages(totalPages: number, current: number) {
		if (totalPages <= 9) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
			let startPages = allPages.slice(0, 5);
			let endPages = allPages.slice(-3);
			if (current <= 5) {
				return [...startPages, '...', ...endPages];
			} else if (current >= totalPages - 3) {
				return [...startPages, '...', ...endPages];
			} else {
				let middlePages = [current - 1, current, current + 1];
				return [...startPages.slice(0, 3), '...', ...middlePages, '...', ...endPages];
			}
		}
	}

	function handleSubmit() {
		for (const key in filters) {
			if (filters[key as keyof typeof filters] == null) {
				continue;
			}

			setSearchParam(key as keyof typeof filters, filters[key as keyof typeof filters]);
		}
		fetchData();
	}
</script>

<form class="flex flex-wrap gap-4 p-4">
	<div class="form-control max-w-64">
		<label for="name" class="label">
			<span class="label-text">{$t('filters.name')}</span>
		</label>
		<input type="text" maxlength="20" bind:value={filters.name} class="input input-bordered" />
	</div>

	<div class="form-control">
		<label for="language" class="label">
			<span class="label-text">{$t('filters.language')}</span>
		</label>
		<select bind:value={filters.language} class="select select-bordered">
			{#each languages as lang}
				<option value={lang.key}>{lang.name}</option>
			{/each}
		</select>
	</div>

	<div class="form-control">
		<label for="status" class="label">
			<span class="label-text">{$t('filters.status')}</span>
		</label>
		<select bind:value={filters.status} class="select select-bordered">
			{#each Object.values(ExecutionStatus) as option}
				<option>{option}</option>
			{/each}
		</select>
	</div>
	<div class="form-control gap-1">
		<label for="status" class="label">
			<span class="label-text">{$t('filters.execution_time')}</span>
		</label>
		<input
			type="number"
			placeholder={$t('filters.min_execution_time')}
			bind:value={filters.min_execution_time}
			class="input input-bordered"
		/>
		<input
			type="number"
			placeholder={$t('filters.max_execution_time')}
			bind:value={filters.max_execution_time}
			class="input input-bordered"
		/>
	</div>
	<div class="form-control gap-1">
		<label for="status" class="label">
			<span class="label-text">{$t('filters.cpu_usage')}</span>
		</label>
		<input
			type="number"
			placeholder={$t('filters.min_cpu')}
			bind:value={filters.min_cpu_usage}
			class="input input-bordered"
		/>
		<input
			type="number"
			placeholder={$t('filters.max_cpu')}
			bind:value={filters.max_cpu_usage}
			class="input input-bordered"
		/>
	</div>
	<div class="form-control gap-1">
		<label for="status" class="label">
			<span class="label-text">{$t('filters.memory_usage')}</span>
		</label>
		<input
			type="number"
			placeholder={$t('filters.min_memory')}
			pattern="[0-9]*"
			bind:value={filters.min_memory_usage}
			class="input input-bordered"
		/>
		<input
			type="number"
			pattern="^\d*\.?\d+$"
			placeholder={$t('filters.max_memory')}
			bind:value={filters.max_memory_usage}
			class="input input-bordered"
		/>
	</div>

	<div class="form-control w-full">
	  <button type="submit" class="btn btn-primary">Submit</button>
	</div>
</form>
<div class="overflow-x-auto flex justify-center items-center">
	<table class="table rounded-lg">
		<thead class="rounded-lg">
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
<div class="flex justify-center items-center mt-4 mx-auto gap-4 drop-shadow-md">
	<button class="btn btn-sm" on:click={prevPage} disabled={currentPage <= 1}
		>{$t('history.prev')}</button
	>
	<div class="flex gap-1">
		{#each visiblePages as page}
			{#if page === '...'}
				<button class="btn btn-sm">{page}</button>
			{:else}
				<button
					class={`btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
					on:click={() => {
						setSearchParam('page', Number(page));
						fetchData();
					}}
				>
					{page}
				</button>
			{/if}
		{/each}
	</div>
	<button class="btn btn-sm" on:click={nextPage} disabled={currentPage >= pages}
		>{$t('history.next')}</button
	>
</div>
