import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/components/notifications/notificationStore';
import http from '../http';
import { isValidTranslationKey } from '../translations';

export async function getLanguages() {
	console.log(isValidTranslationKey('test'));
	console.log(isValidTranslationKey('max_files_error'));
	try {
		const response = await http.get('code/languages');

		return response.data;
	} catch (e: any) {
		pushNotification(e.response.data.message, AlertLevels.ERROR);
		return;
	}
}
