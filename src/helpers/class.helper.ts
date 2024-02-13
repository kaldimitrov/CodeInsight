import { ExecutionStatus } from './requests/enums/executionStatus';

export function getExecutionStatusColor(status: ExecutionStatus) {
	switch (status) {
		case ExecutionStatus.SUCCESS:
			return 'success';
		case ExecutionStatus.PENDING:
			return 'warning';
		case ExecutionStatus.ERRORED:
			return 'error';
		case ExecutionStatus.TIMEOUT:
			return 'error';
		default:
			return 'info';
	}
}
