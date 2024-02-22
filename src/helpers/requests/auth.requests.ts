import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/stores/notificationStore';
import { clearToken, setRefreshToken, setToken } from '$lib/stores/userStore';
import http from '../http.helper';
import { isTranslationKey } from '../translations.helper';
import type { LoginUserDto, RefreshUserDto, RegisterUserDto } from './dto/auth.dto';

export function registerUser(data: RegisterUserDto) {
	return http
		.post('users/register', data)
		.then((res) => {
			setToken(res.data.access_token);
			setRefreshToken(res.data.refresh_token);
			return true;
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(`errors.${e.response?.data?.message?.toLowerCase()}`)
				? `errors.${e.response.data.message.toLowerCase()}`
				: 'errors.unexpected_error';

			clearToken();
			pushNotification(errorKey, AlertLevels.ERROR);
		});
}

export function loginUser(data: LoginUserDto) {
	return http
		.post('users/login', data)
		.then((res) => {
			setToken(res.data.access_token);
			setRefreshToken(res.data.refresh_token);
			return true;
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(`errors.${e.response?.data?.message?.toLowerCase()}`)
				? `errors.${e.response.data.message.toLowerCase()}`
				: 'errors.unexpected_error';

			clearToken();
			pushNotification(errorKey, AlertLevels.ERROR);
		});
}

export function refreshUser(data: RefreshUserDto) {
	return http
		.post('users/refresh', data)
		.then((res) => {
			setToken(res.data.access_token);
			setRefreshToken(res.data.refresh_token);
			return true;
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(`errors.${e.response?.data?.message?.toLowerCase()}`)
				? `errors.${e.response.data.message.toLowerCase()}`
				: 'errors.unexpected_error';

			clearToken();
			pushNotification(errorKey, AlertLevels.ERROR);
		});
}
