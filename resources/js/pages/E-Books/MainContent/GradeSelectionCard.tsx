import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

// Convert number to Khmer numerals
const toKhmerNumber = (num: number): string => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return num.toString().split('').map(d => khmerDigits[parseInt(d)]).join('');
};

interface GradeSelectionCardProps {
    lang: 'en' | 'km';
    setLang: (lang: 'en' | 'km') => void;
    grade: string;
    setGrade: (grade: string) => void;
    program?: string;
    url: string;
}

const GradeSelectionCard = ({ lang, setLang, grade, setGrade, program, url }: GradeSelectionCardProps) => {
    const isKhmer = lang === 'km';
    const [isGradeHovered, setGradeHovered] = useState(false);
    const [isLangHovered, setLangHovered] = useState(false);

    const queryParams = new URLSearchParams(url.split('?')[1]);

    const programText =
        program === "cambodia"
            ? (isKhmer ? "កម្មវិធីខ្មែរ" : "Cambodia Curriculum")
            : program === "america"
                ? (isKhmer ? "កម្មវិធីសិក្សាអាមេរិកកាំង" : "American Curriculum")
                : (isKhmer ? "កម្មវិធីសិក្សាបន្ថែម" : "Extra Curricular Curriculum");

    useEffect(() => {
        const newLang = queryParams.get('lang') === 'km' ? 'km' : 'en';
        setLang(newLang);
    }, [url, setLang]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex w-full max-w-sm sm:max-w-md md:max-w-xl p-4 sm:p-6 md:p-8 items-center justify-center mx-auto"
        >
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full border border-purple-300 transition-all duration-500 hover:shadow-3xl battambang-font relative overflow-hidden">
                <Head title={isKhmer ? 'ជ្រើសរើសថ្នាក់' : 'Grade Selection'} />

                {/* Language Toggle */}
                <div className="mb-6 sm:mb-8 md:mb-10 relative">
                    <motion.div
                        onHoverStart={() => setLangHovered(true)}
                        onHoverEnd={() => setLangHovered(false)}
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                    >
                        <Select onValueChange={setLang} value={lang}>
                            <SelectTrigger className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-gray-900 rounded-2xl p-3 sm:p-4 md:p-5 border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 battambang-font shadow-md text-base sm:text-lg">
                                <SelectValue placeholder={isKhmer ? "ជ្រើសរើសភាសា" : "Select language"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-gray-900 rounded-2xl border border-blue-300 shadow-xl battambang-font text-base sm:text-lg">
                                <SelectGroup>
                                    <SelectItem value="en" className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-colors duration-200 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5">
                                        English
                                    </SelectItem>
                                    <SelectItem value="km" className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-colors duration-200 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5">
                                        ខ្មែរ
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {isLangHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-[-2rem] sm:bottom-[-2.5rem] left-0 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent battambang-font bg-blue-50 px-2 sm:px-3 md:px-4 py-1 sm:py-1 md:py-2 rounded-lg shadow-md"
                            >
                                {isKhmer ? 'ជ្រើសរើសភាសា' : 'Choose your conformable language!'}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                    className="absolute top-0 left-0 w-36 sm:w-40 h-36 sm:h-40 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-full opacity-30 -translate-x-16 sm:-translate-x-20 -translate-y-16 sm:-translate-y-20"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-44 sm:w-48 h-44 sm:h-48 bg-gradient-to-tl from-teal-400 via-blue-400 to-purple-400 rounded-full opacity-30 translate-x-20 sm:translate-x-24 translate-y-20 sm:translate_y-24"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                />

                {/* Program Label */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8 text-center battambang-font p-2"
                >
                    {program ? programText : '-'}
                </motion.h2>

                {/* Grade Select */}
                <motion.div
                    onHoverStart={() => setGradeHovered(true)}
                    onHoverEnd={() => setGradeHovered(false)}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6 sm:mb-8 md:mb-10 relative"
                >
                    <label className="block mb-2 text-xl sm:mb-3 md:mb-4 text-2sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent battambang-font flex items-center p-1">
                        {isKhmer ? 'សូមជ្រើសរើសថ្នាក់' : 'Choose Grade'}
                    </label>
                    <Select onValueChange={setGrade} value={grade}>
                        <SelectTrigger className="w-full bg-gradient-to-r from-teal-50 to-blue-50 text-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 border border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 battambang-font shadow-md text-base sm:text-lg">
                            <SelectValue placeholder={isKhmer ? 'ជ្រើសរើស' : 'Choose'} />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-900 rounded-2xl border border-teal-300 shadow-xl battambang-font text-base sm:text-lg max-h-60 sm:max-h-64 md:max-h-72 overflow-y-auto">
                            <SelectGroup>
                                {[...Array(12).keys()].map(i => (
                                    <SelectItem
                                        key={i + 1}
                                        value={`${i + 1}`}
                                        className="hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 transition-colors duration-200 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5"
                                    >
                                        <span className="inline-flex items-center space-x-1">
                                            <span>{isKhmer ? 'ថ្នាក់ទី' : 'Grade'}</span>
                                            <span>{isKhmer ? toKhmerNumber(i + 1) : i + 1}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {isGradeHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-[-2rem] sm:bottom-[-2.5rem] left-0 text-sm sm:text-base bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent battambang-font bg-teal-50 px-2 sm:px-3 md:px-4 py-1 sm:py-1 md:py-2 rounded-lg shadow-md"
                        >
                            {isKhmer ? 'ជ្រើសរើសថ្នាក់សិក្សា' : 'Select your grade level'}
                        </motion.div>
                    )}
                </motion.div>

                {/* Continue Button */}
                <motion.a
                    href={grade && program ? route('subject') + `?program=${program}&grade=${grade}&lang=${lang}` : '#'}
                    whileHover={{ scale: grade && program ? 1.05 : 1 }}
                    whileTap={{ scale: grade && program ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={`block w-full rounded-2xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-center font-bold text-base sm:text-lg md:text-xl transition-all duration-300 battambang-font ${
                        grade && program
                            ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 shadow-xl hover:shadow-2xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isKhmer ? 'បន្ត' : 'Continue'}
                </motion.a>

                {/* Bottom Divider */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-6 sm:mt-8 md:mt-10 border-b-4 bg-gradient-to-r from-orange-600 to-purple-600 w-1/2 mx-auto"
                ></motion.div>
            </div>
        </motion.div>
    );
};

export default GradeSelectionCard;
