import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
import { pushNotification } from '$lib/stores/notificationStore';
import http from '../http.helper';
import { buildQuery } from '../query.helper';
import { isTranslationKey } from '../translations.helper';
import type { GetHistoryDto } from './dto/history.dto';

export function getHistory(params: GetHistoryDto) {
	return http.get(`history/?${buildQuery(params)}`).catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}

export function getHistoryDetails(executionId: string) {
	return http.get(`history/${executionId}`).catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}

export function deleteHistory(executionId: string) {
	return http.delete(`history/${executionId}`).catch((e: any) => {
		const errorKey = isTranslationKey(e.response?.data?.message?.toLowerCase())
			? e.response.data.message.toLowerCase()
			: 'unexpected_error';

		pushNotification(errorKey, AlertLevels.ERROR);
	});
}
