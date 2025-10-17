/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.{blade.php,js,jsx,ts,tsx,vue}',
    ],
    theme: {
        extend: {
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 10px rgba(250, 204, 21, 0.3), 0 0 20px rgba(250, 204, 21, 0.3)',
                    },
                    '50%': {
                        boxShadow: '0 0 25px rgba(250, 204, 21, 0.6), 0 0 50px rgba(250, 204, 21, 0.4)',
                    },
                },
            },
            animation: {
                'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
            },
        },
    },
};
