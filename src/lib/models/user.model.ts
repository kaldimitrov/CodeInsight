export enum Roles {
	ADMIN = 'Admin',
	USER = 'User'
}

export interface User {
	id: number;

	firstName: string;
	lastName: string;
	email: string;
	role: Roles;

	max_memory_limit: number;
	execution_concurrency: number;
	max_files: number;
	max_runtime_duration: number;

	created_at: Date;
	updated_at: Date;
}
