import { writable } from 'svelte/store';
import io from 'socket.io-client';
import { token } from '$lib/stores/userStore';
import { environment } from '../configuration/environment';

let authToken: any;

token.subscribe((value) => {
	authToken = value;
});

export const socketStore = writable<any>(null);

export function connectSocket() {
	return new Promise((resolve) => {
		token.subscribe((value) => {
			authToken = value;
		});

		const socket = io(environment.socketUrl, {
			transports: ['websocket'],
			auth: {
				headers: {
					authorization: `Bearer ${authToken}`
				}
			},
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: Infinity
		});

		socket.on('connect', () => {
			resolve(true);
		});
		socketStore.set(socket);
	});
}
export function disconnect() {
	socketStore.update((socket) => {
		socket?.disconnect();

		return null;
	});
}

export function emitSocketEvent(event: string, data?: any) {
	socketStore.update((socket) => {
		socket?.emit(event, data);

		return socket;
	});
}

export function addSocketListener(event: string, callback: (...args: any[]) => void) {
	socketStore.update((socket) => {
		socket?.on(event, callback);

		return socket;
	});
}

export function removeSocketListener(event: string, callback: (...args: any[]) => void) {
	socketStore.update((socket) => {
		socket?.off(event, callback);

		return socket;
	});
}
