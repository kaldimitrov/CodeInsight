import { signal } from '@preact/signals-core';
import type { AlertLevels } from '$lib/components/notifications/enums/alertLevels';

export class Notification {
	id: number;
	text: string;
	level: AlertLevels;
	duration: number = 5000;

	constructor(text: string, level: AlertLevels, duration: number) {
		this.id = Number((Date.now() + Math.random() * 1000).toFixed(0));
		this.text = text;
		this.level = level;
		this.duration = duration;
	}
}

export const notifications = signal([] as Notification[]);

export function pushNotification(text: string, level: AlertLevels, duration: number = 5000) {
	const notification = new Notification(text, level, duration);
	notifications.value = [...notifications.value, notification];
}

export function removeNotification(id: number) {
	notifications.value = notifications.value.filter((n: Notification) => n.id !== id);
}
