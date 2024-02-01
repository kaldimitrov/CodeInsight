import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/components/notifications/notificationStore';
import http from '../http.helper';
import { isTranslationKey } from '../translations.helper';
import type { CodeSubmitDto } from './dto/code.dto';

export function getLanguages() {
	return http.get('code/languages').catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}

export function getState() {
	return http.get('code/state').catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}

export function submitCode(data: CodeSubmitDto) {
	return http.post('code/submit', data).catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}
