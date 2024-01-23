import { signal } from '@preact/signals-core';

export const currentFile = signal('');

export function setCurrentFile(uuid: string) {
	currentFile.value = uuid;
}
