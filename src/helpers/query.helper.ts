export function buildQuery(params: any): string {
	const searchParams = new URLSearchParams();

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			searchParams.append(key, params[key].toString());
		}
	}

	return searchParams.toString();
}
