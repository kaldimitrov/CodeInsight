import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/stores/notificationStore';
import { clearUser, setUser } from '$lib/stores/userStore';
import http from '../http.helper';
import { isTranslationKey } from '../translations.helper';
import type { UpdateUserDto } from './dto/user.dto';

export function getUserInfo() {
	return http
		.get('users')
		.then((res) => {
			setUser(res.data);
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(`errors.${e.response?.data?.message?.toLowerCase()}`)
				? `errors.${e.response.data.message.toLowerCase()}`
				: 'errors.unexpected_error';

			pushNotification(errorKey, AlertLevels.ERROR);
		});
}

export function deleteUser() {
	return http
		.delete('users')
		.then((res) => {
			clearUser();
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(`errors.${e.response?.data?.message?.toLowerCase()}`)
				? `errors.${e.response.data.message.toLowerCase()}`
				: 'errors.unexpected_error';

			pushNotification(errorKey, AlertLevels.ERROR);
		});
}

export function updateUser(data: UpdateUserDto) {
	return http
		.put('users/update', data)
		.then((res) => {
			setUser(res.data);
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(`errors.${e.response?.data?.message?.toLowerCase()}`)
				? `errors.${e.response.data.message.toLowerCase()}`
				: 'errors.unexpected_error';

			pushNotification(errorKey, AlertLevels.ERROR);
		});
}
