import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/stores/notificationStore';
import { clearToken, setToken } from '$lib/stores/userStore';
import http from '../http.helper';
import { isTranslationKey } from '../translations.helper';
import type { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

export function registerUser(data: RegisterUserDto) {
	return http
		.post('users/register', data)
		.then((res) => {
			setToken(res.data.token);
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
				? e.response.data.message.toLowerCase()
				: 'unexpected_error';

			clearToken();
			pushNotification(errorKey, AlertLevels.ERROR);
		});
}

export function loginUser(data: LoginUserDto) {
	return http
		.post('users/login', data)
		.then((res) => {
			setToken(res.data.token);
		})
		.catch((e: any) => {
			const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
				? e.response.data.message.toLowerCase()
				: 'unexpected_error';

			clearToken();
			pushNotification(errorKey, AlertLevels.ERROR);
		});
}
