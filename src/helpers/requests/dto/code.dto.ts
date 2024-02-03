export interface FileDto {
	path: string;
	content: string;
}

export interface CodeSubmitDto {
	files: FileDto[];
	language: string;
	version: string;
}
