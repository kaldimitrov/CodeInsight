import { signal } from '@preact/signals-core';
import type { AlertLevels } from './enums/alertLevels';
export class Notification {
	id: number;
	text: string;
	level: AlertLevels;
	duration: number = 5000;

	constructor(text: string, level: AlertLevels, duration: number) {
		this.id = Date.now();
		this.text = text;
		this.level = level;
		this.duration = duration;
	}
}

export const notifications = signal([] as Notification[]);

export function pushNotification(text: string, level: AlertLevels, duration: number = 5000) {
	const notification = new Notification(text, level, duration);
	notifications.value = [...notifications.value, notification];

	setTimeout(() => {
		const element = document.getElementById(`notification-${notification.id}`);
		if (element) {
			element.style.setProperty('opacity', '0');

			element.ontransitionend = () => {
				removeNotification(notification.id);
			};
		}
	}, notification.duration);
}

export function removeNotification(id: number) {
	notifications.value = notifications.value.filter((n: Notification) => n.id !== id);
}
