import * as Highcharts from 'highcharts';

export const nightThemeColors = {
	primary: '#818CF8',
	secondary: '#F472B6',
	accent: '#FBBF24',
	neutral: '#0F172A'
};

export const NightThemeHighcharts = {
	colors: [
		nightThemeColors.primary,
		nightThemeColors.secondary,
		nightThemeColors.accent,
		nightThemeColors.neutral
	],
	chart: {
		backgroundColor: nightThemeColors.neutral,
		style: {
			fontFamily: 'inherit',
			color: '#ffffff'
		}
	},
	title: {
		style: {
			color: '#ffffff'
		}
	},
	yAxis: {
		labels: {
			style: {
				color: '#ffffff'
			}
		},
		title: {
			style: {
				color: '#ffffff'
			}
		}
	},
	xAxis: {
		labels: {
			style: {
				color: '#ffffff'
			}
		},
		title: {
			style: {
				color: '#ffffff'
			}
		}
	},
	legend: {
		itemStyle: {
			color: '#ffffff'
		}
	}
};

export const defaultOptions = JSON.parse(JSON.stringify(Highcharts.getOptions()));
