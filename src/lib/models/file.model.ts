import type { FileTypes } from '../components/fileObject/enums/fileTypes';

export interface FileModel {
	uuid: string;
	label: string;
	type: FileTypes;
	content?: string;
	children?: FileModel[];
	readonly?: boolean;
}
