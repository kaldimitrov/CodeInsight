/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['night', 'winter'],
		darkTheme: 'night', // name of one of the included themes for dark mode
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
		prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
		logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
		themeRoot: ':root' // The element that receives theme color CSS variables
	},
	safelist: [
		'alert-success',
		'alert-error',
		'alert-warning',
		'alert-info',
		'badge-success',
		'badge-error',
		'badge-warning',
		'badge-info',
		'bg-success',
		'bg-error',
		'bg-warning',
		'bg-info'
	]
};
