import type { FileTypes } from '$lib/components/editor/enums/fileTypes';

export interface FileModel {
	uuid: string;
	label: string;
	type: FileTypes;
	content?: string;
	children?: FileModel[];
}
