import type { FileModel } from '$lib/models/file.model';
import { signal } from '@preact/signals-core';
import Cookies from 'js-cookie';

export const currentFile = signal('');
export const fileSystem = signal([] as FileModel[]);

export function setCurrentFile(uuid: string) {
	currentFile.value = uuid;
}

export function setFileSystem(fs: FileModel[]) {
	fileSystem.value = fs;
}

export function storeCurrentState() {
	Cookies.set('fileSystem', JSON.stringify(fileSystem.value));
}
