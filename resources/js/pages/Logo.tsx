import { motion } from 'framer-motion';

interface LogoProps {
    lang: 'en' | 'km';
}

const Logo = ({ lang }: LogoProps) => {
    const isKhmer = lang === 'km';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className=" mt-2 text-center max-w-sm sm:max-w-md md:max-w-xl mx-auto"
        >
            <motion.img
                src="/images/DIS(no%20back).png"
                alt="Dewey International School Logo"
                className="mx-auto w-32 sm:w-36 md:w-40 h-auto"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            />
            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent py-2"
            >
                {isKhmer ? 'សាលាអន្តរជាតិ ឌូវី' : 'Dewey International School'}
            </motion.h1>
            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent battambang-font p-2"
            >
                {isKhmer ? 'ការសិក្សាផ្សារភ្ជាប់ជាមួយការអនុវត្ត' : 'Learning By Doing'}
            </motion.h1>
        </motion.div>
    );
};

export default Logo;
