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

	return currentDictionary && key in currentDictionary;
}
