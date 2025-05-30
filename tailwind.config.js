/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#F0F7FF',
					100: '#E0EFFF',
					200: '#C0DFFF',
					300: '#90C8FF',
					400: '#60B0FF',
					500: '#0A84FF', // Primary color
					600: '#0070E0',
					700: '#005CB8',
					800: '#004890',
					900: '#003468',
				},
				neutral: {
					50: '#F9FAFB',
					100: '#F3F4F6',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9CA3AF',
					500: '#6B7280',
					600: '#4B5563',
					700: '#374151',
					800: '#1F2937',
					900: '#111827',
				},
				success: {
					500: '#34C759',
				},
				warning: {
					500: '#FF9500',
				},
				error: {
					500: '#FF3B30',
				},
				accent: {
					500: '#5856D6',
				},
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
			boxShadow: {
				apple:
					'0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
			},
		},
	},
	plugins: [],
};
