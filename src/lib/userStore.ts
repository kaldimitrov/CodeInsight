import { signal } from '@preact/signals-core';

export const token = signal('');

export function setToken(newToken: string) {
	token.value = newToken;
}
