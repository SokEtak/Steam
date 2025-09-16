import { Head } from '@inertiajs/react';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';

interface PageLayoutProps {
    lang: 'en' | 'km';
    setLang: (lang: 'en' | 'km') => void;
    children: React.ReactNode;
    title: string;
}

const PageLayout = ({ lang, setLang, children, title }: PageLayoutProps) => {
    const isKhmer = lang === 'km';

    return (
        <>
            <Head title={isKhmer ? `${title} (ខ្មែរ)` : title} />
            <div className={`flex min-h-screen flex-col items-center ${isKhmer ? 'bg-gradient-to-b from-white via-indigo-50 to-indigo-100' : 'bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 font-sans'} p-4 text-gray-900` }>
                <Logo lang={lang} setLang={setLang} />
                {/*<LanguageToggle lang={lang} setLang={setLang} />*/}
                {children}
            </div>
        </>
    );
};

export default PageLayout;
