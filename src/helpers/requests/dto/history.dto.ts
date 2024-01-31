import type { ExecutionStatus } from '../enums/executionStatus';
import { OrderTypes, OrderOptions } from '../enums/orderOptions';

export class GetHistoryDto {
	language?: string;
	status?: ExecutionStatus;

	min_cpu_usage?: number;
	max_cpu_usage?: number;

	min_memory_usage?: number;
	max_memory_usage?: number;

	min_execution_time?: number;
	max_execution_time?: number;

	date_start?: string;
	date_end?: string;

	orderBy: OrderTypes = OrderTypes.DESC;
	orderOptions: OrderOptions = OrderOptions.CREATED_AT;

	page: number = 1;
	pageSize: number = 20;
}
