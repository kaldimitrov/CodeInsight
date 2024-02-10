import { locale, dictionary } from 'svelte-i18n';

export function isTranslationKey(key: string) {
	let currentLocale: any;
	let currentDictionary: any;

	const unsubscribeLocale = locale.subscribe((value) => {
		currentLocale = value;
	});
	unsubscribeLocale();

	const unsubscribeDictionary = dictionary.subscribe((value) => {
		currentDictionary = value[currentLocale];
	});
	unsubscribeDictionary();

	return hasNestedProperty(currentDictionary, key);
}

function hasNestedProperty(obj: any, path: string) {
	const keys = path.split('.');
	let current = obj;

	for (let key of keys) {
		if (key in current) {
			current = current[key];
		} else {
			return false;
		}
	}

	return true;
}
