import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/inertia';
import PageLayout from '../PageLayout';
import SubjectSelectionCard from './MainContent/SubjectSelectionCard';

export default function Subject() {
    const { props, url } = usePage<PageProps<{ program?: string; grade?: string }>>();
    const { program, grade } = props;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const initialLang = queryParams.get('lang') === 'km' ? 'km' : 'en';

    const [lang, setLang] = useState<'en' | 'km'>(initialLang);
    const [subject, setSubject] = useState('');

    useEffect(() => {
        const newLang = queryParams.get('lang') === 'km' ? 'km' : 'en';
        setLang(newLang);
    }, [url]);

    return (
        <PageLayout lang={lang} setLang={setLang} title={lang === 'en' ? 'Subject Selection' : 'ជ្រើសរើសមុខវិជ្ជា'}>
            <SubjectSelectionCard lang={lang} setLang={setLang} subject={subject} setSubject={setSubject} program={program} grade={grade} url={url} />
        </PageLayout>
    );
}
