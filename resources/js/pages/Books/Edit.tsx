"use client";

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2Icon, X } from 'lucide-react';
import { useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    description: string;
    page_count: number;
    publisher: string;
    language: 'en';
    published_at?: number | null;
    author?: string;
    flip_link?: string;
    code: string;
    isbn?: string;
    view: number;
    is_available?: boolean;
    downloadable?: boolean;
    cover?: string;
    pdf_url?: string;
    category_id: number;
    subcategory_id?: number;
    shelf_id?: number;
    bookcase_id?: number;
    grade_id?: number;
    subject_id?: number;
    campus_id?: number;
}

interface BooksEditProps {
    book: Book;
    categories: Category[];
    subcategories: Subcategory[];
    shelves: Shelf[];
    bookcases: Bookcase[];
    grades: Grade[];
    subjects: Subject[];
    campuses: Campus[]; // Added campuses prop
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
        campusError: 'Campus is required for physical books.',
        campusHelper: 'Select the campus where the book is located.',
        files: 'Files',
        cover: 'Cover (portrait recommended)',
        coverPlaceholder: 'Upload a cover image',
        coverError: 'Please upload a valid cover image (JPEG/PNG, max 2MB).',
        coverHelper: 'Optional: JPEG or PNG, max 2MB.',
        pdfFile: 'PDF File (200MB max, optional for e-books)',
        pdfFilePlaceholder: 'Upload a PDF file (optional)',
        pdfFileError: 'Please upload a valid PDF file (max 200MB).',
        pdfFileHelper: 'Optional: PDF, max 200MB.',
        browse: 'Browse',
        remove: 'Remove',
        preview: 'Preview',
        createButton: 'Create Book',
        creating: 'Creating...',
        cancel: 'Cancel, Go Back to Books List',
        coverPreview: 'Cover Preview',
        pdfPreview: 'PDF Preview',
        noCoverAvailable: 'No cover image available.',
        noPdfAvailable: 'No PDF file available.',
        saveBook: 'Save the new book',
        returnToBooks: 'Return to the books list',
        physical: 'Physical',
        ebook: 'E-Book',
        audio: 'Audio',
        comingSoon: '(Coming Soon)',
        reset: 'Reset',
        save: 'Save',
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
                    <Alert className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
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

export default function BooksEdit({
                                      book,
                                      categories,
                                      subcategories,
                                      shelves,
                                      bookcases,
                                      grades,
                                      subjects,
                                      campuses,
                                      flash,
                                  }: BooksEditProps) {
    const { props } = usePage<{ lang?: string }>();
    const lang = props.lang === 'kh' ? 'kh' : 'en';
    const t = translations[lang];

    const [type, setType] = useState<'physical' | 'ebook'>(book.type);
    const isEbook = type === 'ebook';
    const [pdfFileError, setPdfFileError] = useState<string | null>(null);
    const [showErrorAlert, setShowErrorAlert] = useState(!!flash?.error);
    const [clientErrors, setClientErrors] = useState<string[]>([]);

    const { data, setData, put, processing, errors, reset } = useForm({
        title: book.title || '',
        description: book.description || '',
        page_count: book.page_count?.toString() || '1',
        publisher: book.publisher || '',
        language: book.language || 'en',
        published_at: book.published_at?.toString() || '',
        author: book.author || '',
        flip_link: book.flip_link || '',
        cover: null as File | null,
        code: book.code || '',
        isbn: book.isbn || '',
        view: book.view?.toString() || '0',
        is_available: book.is_available ?? (book.type === 'physical' ? true : null),
        pdf_url: null as File | null,
        category_id: book.category_id?.toString() || '',
        subcategory_id: book.subcategory_id?.toString() || null,
        shelf_id: book.shelf_id?.toString() || null,
        bookcase_id: book.bookcase_id?.toString() || null,
        grade_id: book.grade_id?.toString() || null,
        subject_id: book.subject_id?.toString() || null,
        downloadable: book.downloadable ?? (book.type === 'ebook' ? true : null),
        type: book.type || 'physical',
        campus_id: book.campus_id?.toString() || null,
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
        const category = data.category_id
            ? categories.find((cat) => cat.id.toString() === data.category_id)
            : null;
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
            if (coverPreviewUrl && coverPreviewUrl !== book.cover) URL.revokeObjectURL(coverPreviewUrl);
            if (pdfPreviewUrl && pdfPreviewUrl !== book.pdf_url) URL.revokeObjectURL(pdfPreviewUrl);
        };
    }, [coverPreviewUrl, pdfPreviewUrl, book.cover, book.pdf_url]);

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
            if (file.size > 2 * 1024 * 1024) {
                setData(field, null);
                e.target.value = '';
                setClientErrors((prev) => [...prev, 'Cover image exceeds 2MB limit. Please upload a smaller file.']);
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
            if (file.size > 200 * 1024 * 1024) {
                setData(field, null);
                e.target.value = '';
                setPdfFileError('PDF file exceeds 200MB limit. Please upload a smaller file.');
                return;
            }
            setPdfFileError(null);
        }

