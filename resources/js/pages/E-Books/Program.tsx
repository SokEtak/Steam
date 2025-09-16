import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../PageLayout';
import ProgramContent from './MainContent/ProgramContent';

export default function Program() {
    const { t } = useTranslation();
    const [lang, setLang] = useState<'en' | 'km'>('en');
    const [campus, setCampus] = useState<string>('');
    const [program, setProgram] = useState<string>('');

    return (
        <PageLayout lang={lang} setLang={setLang} title={t('programSelection')}>
            <ProgramContent lang={lang} setLang={setLang} campus={campus} setCampus={setCampus} program={program} setProgram={setProgram} />
        </PageLayout>
    );
}
