import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/inertia';
import PageLayout from '../PageLayout';
import LessonCard from '../E-Books/MainContent/LessonCard';

export default function Lesson() {
    const { t } = useTranslation();
    const { props, url } = usePage<PageProps<{ subject?: string; program?: string; grade?: string; lang?: string }>>();
    const { subject = t('default.subject', 'Unknown Subject'), program = t('default.program', 'Unknown Program'), grade = t('default.grade', 'Unknown Grade'), lang = 'en' } = props;
    const [currentLang, setCurrentLang] = useState<'en' | 'km'>(lang as 'en' | 'km');

    return (
        <PageLayout lang={currentLang} setLang={setCurrentLang} title={t('lesson.title')}>
            <LessonCard lang={currentLang} subject={subject} program={program} grade={grade} url={url} />
        </PageLayout>
    );
}
