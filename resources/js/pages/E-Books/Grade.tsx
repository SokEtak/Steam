import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/inertia';
import PageLayout from '../PageLayout';
import GradeSelectionCard from './MainContent/GradeSelectionCard';

export default function Grade() {
    const { props, url } = usePage<PageProps<{ program?: string }>>();
    const program = props.program;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const initialLang = queryParams.get('lang') === 'km' ? 'km' : 'en';

    const [lang, setLang] = useState<'en' | 'km'>(initialLang);
    const [grade, setGrade] = useState<string>('');

    useEffect(() => {
        const newLang = queryParams.get('lang') === 'km' ? 'km' : 'en';
        setLang(newLang);
    }, [url]);

    const isKhmer = lang === 'km';

    return (
        <PageLayout lang={lang} setLang={setLang} title={isKhmer ? 'ជ្រើសរើសថ្នាក់' : 'Grade Selection'}>
            <GradeSelectionCard lang={lang} setLang={setLang} grade={grade} setGrade={setGrade} program={program} url={url} />
        </PageLayout>
    );
}
