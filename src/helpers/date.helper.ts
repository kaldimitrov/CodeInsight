export function formatShortDateTime(date: Date) {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	};

	return date.toLocaleString('en-US', options);
}

export function formatEpochTime(epochTime: number) {
	const date = new Date(epochTime);
	const options: any = {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		millisecond: '2-digit',
		hour12: false
	};

	return date.toLocaleString('en-US', options);
}
