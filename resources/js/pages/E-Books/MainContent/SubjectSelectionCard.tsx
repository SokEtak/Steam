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

// Mapping of English numbers to Khmer numbers
const numberMap: { [key: string]: string } = {
    '1': '១',
    '2': '២',
    '3': '៣',
    '4': '៤',
    '5': '៥',
    '6': '៦',
    '7': '៧',
    '8': '៨',
    '9': '៩',
    '10': '១០',
    '11': '១១',
    '12': '១២',
};

interface SubjectSelectionCardProps {
    lang: 'en' | 'km';
    setLang: (lang: 'en' | 'km') => void;
    subject: string;
    setSubject: (subject: string) => void;
    program?: string;
    grade?: string;
    url: string;
}

const SubjectSelectionCard = ({ lang, setLang, subject, setSubject, program, grade, url }: SubjectSelectionCardProps) => {
    const isKhmer = lang === 'km';
    const [isSubjectHovered, setSubjectHovered] = useState(false);
    const [isLangHovered, setLangHovered] = useState(false);
    const queryParams = new URLSearchParams(url.split('?')[1]);

    // Mapping of grades to subjects based on program
    const gradeSubjects: { [key: string]: { [key: string]: { value: string; en: string; km: string }[] } } = {
        "1": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'សិក្សាសង្គម' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "2": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'វិទ្យាសាស្ត្រ-សិក្សាសង្គម' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "3": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'វិទ្យាសាស្ត្រ-សិក្សាសង្គម' },
                { value: 'reading', en: 'Reading', km: 'អំណាន' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "4": {
            "cambodia": [
                { value: 'chaching', en: 'Cha Ching', km: 'កម្មវិធីសិក្សា-ឆាឈីង' },
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'history', en: 'History Of Science', km: 'ប្រវិត្តិវិទ្យា' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'វិទ្យាសាស្ត្រ-សិក្សាសង្គម' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "5": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'សិក្សាសង្គម' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "6": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'history', en: 'History', km: 'ប្រវិត្តិវិទ្យា' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'សិក្សាសង្គម' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "7": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'វិទ្យាសាស្ត្រ-សិក្សាសង្គម' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "8": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'science', en: 'Science', km: 'វិទ្យាីសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'វិទ្យាសាស្ត្រ-សិក្សាសង្គម' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
            ],
        },
        "9": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'science', en: 'Science', km: 'វិទ្យាសាស្ត្រ' },
                { value: 'social', en: 'Social Science', km: 'វិទ្យាសាស្ត្រ-សិក្សាសង្គម' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
            ],
        },
        "10": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'history', en: 'History Of Science', km: 'ប្រវិត្តវិទ្យា' },
                { value: 'geography', en: 'Geography', km: 'ភូមិវិទ្យា' },
                { value: 'geology', en: 'Earth And Environmental Science ', km: 'ផែនដីវិទ្យា' },
                { value: 'biology', en: 'Biology', km: 'ជីវវិទ្យា' },
                { value: 'physics', en: 'Physics', km: 'រូបវិទ្យា' },
                { value: 'chemistry', en: 'Chemistry', km: 'គីមីវិទ្យា' },
                { value: 'morality', en: 'Morality-Civics', km: 'សីលធម៌-ពលរដ្ធ' },
                { value: 'khmer', en: 'Khmer Language', km: 'ភាសាខ្មែរ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "11": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'chemistry', en: 'Chemistry', km: 'គីមីវិទ្យា' },
                { value: 'biology', en: 'Biology', km: 'ជីវវិទ្យា' },
                { value: 'history', en: 'History', km: 'ប្រវិត្តវិទ្យា' },
                { value: 'geology', en: 'Geology', km: 'ផែនដីវិទ្យា' },
                { value: 'geography', en: 'Geography', km: 'ភូមិវិទ្យា' },
                { value: 'physics', en: 'Physics', km: 'រូបវិទ្យា' },
                { value: 'morality', en: 'Morality', km: 'សីលធម៌-ពលរដ្ធ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'khmer', en: 'Khmer Language', km: 'អក្សរសាស្ត្រខ្មែរ' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'AI Education', km: 'ការអប់រំ AI' }
            ],
        },
        "12": {
            "cambodia": [
                { value: 'math', en: 'Mathematics', km: 'គណិតវិទ្យា' },
                { value: 'chemistry', en: 'Chemistry', km: 'គីមីវិទ្យា' },
                { value: 'biology', en: 'Biology', km: 'ជីវវិទ្យា' },
                { value: 'history', en: 'History', km: 'ប្រវិត្តវិទ្យា' },
                { value: 'geology', en: 'Earth And Environmental Science', km: 'ផែនដីវិទ្យានិងបរិស្ថានវិទ្យា' },
                { value: 'geography', en: 'Geography', km: 'ភូមិវិទ្យា' },
                { value: 'physics', en: 'Physics', km: 'រូបវិទ្យា' },
                { value: 'morality', en: 'Morality-Civics', km: 'សីលធម៌-ពលរដ្ធ' },
                { value: 'english', en: 'English', km: 'ភាសាអង់គ្លេស' },
                { value: 'khmer', en: 'Khmer Language', km: 'អក្សរសាស្ត្រខ្មែរ' },
                { value: 'sport', en: 'Sport', km: 'អប់រំកាយ និង កីឡា' },
                { value: 'virtual-lab', en: 'Virtual Lab', km: 'មន្ទីរពិសោធន៍និម្មិត' },
                { value: 'ai-education', en: 'ការអប់រំ AI' }
            ],
        },
    };

    // Map grade text
    const gradeText = grade
        ? (lang === 'en'
            ? (["club1", "club2"].includes(grade) ? `${grade.charAt(0).toUpperCase() + grade.slice(4)} Level` : `Grade ${grade}`)
            : (["club1", "club2"].includes(grade) ? `${numberMap[grade]} កម្រិត` : `ថ្នាក់ទី ${numberMap[grade]}`))
        : '-';

    // Map program text
    const programText = program
        ? (program === "cambodia"
            ? (lang === 'en' ? "Cambodia Curriculum" : "កម្មវិធីខ្មែរ")
            : program === "america"
                ? (lang === 'en' ? "American Curriculum" : "កម្មវិធីអាមេរិកកាំង")
                : (lang === 'en' ? "Extra Curricular Curriculum" : "កម្មវិធីបន្ថែម"))
        : '-';

    // Get subjects for the current grade and program, default to empty array if invalid
    const availableSubjects = grade && program && grade in gradeSubjects && program in gradeSubjects[grade]
        ? gradeSubjects[grade][program]
        : [];

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
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full border border-purple-300 transition-all duration-500 hover:shadow-3xl font-sans relative overflow-hidden">
                <Head title={isKhmer ? 'ជ្រើសរើសមុខវិជ្ជា' : 'Subject Selection'} />

                {/* Language Toggle */}
                <div className="mb-4 sm:mb-6 md:mb-8 relative">
                    <motion.div
                        onHoverStart={() => setLangHovered(true)}
                        onHoverEnd={() => setLangHovered(false)}
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                    >
                        <Select onValueChange={setLang} value={lang}>
                            <SelectTrigger className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-gray-900 rounded-2xl p-3 sm:p-4 md:p-5 border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-sans shadow-md text-base sm:text-lg">
                                <SelectValue placeholder={isKhmer ? "ជ្រើសរើសភាសា" : "Select language"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-gray-900 rounded-2xl border border-blue-300 shadow-xl font-sans text-base sm:text-lg">
                                <SelectGroup>
                                    <SelectItem value="en" className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-colors duration-300 py-3 sm:py-4 md:py-5 px-4 sm:px-5 md:px-6 font-medium">
                                        English
                                    </SelectItem>
                                    <SelectItem value="km" className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-colors duration-300 py-3 sm:py-4 md:py-5 px-4 sm:px-5 md:px-6 font-medium">
                                        ខ្មែរ
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {isLangHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-[-2rem] sm:bottom-[-2.5rem] left-0 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-sans bg-blue-50 px-2 sm:px-3 md:px-4 py-1 sm:py-1 md:py-2 rounded-lg shadow-md"
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
                    className="absolute bottom-0 right-0 w-44 sm:w-48 h-44 sm:h-48 bg-gradient-to-tl from-teal-400 via-blue-400 to-purple-400 rounded-full opacity-30 translate-x-20 sm:translate-x-24 translate-y-20 sm:translate-y-24"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                />

                {/* Program Label */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8 text-center font-sans p-1"
                >
                    {programText}
                </motion.h2>

                {/* Subject Heading */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-2xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center font-sans p-1"
                >
                    {isKhmer ? 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់' : 'Choose Your Subject For'}
                </motion.h1>

                {/* Grade Label */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-2xl sm:text-3xl md:text-3xl font-semibold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8 text-center font-sans p-1"
                >
                    {gradeText}
                </motion.h2>

                {/* Subject Select */}
                <motion.div
                    onHoverStart={() => setSubjectHovered(true)}
                    onHoverEnd={() => setSubjectHovered(false)}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mb-6 sm:mb-8 md:mb-10 relative"
                >
                    <label className="block mb-2 text-xl sm:mb-3 md:mb-4 text-2sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent battambang-font flex items-center p-1">
                        {isKhmer ? 'មុខវិជ្ជា' : 'Subject'}
                    </label>
                    <Select onValueChange={setSubject} value={subject}>
                        <SelectTrigger className="w-full bg-gradient-to-r from-teal-50 to-blue-50 text-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 border border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 font-sans shadow-md text-base sm:text-lg">
                            <SelectValue placeholder={isKhmer ? 'ជ្រើសរើសមុខវិជ្ជា' : 'Select a subject'} />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-900 rounded-2xl border border-teal-300 shadow-xl font-sans text-base sm:text-lg max-h-60 sm:max-h-74 md:max-h-72 overflow-y-auto">
                            <SelectGroup>
                                {availableSubjects.map((subj) => (
                                    <SelectItem
                                        key={subj.value}
                                        value={subj.value}
                                        className="hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 transition-colors duration-300 py-3 sm:py-4 md:py-5 px-4 sm:px-5 md:px-6 font-medium"
                                    >
                                        {isKhmer ? subj.km : subj.en}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {isSubjectHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-[-2rem] sm:bottom-[-2.5rem] left-0 text-sm sm:text-base bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent font-sans bg-teal-50 px-2 sm:px-3 md:px-4 py-1 sm:py-1 md:py-2 rounded-lg shadow-md"
                        >
                            {isKhmer ? 'ជ្រើសរើសមុខវិជ្ជា' : 'Choose your subject!'}
                        </motion.div>
                    )}
                </motion.div>

                {/* Continue Button */}
                <motion.a
                    href={subject && program && grade ? route('lesson') + `?program=${program}&grade=${grade}&subject=${subject}&lang=${lang}` : '#'}
                    whileHover={{ scale: subject && program && grade ? 1.05 : 1 }}
                    whileTap={{ scale: subject && program && grade ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className={`block w-full rounded-2xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-center font-semibold text-base sm:text-lg font-sans ${
                        subject && program && grade
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
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-4 sm:mt-6 md:mt-8 border-b-4 bg-gradient-to-r from-orange-600 to-purple-600 w-1/2 mx-auto"
                ></motion.div>
            </div>
        </motion.div>
    );
};

export default SubjectSelectionCard;
