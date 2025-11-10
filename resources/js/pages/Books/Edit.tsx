'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { CheckCircle2Icon, X } from 'lucide-react';
import { Component, ReactNode, useCallback, useEffect, useState } from 'react';

interface Campus {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
}

interface Shelf {
    id: number;
    code: string;
}

interface Bookcase {
    id: number;
    code: string;
}

interface Grade {
    id: number;
    name: string;
}

interface Subject {
    id: number;
    name: string;
}

interface Book {
    id: number;
    type: 'physical' | 'ebook';
    title: string;
    description: string | null;
    page_count: number;
    publisher: string;
    language: string;
    published_at: number | null;
    author: string | null;
    flip_link: string | null;
    code: string;
    isbn: string | null;
    view: number;
    is_available: boolean | null;
    downloadable: boolean | null;
    cover: string | null;
    pdf_url: string | null;
    category_id: number;
    subcategory_id: number | null;
    shelf_id: number | null;
    bookcase_id: number | null;
    grade_id: number | null;
    subject_id: number | null;
    campus_id: number | null;
}

interface BooksEditProps {
    book: Book;
    categories: Category[];
    subcategories: Subcategory[];
    shelves: Shelf[];
    bookcases: Bookcase[];
    grades: Grade[];
    subjects: Subject[];
    campuses: Campus[];
    flash?: {
        message: string | null;
        error: string | null;
    };
}

