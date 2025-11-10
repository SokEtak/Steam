//added file for global translations
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
    en: {
        translation: {
            "programSelection": "Program Selection",
            "selectProgramAndCampus": "Select Program & Campuses Of Your Childrens",
            "chooseCampus": "Choose Campuses",
            "selectACampus": "Select a campus",
            "chooseProgram": "Choose Program",
            "selectAProgram": "Select a program",
            "continue": "Continue",
            "deweyInternationalSchool": "Dewey International School",
            "learningByDoing": "Learning By Doing",
            "iconicBranch": "Iconic Branch",
            "ocharBranch": "Ochar Branch",
            "banteayMeanchey": "Banteay Meanchey",
            "childcareHouse": "Childcare House",
            "kindergarten": "Kindergarten",
            "cambodiaCurriculum": "Cambodia Curriculum",
            "americanCurriculum": "American Curriculum",
            "extraCurricularCurriculum": "Extra Curricular Curriculum",
            // Add more keys as needed
        },
    },
    km: {
        translation: {
            "programSelection": "ជ្រើសរើសកម្មវិធីសិក្សា",
            "selectProgramAndCampus": "ជ្រើសរើសកម្មវិធីសិក្សា និង ទីតាំងរបស់បុត្រធីតារបស់លោកអ្នក",
            "chooseCampus": "ជ្រើសរើសទីតាំង",
            "selectACampus": "ជ្រើសរើសទីតាំង",
            "chooseProgram": "ជ្រើសរើសកម្មវិធីសិក្សា",
            "selectAProgram": "ជ្រើសរើសកម្មវិធី",
            "continue": "បន្ត",
            "deweyInternationalSchool": "សាលាអន្តរជាតិឌូវី",
            "learningByDoing": "រៀនដោយធ្វើ",
            "iconicBranch": "សាលាឌូវី សាខាអាយខនិក",
            "ocharBranch": "សាលាឌូវី សាខាអូរចារ",
            "banteayMeanchey": "សាខាបន្ទាយមានជ័យ",
            "childcareHouse": "ឌូវី ឆាយលឃែរ ហោស៍",
            "kindergarten": "មត្តេយ្យ ឌូវី",
            "cambodiaCurriculum": "កម្មវិធីសិក្សាខ្មែរ",
            "americanCurriculum": "កម្មវិធីសិក្សាអាមេរិកកាំង",
            "extraCurricularCurriculum": "កម្មវិធីបន្ថែម",
            // Add more keys as needed
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language if translations is missing
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
