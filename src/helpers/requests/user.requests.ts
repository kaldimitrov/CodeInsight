import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/components/notifications/notificationStore';
import http from '../http.helper';
import { isTranslationKey } from '../translations.helper';
import type { UpdateUserDto } from './dto/user.dto';

export function getUserInfo() {
	return http.get('users').catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}

export function deleteUser() {
	return http.delete('users').catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}

export function updateUser(data: UpdateUserDto) {
	return http.put('users/update', data).catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}