        setData(field, file);
        const newUrl = URL.createObjectURL(file);
        if (field === 'cover') {
            if (coverPreviewUrl && coverPreviewUrl !== book.cover) URL.revokeObjectURL(coverPreviewUrl);
            setCoverPreviewUrl(newUrl);
        } else {
            if (pdfPreviewUrl && pdfPreviewUrl !== book.pdf_url) URL.revokeObjectURL(pdfPreviewUrl);
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
        if (file.size > 200 * 1024 * 1024) {
            setPdfFileError('PDF file exceeds 200MB limit. Please drop a smaller file.');
            return;
        }
        setPdfFileError(null);
        if (pdfPreviewUrl && pdfPreviewUrl !== book.pdf_url) URL.revokeObjectURL(pdfPreviewUrl);
        setData('pdf_url', file);
        setPdfPreviewUrl(URL.createObjectURL(file));
    };

    const validateForm = () => {
        const errors: string[] = [];
        if (!data.type) errors.push(t.typeError || 'Book type is required.');
        if (!data.title) errors.push(t.titleError);
        if (!data.page_count || parseInt(data.page_count) < 1) errors.push(t.pageCountError);
        if (!data.publisher) errors.push(t.publisherError);
        if (!data.language) errors.push(t.languageError);
        if (!data.code) errors.push(t.codeError);
        if (!data.view || isNaN(parseInt(data.view))) errors.push('The view field is required.');
        if (!data.category_id) errors.push(t.categoryError);
        if (!isEbook && data.is_available === null) errors.push(t.availabilityError);
        if (isEbook && data.downloadable === null) errors.push(t.downloadableError || 'Downloadable status is required.');
        if (!isEbook && !data.bookcase_id) errors.push(t.bookcaseError);
        if (!isEbook && !data.shelf_id) errors.push(t.shelfError);
        if (!isEbook && !data.campus_id) errors.push(t.campusError);
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

        put(route('books.update', book.id), {
            forceFormData: true,
            onSuccess: () => {
                setShowErrorAlert(false);
                setCoverPreviewUrl(book.cover || null);
                setPdfPreviewUrl(book.pdf_url || null);
                setPdfFileError(null);
                setClientErrors([]);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleTypeChange = (newType: 'physical' | 'ebook') => {
        setType(newType);
        setData((prev) => ({
            ...prev,
            type: newType,
            is_available: newType === 'physical' ? (prev.is_available ?? true) : null,
            downloadable: newType === 'ebook' ? (prev.downloadable ?? true) : null,
            bookcase_id: newType === 'physical' ? prev.bookcase_id : null,
            shelf_id: newType === 'physical' ? prev.shelf_id : null,
            campus_id: newType === 'physical' ? prev.campus_id : null,
            code: prev.code || generateCode(),
        }));
    };

    return (
        <ErrorBoundary pageProps={{ lang }}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={isEbook ? t.editEBook : t.editPhysicalBook} />
                <div className="p-2 sm:p-6 lg:p-8 max-w-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {isEbook ? t.editEBook : t.editPhysicalBook}
                        </h1>

                        {showErrorAlert && (Object.keys(errors).length > 0 || flash?.error || clientErrors.length > 0) && (
                            <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-2">
                                        <CheckCircle2Icon className="h-5 w-5 text-red-500 dark:text-red-400" />
                                        <div>
                                            <AlertTitle className="text-red-600 dark:text-red-400">{t.error}</AlertTitle>
                                            <AlertDescription className="text-gray-600 dark:text-gray-300">
                                                {clientErrors.length > 0
                                                    ? clientErrors.join(', ')
                                                    : flash?.error || Object.values(errors).join(', ')}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            setShowErrorAlert(false);
                                            setClientErrors([]);
                                        }}
                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
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

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6" encType="multipart/form-data">
                            <input type="hidden" name="type" value={data.type} />

                            {/* Tabs for Physical/Ebook */}
                            <div className="col-span-full">
                                <div className="border-b border-gray-200 dark:border-gray-600">
                                    <nav className="flex space-x-4">
                                        {['physical', 'ebook'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => handleTypeChange(tab as 'physical' | 'ebook')}
                                                className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                                                    type === tab
                                                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
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
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.basicInformation}</h2>
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    required
                                                    aria-describedby={errors.title ? 'title-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.titlePlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.title && (
                                        <p id="title-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.title || t.titleError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.titleHelper}</p>
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
                            className={`w-full mt-1 rounded-lg border ${
                                errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                            } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y`}
                            rows={4}
                            aria-describedby={errors.description ? 'description-error' : undefined}
                        />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.descriptionPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.description && (
                                        <p id="description-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.description || t.descriptionError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.descriptionHelper}</p>
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.page_count ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    required
                                                    aria-describedby={errors.page_count ? 'page_count-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.pageCountPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.page_count && (
                                        <p id="page_count-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.page_count || t.pageCountError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.pageCountHelper}</p>
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.publisher ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    required
                                                    aria-describedby={errors.publisher ? 'publisher-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.publisherPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.publisher && (
                                        <p id="publisher-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.publisher || t.publisherError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.publisherHelper}</p>
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
                                                    required
                                                >
                                                    <SelectTrigger
                                                        className={`w-full mt-1 rounded-lg border ${
                                                            errors.language ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                        } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                        aria-describedby={errors.language ? 'language-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.languagePlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                                        <SelectItem value="en">{t.language === 'ភាសា' ? 'អង់គ្លេស' : 'English'}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.languagePlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.language && (
                                        <p id="language-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.language || t.languageError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.languageHelper}</p>
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
                                                        if (value === '' || (/^\d{1,4}$/.test(value))) {
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.published_at || clientErrors.includes(t.publishedAtError)
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    aria-describedby={errors.published_at ? 'published_at-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.publishedAtPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {(errors.published_at || clientErrors.includes(t.publishedAtError)) && (
                                        <p id="published_at-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.published_at || t.publishedAtError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.publishedAtHelper}</p>
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.author ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    aria-describedby={errors.author ? 'author-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.authorPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.author && (
                                        <p id="author-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.author || t.authorError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.authorHelper}</p>
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.flip_link ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    aria-describedby={errors.flip_link ? 'flip_link-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.flipLinkPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.flip_link && (
                                        <p id="flip_link-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.flip_link || t.flipLinkError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.flipLinkHelper}</p>
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.code ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    placeholder={t.codePlaceholder}
                                                    required
                                                    aria-describedby={errors.code ? 'code-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.codePlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.code && (
                                        <p id="code-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.code || t.codeError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.codeHelper}</p>
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
                                                    className={`w-full mt-1 rounded-lg border ${
                                                        errors.isbn ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                    aria-describedby={errors.isbn ? 'isbn-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.isbnPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.isbn && (
                                        <p id="isbn-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.isbn || t.isbnError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.isbnHelper}</p>
                                </div>
                            </div>
                            <div className="space-y-4 col-span-full">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {isEbook ? t.downloadable : t.availability} <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center space-x-6 mt-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={isEbook ? 'downloadable-yes' : 'is_available-yes'}
                                                            name={isEbook ? 'downloadable' : 'is_available'}
                                                            checked={isEbook ? data.downloadable === true : data.is_available === true}
                                                            onChange={() => setData(isEbook ? 'downloadable' : 'is_available', true)}
                                                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
                                                            required
                                                            aria-describedby={(errors.is_available || errors.downloadable) ? 'availability-error' : undefined}
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
                                                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
                                                            aria-describedby={(errors.is_available || errors.downloadable) ? 'availability-error' : undefined}
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
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {isEbook ? t.downloadableHelper : t.availabilityHelper}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {(errors.is_available || errors.downloadable) && (
                                        <p id="availability-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.is_available || errors.downloadable || t.availabilityError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {isEbook ? t.downloadableHelper : t.availabilityHelper}
                                    </p>
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="col-span-full">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.classification}</h2>
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
                                                    required
                                                >
                                                    <SelectTrigger
                                                        className={`w-full mt-1 rounded-lg border ${
                                                            errors.category_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                        } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                        aria-describedby={errors.category_id ? 'category-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.categoryPlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.categoryPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.category_id && (
                                        <p id="category-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.category_id || t.categoryError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.categoryHelper}</p>
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
                                                        className={`w-full mt-1 rounded-lg border ${
                                                            errors.grade_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                        } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                        aria-describedby={errors.grade_id ? 'grade-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.gradePlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                                        <SelectItem value="none">{t.no}</SelectItem>
                                                        {grades.map((grade) => (
                                                            <SelectItem key={grade.id} value={grade.id.toString()}>
                                                                {grade.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.gradePlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.grade_id && (
                                        <p id="grade-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.grade_id || t.gradeError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.gradeHelper}</p>
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
                                                        className={`w-full mt-1 rounded-lg border ${
                                                            errors.subcategory_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                        } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                        aria-describedby={errors.subcategory_id ? 'subcategory-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.subcategoryPlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                                        <SelectItem value="none">{t.no}</SelectItem>
                                                        {subcategories.map((sub) => (
                                                            <SelectItem key={sub.id} value={sub.id.toString()}>
                                                                {sub.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.subcategoryPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.subcategory_id && (
                                        <p id="subcategory-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.subcategory_id || t.subcategoryError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.subcategoryHelper}</p>
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
                                                        className={`w-full mt-1 rounded-lg border ${
                                                            errors.subject_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                        } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                        aria-describedby={errors.subject_id ? 'subject-error' : undefined}
                                                    >
                                                        <SelectValue placeholder={t.subjectPlaceholder} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                                        <SelectItem value="none">{t.no}</SelectItem>
                                                        {subjects.map((subject) => (
                                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                                {subject.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                {t.subjectPlaceholder}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.subject_id && (
                                        <p id="subject-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.subject_id || t.subjectError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.subjectHelper}</p>
                                </div>
                            </div>

                            {/* Location (Physical Books Only) */}
                            {!isEbook && (
                                <>
                                    <div className="col-span-full">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.location}</h2>
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
                                                            required
                                                        >
                                                            <SelectTrigger
                                                                className={`w-full mt-1 rounded-lg border ${
                                                                    errors.bookcase_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                                } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                                aria-describedby={errors.bookcase_id ? 'bookcase-error' : undefined}
                                                            >
                                                                <SelectValue placeholder={t.bookcasePlaceholder} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                                                {bookcases.map((bookcase) => (
                                                                    <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
                                                                        {bookcase.code}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                        {t.bookcasePlaceholder}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {errors.bookcase_id && (
                                                <p id="bookcase-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                                    {errors.bookcase_id || t.bookcaseError}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.bookcaseHelper}</p>
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
                                                            required
                                                        >
                                                            <SelectTrigger
                                                                className={`w-full mt-1 rounded-lg border ${
                                                                    errors.shelf_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                                                } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                                                aria-describedby={errors.shelf_id ? 'shelf-error' : undefined}
                                                            >
                                                                <SelectValue placeholder={t.shelfPlaceholder} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                                                {shelves.map((shelf) => (
                                                                    <SelectItem key={shelf.id} value={shelf.id.toString()}>
                                                                        {shelf.code}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                                        {t.shelfPlaceholder}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {errors.shelf_id && (
                                                <p id="shelf-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                                    {errors.shelf_id || t.shelfError}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.shelfHelper}</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Files */}
                            <div className="col-span-full">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.files}</h2>
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
                                            } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                            aria-describedby={errors.cover ? 'cover-error' : undefined}
                                        />
                                    </div>
                                    {errors.cover && (
                                        <p id="cover-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                            {errors.cover || t.coverError}
                                        </p>
                                    )}
                                    {coverPreviewUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={coverPreviewUrl}
                                                alt="Cover preview"
                                                className="h-32 w-32 object-cover rounded-lg cursor-pointer"
                                                onClick={() => setIsCoverModalOpen(true)}
                                            />
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.coverHelper}</p>
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
                                                errors.pdf_url || pdfFileError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
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
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                                                {t.dragDrop}
                                            </p>
                                        </div>
                                        {(errors.pdf_url || pdfFileError) && (
                                            <p id="pdf_url-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                                {errors.pdf_url || pdfFileError || t.pdfFileError}
                                            </p>
                                        )}
                                        {pdfPreviewUrl && (
                                            <div className="mt-2">
                                                <Button
                                                    onClick={() => setIsPdfModalOpen(true)}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                                    variant="link"
                                                >
                                                    {t.pdfPreview}
                                                </Button>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.pdfFileHelper}</p>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="col-span-full flex justify-end space-x-4 mt-6">
                                <Button
                                    onClick={() => reset()}
                                    className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg"
                                    variant="default"
                                    disabled={processing}
                                >
                                    {t.reset}
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-lg"
                                    disabled={processing}
                                >
                                    {processing ? t.saving : t.save}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Cover Preview Modal */}
                {isCoverModalOpen && coverPreviewUrl && (
                    <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
                        <DialogContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <DialogHeader>
                                <DialogTitle className="text-gray-900 dark:text-gray-100">{t.coverPreview}</DialogTitle>
                            </DialogHeader>
                            <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-auto rounded-lg" />
                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={() => setIsCoverModalOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg"
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
                        <DialogContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 max-w-4xl">
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
                                    className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg"
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
