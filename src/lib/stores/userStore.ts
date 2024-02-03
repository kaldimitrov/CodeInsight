import type { User } from '$lib/models/user.model';
import { signal } from '@preact/signals-core';

export const token = signal('');

export const user = signal({} as User);

export function setToken(newToken: string) {
	token.value = newToken;
}

export function clearToken() {
	token.value = '';
}

export function setUser(newUser: User) {
	user.value = newUser;
}

export function clearUser() {
	user.value = {} as User;
}
