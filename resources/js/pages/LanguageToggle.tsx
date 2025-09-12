interface LanguageToggleProps {
    lang: 'en' | 'km';
    setLang: (lang: 'en' | 'km') => void;
}

const LanguageToggle = ({ lang, setLang }: LanguageToggleProps) => {
    const isKhmer = lang === 'km';

    return (
        <div className="mt-2 mb-2 flex gap-2">

        </div>
    );
};

export default LanguageToggle;
