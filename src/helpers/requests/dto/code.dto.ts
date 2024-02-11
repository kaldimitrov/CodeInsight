export interface FileDto {
	path: string;
	content: string;
}

export interface CodeSubmitDto {
	name: string;
	files: FileDto[];
	language: string;
	version: string;
}
