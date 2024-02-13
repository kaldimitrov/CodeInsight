export function formatShortDateTime(date: Date) {
	const options: any = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	};

	return date.toLocaleString('en-US', options);
}
