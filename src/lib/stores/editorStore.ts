import type { FileModel } from '$lib/models/file.model';
import { signal } from '@preact/signals-core';

export const currentFile = signal('');
export const fileSystem = signal([] as FileModel[]);

export function setCurrentFile(uuid: string) {
	currentFile.value = uuid;
}

export function setFileSystem(fs: FileModel[]) {
	fileSystem.value = fs;
}

export function storeCurrentState() {
	localStorage.setItem('fileSystem', JSON.stringify(fileSystem.value));
}
