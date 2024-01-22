import { signal } from '@preact/signals-core';

export const currentCode = signal('');
export const currentFile = signal('');

export function updateCode(code: string) {
	currentCode.value = code;
}

export function updateFile(file: string) {
	currentFile.value = file;
}
