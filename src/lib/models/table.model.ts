import type { ExecutionStatus } from '../../helpers/requests/enums/executionStatus';

export interface TableHistory {
	id: string;
	name: string;
	status: ExecutionStatus;
	language: string;
	execution_time: number;
	max_cpu: number;
	max_memory: number;
	created_at: string;
}
