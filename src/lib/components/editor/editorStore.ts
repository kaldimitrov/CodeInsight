import { signal } from '@preact/signals-core';

export const currentFile = signal('');
export const fileSystem = signal([] as any);

export function setCurrentFile(uuid: string) {
	currentFile.value = uuid;
}

export function setFileSystem(fs: any) {
	fileSystem.value = fs;
}

export function storeCurrentState() {
	localStorage.setItem('fileSystem', JSON.stringify(fileSystem.value));
}