// Translation object for English only
const translations = {
    en: {
        go_back: 'Book List',
        createBook: 'Create New Book',
        createEBook: 'Create E-Book',
        createPhysicalBook: 'Create Physical Book',
        editEBook: 'Edit E-Book',
        editPhysicalBook: 'Edit Physical Book',
        error: 'Error',
        tryAgain: 'Try Again',
        somethingWentWrong: 'Something went wrong',
        errorDescription: 'An error occurred while updating the book. Please try again or contact support.',
        basicInformation: 'Basic Information',
        title: 'Title',
        titlePlaceholder: 'Enter the book title',
        titleError: 'Please provide a valid title (max 255 characters).',
        titleHelper: 'Max 255 characters.',
        description: 'Description',
        descriptionPlaceholder: 'Enter the book description',
        descriptionError: 'Please provide a valid description.',
        descriptionHelper: 'Brief description of the book.',
        pageCount: 'Page Count',
        pageCountPlaceholder: 'Enter the number of pages',
        pageCountError: 'Please provide a valid page count (minimum 1).',
        pageCountHelper: 'Total number of pages.',
        publisher: 'Publisher',
        publisherPlaceholder: 'Enter the publisher name',
        publisherError: 'Please provide a valid publisher name (max 255 characters).',
        publisherHelper: 'Max 255 characters.',
        language: 'Language',
        languagePlaceholder: 'Select language',
        languageError: 'Please select a valid language.',
        languageHelper: 'Primary language of the book.',
        publishedAt: 'Published Date',
        publishedAtPlaceholder: 'Select date',
        publishedAtError: 'Please select a valid publication year.',
        publishedAtHelper: 'Optional publication year.',
        author: 'Author',
        authorPlaceholder: 'Enter the author name',
        authorError: 'Please provide a valid author name (max 255 characters).',
        authorHelper: 'Optional, max 255 characters.',
        flipLink: 'Flip Link',
        flipLinkPlaceholder: 'Enter the digital preview URL',
        flipLinkError: 'Please provide a valid URL for the digital preview.',
        flipLinkHelper: 'Optional digital preview link.',
        code: 'Code',
        codePlaceholder: 'Auto-generated after selecting category',
        codeError: 'Please provide a valid book code (max 10 characters).',
        codeHelper: 'Max 10 characters, auto-generated.',
        isbn: 'ISBN',
        isbnPlaceholder: 'Enter the ISBN',
        isbnError: 'Please provide a valid ISBN (max 13 characters).',
        isbnHelper: 'Optional, 13 characters.',
        availability: 'Availability',
        downloadable: 'Downloadable',
        availabilityError: 'Please select an availability option.',
        availabilityHelper: 'Indicate if the book is available.',
        downloadableHelper: 'Allow users to download the e-book.',
        yes: 'Yes',
        no: 'No',
        classification: 'Classification',
        category: 'Category',
        categoryPlaceholder: 'Select category',
        categoryError: 'Please select a valid category.',
        categoryHelper: 'Select a category for the book.',
        subcategory: 'Subcategory',
        subcategoryPlaceholder: 'Select subcategory',
        subcategoryError: 'Please select a valid subcategory.',
        subcategoryHelper: 'Optional subcategory for the book.',
        grade: 'Grade',
        gradePlaceholder: 'Select grade',
        gradeError: 'Please select a valid grade.',
        gradeHelper: 'Optional grade level for the book.',
        subject: 'Subject',
        subjectPlaceholder: 'Select subject',
        subjectError: 'Please select a valid subject.',
        subjectHelper: 'Optional subject for the book.',
        location: 'Location',
        bookcase: 'Bookcase',
        bookcasePlaceholder: 'Select bookcase',
        bookcaseError: 'Please select a valid bookcase.',
        bookcaseHelper: 'Select a bookcase for the physical book.',
        shelf: 'Shelf',
        shelfPlaceholder: 'Select shelf',
        shelfError: 'Please select a valid shelf.',
        shelfHelper: 'Select a shelf for the physical book.',
        campusPlaceholder: 'Select a campus',
        campusError: 'Campuses is required for physical books.',
        campusHelper: 'Select the campus where the book is located.',
        files: 'Files',
        cover: 'Cover (portrait recommended)',
        coverPlaceholder: 'Upload a cover image',
        coverError: 'Please upload a valid cover image (JPEG/PNG, max 5MB).',
        coverHelper: 'Optional: JPEG or PNG, max 5MB.',
        pdfFile: 'PDF File (30MB max, optional for e-books)',
        pdfFilePlaceholder: 'Upload a PDF file (optional)',
        pdfFileError: 'Please upload a valid PDF file (max 30MB).',
        pdfFileHelper: 'Optional: PDF, max 30MB.',
        browse: 'Browse',
        remove: 'Remove',
        preview: 'Preview',
        updateButton: 'Update Book',
        updating: 'Updating...',
        cancel: 'Cancel, Go Back to Books List',
        coverPreview: 'Cover Preview',
        pdfPreview: 'PDF Preview',
        noCoverAvailable: 'No cover image available.',
        noPdfAvailable: 'No PDF file available.',
        saveBook: 'Save the updated book',
        returnToBooks: 'Return to the books list',
        physical: 'Physical',
        ebook: 'E-Book',
        audio: 'Audio',
        comingSoon: '(Coming Soon)',
        reset: 'Reset',
        save: 'Update',
        close: 'Close',
        dragDrop: 'Drag and drop a PDF file or click to select',
        previewPDF: 'Preview PDF',
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Books', href: route('books.index') },
    { title: 'Edit', href: '' },
];

interface ErrorBoundaryProps {
    children: ReactNode;
    pageProps: { lang?: string };
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6">
                    <Alert className="rounded-lg border border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20">
                        <AlertTitle className="text-red-600 dark:text-red-400">Error</AlertTitle>
                        <AlertDescription className="text-gray-600 dark:text-gray-300">
                            Something went wrong. Please try again or contact support.
                        </AlertDescription>
                    </Alert>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function BooksEdit({ book, categories, subcategories, shelves, bookcases, grades, subjects, campuses, flash }: BooksEditProps) {
    const { props } = usePage<{ lang?: string }>();
    const lang = props.lang === 'kh' ? 'kh' : 'en';
    // translations currently only contains 'en' — cast to any to allow 'kh' fallback
    const t = (translations as any)[lang] || translations.en;

    const [type, setType] = useState<'physical' | 'ebook'>(book.type);
    const isEbook = type === 'ebook';
    const [pdfFileError, setPdfFileError] = useState<string | null>(null);
    const [showErrorAlert, setShowErrorAlert] = useState(!!flash?.error);
    const [clientErrors, setClientErrors] = useState<string[]>([]);

    const { data, setData, put, processing, errors, reset } = useForm({
        type: book.type || 'physical',
        title: book.title || '',
        description: book.description || '',
        page_count: book.page_count ? book.page_count.toString() : '1',
        publisher: book.publisher || '',
        language: book.language || 'en',
        published_at: book.published_at ? book.published_at.toString() : '',
        author: book.author || '',
        flip_link: book.flip_link || '',
        code: book.code || '',
        isbn: book.isbn || '',
        view: book.view ? book.view.toString() : '0',
        is_available: book.is_available ?? true,
        downloadable: book.downloadable ?? (isEbook ? true : null),
        cover: null as File | null,
        pdf_url: null as File | null,
        category_id: book.category_id ? book.category_id.toString() : '',
        subcategory_id: book.subcategory_id ? book.subcategory_id.toString() : null,
        shelf_id: book.shelf_id ? book.shelf_id.toString() : null,
        bookcase_id: book.bookcase_id ? book.bookcase_id.toString() : null,
        grade_id: book.grade_id ? book.grade_id.toString() : null,
        subject_id: book.subject_id ? book.subject_id.toString() : null,
        campus_id: book.campus_id ? book.campus_id.toString() : null,
    });

    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(book.cover || null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(book.pdf_url || null);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        setShowErrorAlert(!!Object.keys(errors).length || !!flash?.error);
    }, [errors, flash?.error]);

    const generateRandomString = (length: number): string => {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const generateCode = useCallback(() => {
        const category = data.category_id ? categories.find((cat) => cat.id.toString() === data.category_id) : null;
        const categoryPrefix = category ? category.name.slice(0, 3).toUpperCase() : 'UNK';
        const typePrefix = isEbook ? 'EBK' : 'PHY';
        const randomSuffix = generateRandomString(4);
        return `${categoryPrefix}-${typePrefix}-${randomSuffix}`.slice(0, 10);
    }, [data.category_id, isEbook, categories]);

    useEffect(() => {
        if (data.category_id && !data.code) {
            setData('code', generateCode());
        }
    }, [data.category_id, generateCode]);

    useEffect(() => {
        return () => {
            if (coverPreviewUrl && !book.cover) URL.revokeObjectURL(coverPreviewUrl);
            if (pdfPreviewUrl && !book.pdf_url) URL.revokeObjectURL(pdfPreviewUrl);
        };
    }, [coverPreviewUrl, pdfPreviewUrl, book.cover, book.pdf_url]);

    // Helper to handle boolean values that may come as strings from the server/form
    const isTruthyBoolean = (val: any) => val === true || val === '1' || val === 'true' || val === 1;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'pdf_url') => {
        const file = e.target.files?.[0];
        if (!file) {
            setData(field, null);
            if (field === 'cover') setCoverPreviewUrl(book.cover || null);
            else {
                setPdfPreviewUrl(book.pdf_url || null);
                setPdfFileError(null);
            }
            return;
        }

        if (field === 'cover') {
            if (!file.type.match('image/(jpeg|png)')) {
                setData(field, null);
                e.target.value = '';
                setClientErrors((prev) => [...prev, t.coverError]);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setData(field, null);
                e.target.value = '';
                setClientErrors((prev) => [...prev, 'Cover image exceeds 5MB limit. Please upload a smaller file.']);
                return;
            }
        }
        if (field === 'pdf_url') {
            if (file.type !== 'application/pdf') {
                setData(field, null);
                e.target.value = '';
                setPdfFileError(t.pdfFileError);
                return;
            }
            if (file.size > 30 * 1024 * 1024) {
                setData(field, null);
                e.target.value = '';
                setPdfFileError('PDF file exceeds 30MB limit. Please upload a smaller file.');
                return;
            }
            setPdfFileError(null);
        }

        setData(field, file);
        const newUrl = URL.createObjectURL(file);
        if (field === 'cover') {
            if (coverPreviewUrl && !book.cover) URL.revokeObjectURL(coverPreviewUrl);
            setCoverPreviewUrl(newUrl);
        } else {
            if (pdfPreviewUrl && !book.pdf_url) URL.revokeObjectURL(pdfPreviewUrl);
            setPdfPreviewUrl(newUrl);
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) {
            setPdfFileError('No file was dropped. Please try again.');
            return;
        }
        if (file.type !== 'application/pdf') {
            setPdfFileError(t.pdfFileError);
            return;
        }
        if (file.size > 30 * 1024 * 1024) {
            setPdfFileError('PDF file exceeds 30MB limit. Please drop a smaller file.');
            return;
        }
        setPdfFileError(null);
        if (pdfPreviewUrl && !book.pdf_url) URL.revokeObjectURL(pdfPreviewUrl);
        setData('pdf_url', file);
        setPdfPreviewUrl(URL.createObjectURL(file));
    };

    const validateForm = () => {
        const errors: string[] = [];
        // For updates, fields are 'sometimes' — only enforce required ones when applicable
        if (!data.type) errors.push(t.typeError || 'Book type is required.');
        if (data.title !== undefined && data.title === '') errors.push(t.titleError);
        if (data.page_count !== undefined && parseInt(data.page_count) < 1) errors.push(t.pageCountError);
        if (data.publisher !== undefined && data.publisher === '') errors.push(t.publisherError);
        if (data.language !== undefined && data.language === '') errors.push(t.languageError);
        if (data.code !== undefined && data.code === '') errors.push(t.codeError);
        if (data.view !== undefined && isNaN(parseInt(data.view))) errors.push('The view field must be an integer.');
        // Category should exist when provided
        if (data.category_id !== undefined && data.category_id === '') errors.push(t.categoryError);
        // Conditional checks based on type
        if (!isEbook && (data.is_available === null || data.is_available === undefined)) errors.push(t.availabilityError);
        if (isEbook && (data.downloadable === null || data.downloadable === undefined))
            errors.push(t.downloadableError || 'Downloadable status is required.');
        if (!isEbook && (data.bookcase_id === null || data.bookcase_id === undefined || data.bookcase_id === '')) errors.push(t.bookcaseError);
        if (!isEbook && (data.shelf_id === null || data.shelf_id === undefined || data.shelf_id === '')) errors.push(t.shelfError);
        if (!isEbook && (data.campus_id === null || data.campus_id === undefined || data.campus_id === '')) errors.push(t.campusError);
        setClientErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            setShowErrorAlert(true);
            return;
        }
        // Debug form data
        console.log('Form Data:', data);

        // Build an explicit payload so fields required by "required_if" are present when applicable.
        const payload: any = { ...data };

        // Ensure these fields are sent as strings (or empty string) so FormData includes them
        payload.bookcase_id = data.bookcase_id ?? '';
        payload.shelf_id = data.shelf_id ?? '';
        payload.campus_id = data.campus_id ?? '';

        // Booleans: send as '1'/'0' or empty string when unset
        payload.is_available = data.is_available === null || data.is_available === undefined ? '' : data.is_available ? '1' : '0';
        payload.downloadable = data.downloadable === null || data.downloadable === undefined ? '' : data.downloadable ? '1' : '0';

        // Merge normalized payload into the form state so put() sends the correct fields
        setData((prev) => ({ ...prev, ...payload }));

        // Debug output: print normalized payload and FormData entries
        try {
            console.group('Submitting normalized payload');
            console.log(payload);
            const fd = new FormData();
            Object.keys(payload).forEach((k) => {
                const v: any = (payload as any)[k];
                if (v instanceof File) {
                    fd.append(k, v);
                } else if (Array.isArray(v)) {
                    v.forEach((item) => fd.append(k + '[]', String(item)));
                } else if (v !== undefined) {
                    fd.append(k, String(v));
                }
            });
            for (const pair of fd.entries()) {
                console.log(pair[0], pair[1]);
            }
            console.groupEnd();
        } catch (e) {
            console.warn('Failed to dump FormData for debug', e);
        }

        put(route('books.update', book.id), {
            forceFormData: true,
            onSuccess: () => {
                // On success Inertia will handle redirect/flash; clear local error state
                setShowErrorAlert(false);
                setPdfFileError(null);
                setClientErrors([]);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleTypeChange = (newType: 'physical' | 'ebook') => {
        setType(newType);
        // setData expects Partial form data; cast nulls where fields accept null
        setData({
            type: newType,
            is_available: (newType === 'physical' ? (data.is_available ?? true) : null) as any,
            downloadable: (newType === 'ebook' ? (data.downloadable ?? true) : null) as any,
            bookcase_id: (newType === 'physical' ? data.bookcase_id : null) as any,
            shelf_id: (newType === 'physical' ? data.shelf_id : null) as any,
            campus_id: (newType === 'physical' ? data.campus_id : null) as any,
            code: data.code || generateCode(),
        });
    };

    return (
        <ErrorBoundary pageProps={{ lang }}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={isEbook ? t.editEBook : t.editPhysicalBook} />
                <div className="max-w-auto p-2 sm:p-6 lg:p-8">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{isEbook ? t.editEBook : t.editPhysicalBook}</h1>

                        {showErrorAlert && (Object.keys(errors).length > 0 || flash?.error || clientErrors.length > 0) && (
                            <Alert className="mb-6 rounded-lg border border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-2">
                                        <CheckCircle2Icon className="h-5 w-5 text-red-500 dark:text-red-400" />
                                        <div>
                                            <AlertTitle className="text-red-600 dark:text-red-400">{t.error}</AlertTitle>
                                            <AlertDescription className="text-gray-600 dark:text-gray-300">
                                                {clientErrors.length > 0 ? clientErrors.join(', ') : flash?.error || Object.values(errors).join(', ')}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            setShowErrorAlert(false);
                                            setClientErrors([]);
                                        }}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        variant="ghost"
                                        size="sm"
                                        disabled={processing}
                                        aria-label="Dismiss error alert"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2" encType="multipart/form-data">
                            <input type="hidden" name="type" value={data.type} />
                            {/* Ensure these fields are always present in the submitted FormData */}
                            <input type="hidden" name="bookcase_id" value={data.bookcase_id ?? ''} />
                            <input type="hidden" name="shelf_id" value={data.shelf_id ?? ''} />
                            <input type="hidden" name="campus_id" value={data.campus_id ?? ''} />
                            <input
                                type="hidden"
                                name="is_available"
                                value={data.is_available === null || data.is_available === undefined ? '' : String(data.is_available)}
                            />
                            <input
                                type="hidden"
                                name="downloadable"
                                value={data.downloadable === null || data.downloadable === undefined ? '' : String(data.downloadable)}
                            />

                            {/* Tabs for Physical/Ebook */}
                            <div className="col-span-full">
                                <div className="border-b border-gray-200 dark:border-gray-600">
                                    <nav className="flex space-x-4">
                                        {['physical', 'ebook'].map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => handleTypeChange(tab as 'physical' | 'ebook')}
                                                className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                                    type === tab
                                                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                                        : 'text-gray-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {t[tab as keyof typeof t]}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="col-span-full">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{t.basicInformation}</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.title} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    // optional on update, server validates when provided
                                                    aria-describedby={errors.title ? 'title-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.titlePlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.title && (
                                        <p id="title-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.title || t.titleError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.titleHelper}</p>
                                </div>
                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.description}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.description
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } resize-y bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    rows={4}
                                                    aria-describedby={errors.description ? 'description-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">
                                                {t.descriptionPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.description && (
                                        <p id="description-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.description || t.descriptionError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.descriptionHelper}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="page_count" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.pageCount} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="page_count"
                                                    type="number"
                                                    value={data.page_count}
                                                    onChange={(e) => setData('page_count', e.target.value)}
                                                    min="1"
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.page_count
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    // optional on update
                                                    aria-describedby={errors.page_count ? 'page_count-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.pageCountPlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.page_count && (
                                        <p id="page_count-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.page_count || t.pageCountError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.pageCountHelper}</p>
                                </div>
                                <div>
                                    <Label htmlFor="publisher" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.publisher} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="publisher"
                                                    value={data.publisher}
                                                    onChange={(e) => setData('publisher', e.target.value)}
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.publisher
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    // optional on update
                                                    aria-describedby={errors.publisher ? 'publisher-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.publisherPlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.publisher && (
                                        <p id="publisher-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.publisher || t.publisherError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.publisherHelper}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.language} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.language}
                                                    onValueChange={(value) => setData('language', value)}
                                                    // optional on update
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-lg border ${
                                                            errors.language
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-gray-300 dark:border-gray-600'
                                                        } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.language ? 'language-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.languagePlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                                        <SelectItem value="en">{t.language === 'ភាសា' ? 'អង់គ្លេស' : 'English'}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.languagePlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.language && (
                                        <p id="language-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.language || t.languageError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.languageHelper}</p>
                                </div>
                                <div>
                                    <Label htmlFor="published_at" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.publishedAt}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="published_at"
                                                    type="number"
                                                    value={data.published_at}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || /^\d{1,4}$/.test(value)) {
                                                            setData('published_at', value);
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        const value = e.target.value;
                                                        if (value !== '' && (parseInt(value) < 1000 || parseInt(value) > 2025)) {
                                                            setClientErrors((prev) => [
                                                                ...prev.filter((err) => err !== t.publishedAtError),
                                                                t.publishedAtError,
                                                            ]);
                                                        } else {
                                                            setClientErrors((prev) => prev.filter((err) => err !== t.publishedAtError));
                                                        }
                                                    }}
                                                    min="1000"
                                                    max="2025"
                                                    placeholder={t.publishedAtPlaceholder}
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.published_at || clientErrors.includes(t.publishedAtError)
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    aria-describedby={errors.published_at ? 'published_at-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">
                                                {t.publishedAtPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {(errors.published_at || clientErrors.includes(t.publishedAtError)) && (
                                        <p id="published_at-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.published_at || t.publishedAtError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.publishedAtHelper}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="author" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.author}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="author"
                                                    value={data.author}
                                                    onChange={(e) => setData('author', e.target.value)}
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.author ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    aria-describedby={errors.author ? 'author-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.authorPlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.author && (
                                        <p id="author-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.author || t.authorError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.authorHelper}</p>
                                </div>
                                <div>
                                    <Label htmlFor="flip_link" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.flipLink}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="flip_link"
                                                    value={data.flip_link}
                                                    onChange={(e) => setData('flip_link', e.target.value)}
                                                    type="url"
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.flip_link
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    aria-describedby={errors.flip_link ? 'flip_link-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.flipLinkPlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.flip_link && (
                                        <p id="flip_link-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.flip_link || t.flipLinkError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.flipLinkHelper}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.code} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="code"
                                                    value={data.code}
                                                    onChange={(e) => setData('code', e.target.value)}
                                                    maxLength={10}
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.code ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    placeholder={t.codePlaceholder}
                                                    // optional on update (sometimes)
                                                    aria-describedby={errors.code ? 'code-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.codePlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.code && (
                                        <p id="code-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.code || t.codeError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.codeHelper}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="isbn" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.isbn}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="isbn"
                                                    value={data.isbn}
                                                    onChange={(e) => setData('isbn', e.target.value)}
                                                    maxLength={13}
                                                    className={`mt-1 w-full rounded-lg border ${
                                                        errors.isbn ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    aria-describedby={errors.isbn ? 'isbn-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.isbnPlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.isbn && (
                                        <p id="isbn-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.isbn || t.isbnError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.isbnHelper}</p>
                                </div>
                            </div>
                            <div className="col-span-full space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {isEbook ? t.downloadable : t.availability} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="mt-1 flex items-center space-x-6">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={isEbook ? 'downloadable-yes' : 'is_available-yes'}
                                                            name={isEbook ? 'downloadable' : 'is_available'}
                                                            checked={isEbook ? data.downloadable === true : data.is_available === true}
                                                            onChange={() => setData(isEbook ? 'downloadable' : 'is_available', true)}
                                                            className="h-4 w-4 border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-400"
                                                            aria-describedby={
                                                                errors.is_available || errors.downloadable ? 'availability-error' : undefined
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={isEbook ? 'downloadable-yes' : 'is_available-yes'}
                                                            className="ml-2 text-sm text-gray-700 dark:text-gray-200"
                                                        >
                                                            {t.yes}
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={isEbook ? 'downloadable-no' : 'is_available-no'}
                                                            name={isEbook ? 'downloadable' : 'is_available'}
                                                            checked={isEbook ? data.downloadable === false : data.is_available === false}
                                                            onChange={() => setData(isEbook ? 'downloadable' : 'is_available', false)}
                                                            className="h-4 w-4 border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-400"
                                                            aria-describedby={
                                                                errors.is_available || errors.downloadable ? 'availability-error' : undefined
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={isEbook ? 'downloadable-no' : 'is_available-no'}
                                                            className="ml-2 text-sm text-gray-700 dark:text-gray-200"
                                                        >
                                                            {t.no}
                                                        </Label>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">
                                                {isEbook ? t.downloadableHelper : t.availabilityHelper}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {(errors.is_available || errors.downloadable) && (
                                        <p id="availability-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.is_available || errors.downloadable || t.availabilityError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {isEbook ? t.downloadableHelper : t.availabilityHelper}
                                    </p>
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="col-span-full">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{t.classification}</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.category} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.category_id || undefined}
                                                    onValueChange={(value) => setData('category_id', value)}
                                                    // optional on update
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-lg border ${
                                                            errors.category_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-gray-300 dark:border-gray-600'
                                                        } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.category_id ? 'category-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.categoryPlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.categoryPlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.category_id && (
                                        <p id="category-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.category_id || t.categoryError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.categoryHelper}</p>
                                </div>
                                <div>
                                    <Label htmlFor="grade" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.grade}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.grade_id || undefined}
                                                    onValueChange={(value) => setData('grade_id', value === 'none' ? null : value)}
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-lg border ${
                                                            errors.grade_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-gray-300 dark:border-gray-600'
                                                        } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.grade_id ? 'grade-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.gradePlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                                        <SelectItem value="none">{t.no}</SelectItem>
                                                        {grades.map((grade) => (
                                                            <SelectItem key={grade.id} value={grade.id.toString()}>
                                                                {grade.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.gradePlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.grade_id && (
                                        <p id="grade-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.grade_id || t.gradeError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.gradeHelper}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.subcategory}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.subcategory_id || undefined}
                                                    onValueChange={(value) => setData('subcategory_id', value === 'none' ? null : value)}
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-lg border ${
                                                            errors.subcategory_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-gray-300 dark:border-gray-600'
                                                        } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.subcategory_id ? 'subcategory-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.subcategoryPlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                                        <SelectItem value="none">{t.no}</SelectItem>
                                                        {subcategories.map((sub) => (
                                                            <SelectItem key={sub.id} value={sub.id.toString()}>
                                                                {sub.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">
                                                {t.subcategoryPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.subcategory_id && (
                                        <p id="subcategory-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.subcategory_id || t.subcategoryError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.subcategoryHelper}</p>
                                </div>
                                <div>
                                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.subject}
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.subject_id || undefined}
                                                    onValueChange={(value) => setData('subject_id', value === 'none' ? null : value)}
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-lg border ${
                                                            errors.subject_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-gray-300 dark:border-gray-600'
                                                        } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.subject_id ? 'subject-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.subjectPlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                                        <SelectItem value="none">{t.no}</SelectItem>
                                                        {subjects.map((subject) => (
                                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                                {subject.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-lg bg-indigo-600 text-white">{t.subjectPlaceholder}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.subject_id && (
                                        <p id="subject-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.subject_id || t.subjectError}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.subjectHelper}</p>
                                </div>
                            </div>

                            {/* Location (Physical Books Only) */}
                            {!isEbook && (
                                <>
                                    <div className="col-span-full">
                                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{t.location}</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="bookcase" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {t.bookcase} <span className="text-red-500">*</span>
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Select
                                                            value={data.bookcase_id || undefined}
                                                            onValueChange={(value) => setData('bookcase_id', value)}
                                                        >
                                                            <SelectTrigger
                                                                className={`mt-1 w-full rounded-lg border ${
                                                                    errors.bookcase_id
                                                                        ? 'border-red-500 dark:border-red-400'
                                                                        : 'border-gray-300 dark:border-gray-600'
                                                                } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                                aria-describedby={errors.bookcase_id ? 'bookcase-error' : undefined}
                                                            >
                                                                <SelectValue placeholder={t.bookcasePlaceholder} />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                                                {bookcases.map((bookcase) => (
                                                                    <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
                                                                        {bookcase.code}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="rounded-lg bg-indigo-600 text-white">
                                                        {t.bookcasePlaceholder}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {errors.bookcase_id && (
                                                <p id="bookcase-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                    {errors.bookcase_id || t.bookcaseError}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.bookcaseHelper}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="shelf" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {t.shelf} <span className="text-red-500">*</span>
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Select
                                                            value={data.shelf_id || undefined}
                                                            onValueChange={(value) => setData('shelf_id', value)}
                                                        >
                                                            <SelectTrigger
                                                                className={`mt-1 w-full rounded-lg border ${
                                                                    errors.shelf_id
                                                                        ? 'border-red-500 dark:border-red-400'
                                                                        : 'border-gray-300 dark:border-gray-600'
                                                                } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                                aria-describedby={errors.shelf_id ? 'shelf-error' : undefined}
                                                            >
                                                                <SelectValue placeholder={t.shelfPlaceholder} />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                                                {shelves.map((shelf) => (
                                                                    <SelectItem key={shelf.id} value={shelf.id.toString()}>
                                                                        {shelf.code}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="rounded-lg bg-indigo-600 text-white">
                                                        {t.shelfPlaceholder}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {errors.shelf_id && (
                                                <p id="shelf-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                    {errors.shelf_id || t.shelfError}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.shelfHelper}</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Files */}
                            <div className="col-span-full">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{t.files}</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="cover" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {t.cover}
                                    </Label>
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            id="cover"
                                            onChange={(e) => handleFileChange(e, 'cover')}
                                            accept="image/jpeg,image/png"
                                            className={`w-full rounded-lg border ${
                                                errors.cover || clientErrors.includes(t.coverError)
                                                    ? 'border-red-500 dark:border-red-400'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            } bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                            aria-describedby={errors.cover ? 'cover-error' : undefined}
                                        />
                                    </div>
                                    {errors.cover && (
                                        <p id="cover-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.cover || t.coverError}
                                        </p>
                                    )}
                                    {coverPreviewUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={coverPreviewUrl}
                                                alt="Cover preview"
                                                className="h-32 w-32 cursor-pointer rounded-lg object-cover"
                                                onClick={() => setIsCoverModalOpen(true)}
                                            />
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.coverHelper}</p>
                                </div>
                            </div>
                            {isEbook && (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="pdf_url" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {t.pdfFile}
                                        </Label>
                                        <div
                                            className={`mt-1 rounded-lg border ${
                                                errors.pdf_url || pdfFileError
                                                    ? 'border-red-500 dark:border-red-400'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            } ${dragActive ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''} p-4 transition-colors duration-200`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                type="file"
                                                id="pdf_url"
                                                onChange={(e) => handleFileChange(e, 'pdf_url')}
                                                accept="application/pdf"
                                                className="w-full"
                                                aria-describedby={errors.pdf_url || pdfFileError ? 'pdf_url-error' : undefined}
                                            />
                                            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{t.dragDrop}</p>
                                        </div>
                                        {(errors.pdf_url || pdfFileError) && (
                                            <p id="pdf_url-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                {errors.pdf_url || pdfFileError || t.pdfFileError}
                                            </p>
                                        )}
                                        {pdfPreviewUrl && (
                                            <div className="mt-2">
                                                <Button
                                                    onClick={() => setIsPdfModalOpen(true)}
                                                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    variant="link"
                                                >
                                                    {t.pdfPreview}
                                                </Button>
                                            </div>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.pdfFileHelper}</p>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="col-span-full mt-6 flex justify-end space-x-4">
                                <Button
                                    onClick={() => reset()}
                                    className="rounded-lg bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
                                    variant="default"
                                    disabled={processing}
                                >
                                    {t.reset}
                                </Button>
                                <Button
                                    type="submit"
                                    className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                    disabled={processing}
                                >
                                    {processing ? t.updating : t.save}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Cover Preview Modal */}
                {isCoverModalOpen && coverPreviewUrl && (
                    <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
                        <DialogContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                            <DialogHeader>
                                <DialogTitle className="text-gray-900 dark:text-gray-100">{t.coverPreview}</DialogTitle>
                            </DialogHeader>
                            <img src={coverPreviewUrl} alt="Cover preview" className="h-auto w-full rounded-lg" />
                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={() => setIsCoverModalOpen(false)}
                                    className="rounded-lg bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
                                >
                                    {t.close}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* PDF Preview Modal */}
                {isPdfModalOpen && pdfPreviewUrl && (
                    <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                        <DialogContent className="max-w-4xl border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                            <DialogHeader>
                                <DialogTitle className="text-gray-900 dark:text-gray-100">{t.pdfPreview}</DialogTitle>
                            </DialogHeader>
                            <div className="h-[500px] overflow-auto">
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={pdfPreviewUrl} plugins={[defaultLayoutPluginInstance]} />
                                </Worker>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={() => setIsPdfModalOpen(false)}
                                    className="rounded-lg bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
                                >
                                    {t.close}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AppLayout>
        </ErrorBoundary>
    );
}
