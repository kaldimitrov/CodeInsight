import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/components/notifications/notificationStore';
import http from '../http';
import { isTranslationKey } from '../translations';

export function getLanguages() {
	return http.get('code/languages').catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}
