'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2Icon, X } from 'lucide-react';
import { Component, ReactNode, useCallback, useEffect, useState } from 'react';

// Interfaces
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
interface BooksEditProps {
    book: {
        id: number;
        title: string;
        description: string;
        page_count: string;
        publisher: string;
        language: string;
        published_at: string;
        author: string;
        flip_link: string;
        code: string;
        isbn: string;
        view: string;
        is_available: boolean;
        pdf_url?: string;
        cover?: string;
        category_id: string | null;
        subcategory_id: string | null;
        shelf_id: string | null;
        bookcase_id: string | null;
        grade_id: string | null;
        subject_id: string | null;
        downloadable: boolean;
        type: 'physical' | 'ebook' | 'audio';
    };
    categories: Category[];
    subcategories: Subcategory[];
    shelves: Shelf[];
    bookcases: Bookcase[];
    grades: Grade[];
    subjects: Subject[];
    flash?: { message: string | null; error: string | null };
}
interface FileFieldProps {
    label: string;
    id: string;
    accept: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    previewUrl?: string | null;
    onPreviewClick?: () => void;
    error?: string;
    helperText?: string;
    isDragDrop?: boolean;
    dragActive?: boolean;
    onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
    selectedFileName?: string;
    onRemove?: () => void;
    fileError?: string;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Books', href: route('books.index') },
    { title: 'Edit', href: '' },
];

// Generate random string for code
const generateRandomString = (length: number): string => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// ErrorBoundary
interface ErrorBoundaryProps {
    children: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-2xl dark:border-red-700 dark:from-red-900 dark:to-red-800">
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-300">Something went wrong</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            An error occurred while updating the book. Please try again or contact support.
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// FileField Component
const FileField: React.FC<FileFieldProps> = ({
                                                 label,
                                                 id,
                                                 accept,
                                                 onChange,
                                                 previewUrl,
                                                 onPreviewClick,
                                                 error,
                                                 helperText,
                                                 isDragDrop = false,
                                                 dragActive = false,
                                                 onDrag,
                                                 onDrop,
                                                 selectedFileName,
                                                 onRemove,
                                                 fileError,
                                             }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {isDragDrop && <span className="text-red-500">*</span>}
        </Label>
        {isDragDrop ? (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={`border-2 border-dashed ${
                                dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-indigo-200 dark:border-indigo-600'
                            } rounded-md p-4 text-center transition-all duration-200 ${
                                error || fileError ? 'border-red-500 dark:border-red-400' : ''
                            } mx-auto h-64 w-full max-w-md`}
                            onDragEnter={onDrag}
                            onDragLeave={onDrag}
                            onDragOver={onDrag}
                            onDrop={onDrop}
                            role="region"
                            aria-label={`Drag and drop ${label.toLowerCase()} file`}
                        >
                            <Input
                                id={id}
                                type="file"
                                accept={accept}
                                onChange={onChange}
                                className="hidden"
                                aria-describedby={error || fileError ? `${id}-error` : undefined}
                            />
                            <div className="flex h-full flex-col justify-center space-y-2">
                                {selectedFileName ? (
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Selected: {selectedFileName}{' '}
                                        {onRemove && (
                                            <Button
                                                variant="link"
                                                onClick={onRemove}
                                                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                                aria-label={`Remove ${selectedFileName}`}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                        {onPreviewClick && (
                                            <Button
                                                variant="link"
                                                onClick={onPreviewClick}
                                                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                                                aria-label={`Preview ${selectedFileName}`}
                                            >
                                                Preview
                                            </Button>
                                        )}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Drag and drop a {label.toLowerCase()} file here, or click to browse.
                                    </p>
                                )}
                                <Button
                                    type="button"
                                    onClick={() => document.getElementById(id)?.click()}
                                    className="rounded-md bg-indigo-500 px-3 py-1 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                    aria-label="Browse files"
                                >
                                    Browse
                                </Button>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                        Upload a {label.toLowerCase()} file
                    </TooltipContent>
                </Tooltip>
                {(error || fileError) && (
                    <p id={`${id}-error`} className="text-center text-sm text-red-500 dark:text-red-400">
                        {error || fileError}
                    </p>
                )}
                {helperText && <p className="text-center text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
            </TooltipProvider>
        ) : (
            <div className="space-y-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={`relative mx-auto h-64 w-full max-w-md border bg-white dark:bg-gray-700 ${
                                    error || fileError ? 'border-red-500 dark:border-red-400' : 'border-indigo-200 dark:border-indigo-600'
                                } flex cursor-pointer items-center justify-center overflow-hidden rounded-md`}
                                onClick={() => document.getElementById(id)?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        document.getElementById(id)?.click();
                                    }
                                }}
                            >
                                <Input
                                    id={id}
                                    type="file"
                                    accept={accept}
                                    onChange={onChange}
                                    className="hidden"
                                    aria-describedby={error || fileError ? `${id}-error` : undefined}
                                />
                                {previewUrl ? (
                                    <div className="relative h-full w-full">
                                        <img
                                            src={previewUrl}
                                            alt={`${label} Preview`}
                                            className="h-full w-full object-contain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPreviewClick?.();
                                            }}
                                        />
                                        {onRemove && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 dark:hover:bg-red-400"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemove();
                                                }}
                                                aria-label="Remove cover image"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-600 dark:text-gray-400">Click to select image</span>
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                            Upload a {label.toLowerCase()} file
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {(error || fileError) && (
                    <p id={`${id}-error`} className="text-center text-sm text-red-500 dark:text-red-400">
                        {error || fileError}
                    </p>
                )}
                {helperText && <p className="text-center text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
            </div>
        )}
    </div>
);

export default function BooksEdit({
                                      book,
                                      categories: initialCategories,
                                      subcategories: initialSubcategories,
                                      shelves: initialShelves,
                                      bookcases: initialBookcases,
                                      grades: initialGrades,
                                      subjects: initialSubjects,
                                      flash,
                                  }: BooksEditProps) {
    const isEbook = book.type === 'ebook';
    const isAudio = book.type === 'audio';
    const [categories] = useState(initialCategories);
    const [subcategories] = useState(initialSubcategories);
    const [shelves] = useState(initialShelves);
    const [bookcases] = useState(initialBookcases);
    const [grades] = useState(initialGrades);
    const [subjects] = useState(initialSubjects);
    const [pdfFileError, setPdfFileError] = useState<string | null>(null);
    const [showErrorAlert, setShowErrorAlert] = useState(!!flash?.error);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        book.published_at ? new Date(book.published_at) : undefined
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        title: book.title,
        description: book.description,
        page_count: book.page_count,
        publisher: book.publisher,
        language: book.language,
        published_at: book.published_at,
        author: book.author,
        flip_link: book.flip_link,
        cover: null as File | null,
        code: book.code || '',
        isbn: book.isbn || '',
        view: book.view || '0',
        is_available: book.is_available,
        pdf_url: null as File | null,
        category_id: book.category_id || '',
        subcategory_id: book.subcategory_id || null,
        shelf_id: book.shelf_id || null,
        bookcase_id: book.bookcase_id || null,
        grade_id: book.grade_id || null,
        subject_id: book.subject_id || null,
        downloadable: book.downloadable,
        type: book.type,
        _method: 'PUT',
    });

    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
        book.cover ? `/storage/${book.cover}` : null
    );
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(
        book.pdf_url ? `/storage/${book.pdf_url}` : null
    );
    const [existingPdfFileName, setExistingPdfFileName] = useState<string | null>(
        book.pdf_url ? book.pdf_url.split('/').pop() || null : null
    );
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        setShowErrorAlert(!!Object.keys(errors).length || !!flash?.error);
    }, [errors, flash?.error]);

    const generateCode = useCallback(() => {
        const category = data.category_id
            ? categories.find((cat) => cat.id.toString() === data.category_id)
            : null;
        const categoryPrefix = category ? category.name.slice(0, 3).toUpperCase() : 'UNK';
        const typePrefix = isEbook ? 'EBK' : isAudio ? 'AUD' : 'PHY';
        const randomSuffix = generateRandomString(4);
        return `${categoryPrefix}-${typePrefix}-${randomSuffix}`.slice(0, 10);
    }, [data.category_id, isEbook, isAudio, categories]);

    useEffect(() => {
        if (data.category_id && !data.code) {
            setData('code', generateCode());
        }
    }, [data.category_id, generateCode, setData]);

    useEffect(() => {
        return () => {
            if (coverPreviewUrl && !coverPreviewUrl.startsWith('/storage/')) {
                URL.revokeObjectURL(coverPreviewUrl);
            }
            if (pdfPreviewUrl && !pdfPreviewUrl.startsWith('/storage/')) {
                URL.revokeObjectURL(pdfPreviewUrl);
            }
        };
    }, [coverPreviewUrl, pdfPreviewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'pdf_url') => {
        const file = e.target.files?.[0];
        if (!file) {
            setData(field, null);
            if (field === 'cover') {
                setCoverPreviewUrl(book.cover ? `/storage/${book.cover}` : null);
            } else {
                setPdfPreviewUrl(book.pdf_url ? `/storage/${book.pdf_url}` : null);
                setExistingPdfFileName(book.pdf_url ? book.pdf_url.split('/').pop() || null : null);
                setPdfFileError(null);
            }
            return;
        }

        if (field === 'cover') {
            if (!file.type.match('image/(jpeg|png)')) {
                setData(field, null);
                e.target.value = '';
                setPdfFileError('Invalid file format. Please upload a JPEG or PNG image.');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setData(field, null);
                e.target.value = '';
                setPdfFileError('Cover image exceeds 2MB limit. Please upload a smaller file.');
                return;
            }
        }
        if (field === 'pdf_url') {
            if (file.type !== 'application/pdf') {
                setData(field, null);
                e.target.value = '';
                setPdfFileError('Invalid file format. Please upload a PDF file.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setData(field, null);
                e.target.value = '';
                setPdfFileError('PDF file exceeds 10MB limit. Please upload a smaller file.');
                return;
            }
            setPdfFileError(null);
            setExistingPdfFileName(null); // Clear existing file name when a new file is selected
        }

        setData(field, file);
        const newUrl = URL.createObjectURL(file);
        if (field === 'cover') {
            if (coverPreviewUrl && !coverPreviewUrl.startsWith('/storage/')) {
                URL.revokeObjectURL(coverPreviewUrl);
            }
            setCoverPreviewUrl(newUrl);
        } else {
            if (pdfPreviewUrl && !pdfPreviewUrl.startsWith('/storage/')) {
                URL.revokeObjectURL(pdfPreviewUrl);
            }
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
            setPdfFileError('Invalid file format. Please drop a PDF file.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setPdfFileError('PDF file exceeds 10MB limit. Please drop a smaller file.');
            return;
        }
        setPdfFileError(null);
        setExistingPdfFileName(null); // Clear existing file name when a new file is dropped
        if (pdfPreviewUrl && !pdfPreviewUrl.startsWith('/storage/')) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }
        setData('pdf_url', file);
        setPdfPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveCover = () => {
        setData('cover', null);
        setCoverPreviewUrl(book.cover ? `/storage/${book.cover}` : null);
        setPdfFileError(null);
    };

    const handleRemovePdf = () => {
        setData('pdf_url', null);
        setPdfPreviewUrl(book.pdf_url ? `/storage/${book.pdf_url}` : null);
        setExistingPdfFileName(book.pdf_url ? book.pdf_url.split('/').pop() || null : null);
        setPdfFileError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAudio) return;

        // Validate required fields
        if (!data.title) {
            setShowErrorAlert(true);
            return setData('title', '');
        }
        if (!data.description) {
            setShowErrorAlert(true);
            return setData('description', '');
        }
        if (!data.page_count || parseInt(data.page_count) < 1) {
            setShowErrorAlert(true);
            return setData('page_count', '');
        }
        if (!data.publisher) {
            setShowErrorAlert(true);
            return setData('publisher', '');
        }
        if (!data.language) {
            setShowErrorAlert(true);
            return setData('language', '');
        }
        if (!data.category_id) {
            setShowErrorAlert(true);
            return setData('category_id', '');
        }
        if (!isEbook && !data.bookcase_id) {
            setShowErrorAlert(true);
            return setData('bookcase_id', '');
        }
        if (!isEbook && !data.shelf_id) {
            setShowErrorAlert(true);
            return setData('shelf_id', '');
        }
        if (isEbook && data.downloadable && !data.pdf_url && !book.pdf_url) {
            setShowErrorAlert(true);
            setPdfFileError('PDF file is required for downloadable e-books.');
            return;
        }

        post(route('books.update', book.id), {
            forceFormData: true,
            onSuccess: () => {
                setShowErrorAlert(false);
                reset();
                setCoverPreviewUrl(book.cover ? `/storage/${book.cover}` : null);
                setPdfPreviewUrl(book.pdf_url ? `/storage/${book.pdf_url}` : null);
                setExistingPdfFileName(book.pdf_url ? book.pdf_url.split('/').pop() || null : null);
                setPdfFileError(null);
                setSelectedDate(book.published_at ? new Date(book.published_at) : undefined);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    return (
        <ErrorBoundary>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Edit ${isEbook ? 'E-Book' : isAudio ? 'Audio Book' : 'Physical Book'}`} />
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-2xl dark:border-indigo-700 dark:from-gray-800 dark:to-blue-900">
                        <h1 className="mb-6 text-2xl font-bold text-indigo-600 dark:text-indigo-300">Edit Book</h1>

                        {showErrorAlert && (Object.keys(errors).length > 0 || flash?.error) && (
                            <Alert className="mb-4 flex items-start justify-between rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 text-gray-800 dark:border-red-700 dark:from-red-900 dark:to-red-800 dark:text-gray-100">
                                <div className="flex gap-2">
                                    <CheckCircle2Icon className="h-4 w-4 text-red-600 dark:text-red-300" />
                                    <div>
                                        <AlertTitle className="text-red-600 dark:text-red-300">Error</AlertTitle>
                                        <AlertDescription className="text-gray-600 dark:text-gray-300">
                                            {flash?.error || Object.values(errors).join(', ')}
                                        </AlertDescription>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowErrorAlert(false)}
                                    className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
                                    disabled={processing}
                                    aria-label="Dismiss error alert"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2" encType="multipart/form-data">
                            <input type="hidden" name="_method" value="PUT" />
                            <input type="hidden" name="type" value={book.type} />

                            {/* Tabs (non-interactive, show only current type) */}
                            <div className="col-span-full">
                                <div className="border-b border-indigo-200 dark:border-indigo-600">
                                    <nav className="flex space-x-8">
                                        {['physical', 'ebook', 'audio (coming soon)'].map((tab) => (
                                            <span
                                                key={tab}
                                                className={`py-2 px-4 text-sm font-medium ${
                                                    tab === book.type
                                                        ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-300'
                                                        : 'text-gray-500 dark:text-gray-400 opacity-50'
                                                } transition-colors duration-200`}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </span>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="col-span-full">
                                <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Basic Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.title
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    required
                                                    maxLength={255}
                                                    disabled={isAudio}
                                                    aria-describedby={errors.title ? 'title-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter the book title
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.title && (
                                        <p id="title-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.title}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Max 255 characters.</p>
                                </div>
                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.description
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    rows={4}
                                                    required
                                                    disabled={isAudio}
                                                    aria-describedby={errors.description ? 'description-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter the book description
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.description && (
                                        <p id="description-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.description}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Brief description of the book.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="page_count" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Page Count <span className="text-red-500">*</span>
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
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.page_count
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    required
                                                    disabled={isAudio}
                                                    aria-describedby={errors.page_count ? 'page_count-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter the number of pages
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.page_count && (
                                        <p id="page_count-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.page_count}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Total number of pages (minimum 1).</p>
                                </div>
                                <div>
                                    <Label htmlFor="publisher" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Publisher <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="publisher"
                                                    value={data.publisher}
                                                    onChange={(e) => setData('publisher', e.target.value)}
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.publisher
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    required
                                                    maxLength={255}
                                                    disabled={isAudio}
                                                    aria-describedby={errors.publisher ? 'publisher-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter the publisher name
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.publisher && (
                                        <p id="publisher-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.publisher}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Max 255 characters.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Language <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.language}
                                                    onValueChange={(value) => setData('language', value)}
                                                    disabled={isAudio}
                                                    required
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-md border p-2 ${
                                                            errors.language
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-indigo-200 dark:border-indigo-600'
                                                        } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.language ? 'language-error' : undefined}
                                                    >
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
                                                        <SelectItem value="kh">Khmer</SelectItem>
                                                        <SelectItem value="en">English</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Select the book language
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.language && (
                                        <p id="language-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.language}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Primary language of the book.</p>
                                </div>
                                <div>
                                    <Label htmlFor="published_at" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Published Date
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={`mt-1 w-full rounded-md border p-2 ${
                                                                errors.published_at
                                                                    ? 'border-red-500 dark:border-red-400'
                                                                    : 'border-indigo-200 dark:border-indigo-600'
                                                            } justify-start bg-white text-left font-normal text-gray-800 dark:bg-gray-700 dark:text-gray-100 ${
                                                                !selectedDate && 'text-gray-500 dark:text-gray-400'
                                                            }`}
                                                            disabled={isAudio}
                                                            aria-describedby={errors.published_at ? 'published_at-error' : undefined}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto border-indigo-200 bg-white p-0 dark:border-indigo-600 dark:bg-gray-700">
                                                        <Calendar
                                                            mode="single"
                                                            selected={selectedDate}
                                                            onSelect={(date) => {
                                                                setSelectedDate(date);
                                                                setData('published_at', date ? format(date, 'yyyy-MM-dd') : '');
                                                            }}
                                                            disabled={isAudio}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Select the publication date
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.published_at && (
                                        <p id="published_at-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.published_at}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional publication date.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="author" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Author
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="author"
                                                    value={data.author}
                                                    onChange={(e) => setData('author', e.target.value)}
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.author
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    maxLength={255}
                                                    disabled={isAudio}
                                                    aria-describedby={errors.author ? 'author-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter the author name
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.author && (
                                        <p id="author-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.author}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional, max 255 characters.</p>
                                </div>
                                <div>
                                    <Label htmlFor="flip_link" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Flip Link
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="flip_link"
                                                    value={data.flip_link}
                                                    onChange={(e) => setData('flip_link', e.target.value)}
                                                    type="url"
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.flip_link
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    maxLength={255}
                                                    disabled={isAudio}
                                                    aria-describedby={errors.flip_link ? 'flip_link-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter the digital preview URL
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.flip_link && (
                                        <p id="flip_link-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.flip_link}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional digital preview link.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Code
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="code"
                                                    value={data.code}
                                                    onChange={(e) => setData('code', e.target.value)}
                                                    maxLength={10}
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.code
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    disabled={isAudio}
                                                    aria-describedby={errors.code ? 'code-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter or edit the book code
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.code && (
                                        <p id="code-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.code}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional, max 10 characters, auto-generated if empty.</p>
                                </div>
                                <div>
                                    <Label htmlFor="isbn" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        ISBN
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="isbn"
                                                    value={data.isbn}
                                                    onChange={(e) => setData('isbn', e.target.value)}
                                                    maxLength={13}
                                                    className={`mt-1 w-full rounded-md border p-2 ${
                                                        errors.isbn
                                                            ? 'border-red-500 dark:border-red-400'
                                                            : 'border-indigo-200 dark:border-indigo-600'
                                                    } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                    disabled={isAudio}
                                                    aria-describedby={errors.isbn ? 'isbn-error' : undefined}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Enter the ISBN
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.isbn && (
                                        <p id="isbn-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.isbn}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional, exactly 13 characters.</p>
                                </div>
                            </div>
                            <div className="col-span-full space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {isEbook ? 'Downloadable' : 'Available'} <span className="text-red-500">*</span>
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
                                                            checked={isEbook ? data.downloadable : data.is_available}
                                                            onChange={() => setData(isEbook ? 'downloadable' : 'is_available', true)}
                                                            className="h-4 w-4 border-indigo-200 bg-gray-100 text-indigo-600 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-gray-700 dark:focus:ring-indigo-400"
                                                            required
                                                            disabled={isAudio}
                                                            aria-describedby={
                                                                errors.is_available || errors.downloadable ? 'availability-error' : undefined
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={isEbook ? 'downloadable-yes' : 'is_available-yes'}
                                                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                                        >
                                                            Yes
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={isEbook ? 'downloadable-no' : 'is_available-no'}
                                                            name={isEbook ? 'downloadable' : 'is_available'}
                                                            checked={isEbook ? !data.downloadable : !data.is_available}
                                                            onChange={() => setData(isEbook ? 'downloadable' : 'is_available', false)}
                                                            className="h-4 w-4 border-indigo-200 bg-gray-100 text-indigo-600 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-gray-700 dark:focus:ring-indigo-400"
                                                            required
                                                            disabled={isAudio}
                                                            aria-describedby={
                                                                errors.is_available || errors.downloadable ? 'availability-error' : undefined
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={isEbook ? 'downloadable-no' : 'is_available-no'}
                                                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                                        >
                                                            No
                                                        </Label>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                {isEbook ? 'Set if the e-book is downloadable' : 'Set book availability'}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {(errors.is_available || errors.downloadable) && (
                                        <p id="availability-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.is_available || errors.downloadable}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {isEbook ? 'Allow users to download the e-book.' : 'Indicate if the book is available.'}
                                    </p>
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="col-span-full">
                                <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Classification</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="category_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.category_id || undefined}
                                                    onValueChange={(value) => setData('category_id', value)}
                                                    required
                                                    disabled={isAudio}
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-md border p-2 ${
                                                            errors.category_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-indigo-200 dark:border-indigo-600'
                                                        } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.category_id ? 'category_id-error' : undefined}
                                                    >
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Select the book category
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.category_id && (
                                        <p id="category_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.category_id}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select a category for the book.</p>
                                </div>
                                <div>
                                    <Label htmlFor="grade_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Grade
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.grade_id || undefined}
                                                    onValueChange={(value) => setData('grade_id', value === 'none' ? null : value)}
                                                    disabled={isAudio}
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-md border p-2 ${
                                                            errors.grade_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-indigo-200 dark:border-indigo-600'
                                                        } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.grade_id ? 'grade_id-error' : undefined}
                                                    >
                                                        <SelectValue placeholder="Select grade" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
                                                        <SelectItem value="none">None</SelectItem>
                                                        {grades.map((grade) => (
                                                            <SelectItem key={grade.id} value={grade.id.toString()}>
                                                                {grade.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Select the book grade (optional)
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.grade_id && (
                                        <p id="grade_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.grade_id}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional grade level for the book.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="subcategory_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Subcategory
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.subcategory_id || undefined}
                                                    onValueChange={(value) => setData('subcategory_id', value === 'none' ? null : value)}
                                                    disabled={isAudio}
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-md border p-2 ${
                                                            errors.subcategory_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-indigo-200 dark:border-indigo-600'
                                                        } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.subcategory_id ? 'subcategory_id-error' : undefined}
                                                    >
                                                        <SelectValue placeholder="Select subcategory" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
                                                        <SelectItem value="none">None</SelectItem>
                                                        {subcategories.map((sub) => (
                                                            <SelectItem key={sub.id} value={sub.id.toString()}>
                                                                {sub.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Select the book subcategory (optional)
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.subcategory_id && (
                                        <p id="subcategory_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.subcategory_id}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional subcategory for the book.</p>
                                </div>
                                <div>
                                    <Label htmlFor="subject_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Subject
                                    </Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Select
                                                    value={data.subject_id || undefined}
                                                    onValueChange={(value) => setData('subject_id', value === 'none' ? null : value)}
                                                    disabled={isAudio}
                                                >
                                                    <SelectTrigger
                                                        className={`mt-1 w-full rounded-md border p-2 ${
                                                            errors.subject_id
                                                                ? 'border-red-500 dark:border-red-400'
                                                                : 'border-indigo-200 dark:border-indigo-600'
                                                        } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                        aria-describedby={errors.subject_id ? 'subject_id-error' : undefined}
                                                    >
                                                        <SelectValue placeholder="Select subject" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
                                                        <SelectItem value="none">None</SelectItem>
                                                        {subjects.map((subject) => (
                                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                                {subject.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                Select the book subject (optional)
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {errors.subject_id && (
                                        <p id="subject_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.subject_id}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional subject for the book.</p>
                                </div>
                            </div>

                            {/* Location (Physical Books Only) */}
                            {!isEbook && !isAudio && (
                                <>
                                    <div className="col-span-full">
                                        <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Location</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="bookcase_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Bookcase <span className="text-red-500">*</span>
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Select
                                                            value={data.bookcase_id || undefined}
                                                            onValueChange={(value) => setData('bookcase_id', value)}
                                                            required
                                                            disabled={isAudio}
                                                        >
                                                            <SelectTrigger
                                                                className={`mt-1 w-full rounded-md border p-2 ${
                                                                    errors.bookcase_id
                                                                        ? 'border-red-500 dark:border-red-400'
                                                                        : 'border-indigo-200 dark:border-indigo-600'
                                                                } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                                aria-describedby={errors.bookcase_id ? 'bookcase_id-error' : undefined}
                                                            >
                                                                <SelectValue placeholder="Select bookcase" />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
                                                                {bookcases.map((bookcase) => (
                                                                    <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
                                                                        {bookcase.code}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                        Select the bookcase
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {errors.bookcase_id && (
                                                <p id="bookcase_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                    {errors.bookcase_id}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select a bookcase for the physical book.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="shelf_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Shelf <span className="text-red-500">*</span>
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Select
                                                            value={data.shelf_id || undefined}
                                                            onValueChange={(value) => setData('shelf_id', value)}
                                                            required
                                                            disabled={isAudio}
                                                        >
                                                            <SelectTrigger
                                                                className={`mt-1 w-full rounded-md border p-2 ${
                                                                    errors.shelf_id
                                                                        ? 'border-red-500 dark:border-red-400'
                                                                        : 'border-indigo-200 dark:border-indigo-600'
                                                                } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
                                                                aria-describedby={errors.shelf_id ? 'shelf_id-error' : undefined}
                                                            >
                                                                <SelectValue placeholder="Select shelf" />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
                                                                {shelves.map((shelf) => (
                                                                    <SelectItem key={shelf.id} value={shelf.id.toString()}>
                                                                        {shelf.code}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                                        Select the shelf
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {errors.shelf_id && (
                                                <p id="shelf_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                    {errors.shelf_id}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select a shelf for the physical book.</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Files */}
                            <div className="col-span-full">
                                <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Files</h2>
                            </div>
                            <div className="space-y-4">
                                <FileField
                                    label="Cover"
                                    id="cover"
                                    accept="image/jpeg,image/png"
                                    onChange={(e) => handleFileChange(e, 'cover')}
                                    previewUrl={coverPreviewUrl}
                                    onPreviewClick={() => setIsCoverModalOpen(true)}
                                    error={errors.cover}
                                    helperText="Optional: JPEG or PNG, max 2MB."
                                    onRemove={handleRemoveCover}
                                />
                            </div>
                            {isEbook && (
                                <div className="space-y-4">
                                    <FileField
                                        label="PDF File"
                                        id="pdf_url"
                                        accept="application/pdf"
                                        onChange={(e) => handleFileChange(e, 'pdf_url')}
                                        previewUrl={pdfPreviewUrl}
                                        onPreviewClick={() => setIsPdfModalOpen(true)}
                                        error={errors.pdf_url}
                                        fileError={pdfFileError}
                                        helperText="Required for downloadable e-books: PDF, max 10MB."
                                        isDragDrop
                                        dragActive={dragActive}
                                        onDrag={handleDrag}
                                        onDrop={handleDrop}
                                        selectedFileName={data.pdf_url?.name || existingPdfFileName}
                                        onRemove={handleRemovePdf}
                                    />
                                </div>
                            )}

                            {/* Submit and Cancel */}
                            <div className="col-span-full mt-6 flex justify-end gap-4">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="submit"
                                                disabled={processing || isAudio}
                                                className="rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                            >
                                                {processing ? 'Updating...' : 'Update Book'}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                            Save the updated book
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('books.index')}>
                                                <Button
                                                    variant="outline"
                                                    className="rounded-lg border-indigo-200 bg-white px-4 py-2 text-indigo-600 transition-colors duration-200 hover:bg-indigo-50 dark:border-indigo-600 dark:bg-gray-700 dark:text-indigo-300 dark:hover:bg-indigo-800"
                                                    disabled={processing}
                                                >
                                                    Cancel
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
                                            Return to the books list
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </form>
                    </div>

                    {/* Cover Preview Dialog */}
                    <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
                        <DialogContent className="max-w-2xl rounded-2xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 dark:border-indigo-700 dark:from-gray-800 dark:to-blue-900 dark:text-gray-100">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">Cover Preview</DialogTitle>
                            </DialogHeader>
                            {coverPreviewUrl ? (
                                <img src={coverPreviewUrl} alt="Cover Preview" className="h-auto max-h-[70vh] w-full rounded object-contain" />
                            ) : (
                                <p className="text-red-500 dark:text-red-400">No cover image available.</p>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* PDF Preview Dialog */}
                    <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                        <DialogContent className="max-w-4xl rounded-2xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 dark:border-indigo-700 dark:from-gray-800 dark:to-blue-900 dark:text-gray-100">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">PDF Preview</DialogTitle>
                            </DialogHeader>
                            {pdfPreviewUrl ? (
                                <Worker workerUrl="/pdf.worker.min.js">
                                    <div className="h-[70vh] w-full overflow-auto">
                                        <Viewer fileUrl={pdfPreviewUrl} plugins={[defaultLayoutPluginInstance]} />
                                    </div>
                                </Worker>
                            ) : (
                                <p className="text-red-500 dark:text-red-400">No PDF file available.</p>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </AppLayout>
        </ErrorBoundary>
    );
}


// 'use client';
//
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, Link, useForm } from '@inertiajs/react';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import { format } from 'date-fns';
// import { CalendarIcon, CheckCircle2Icon, X } from 'lucide-react';
// import { Component, ReactNode, useCallback, useEffect, useState } from 'react';
//
// // Interfaces (unchanged)
// interface Category {
//     id: number;
//     name: string;
// }
// interface Subcategory {
//     id: number;
//     name: string;
// }
// interface Shelf {
//     id: number;
//     code: string;
// }
// interface Bookcase {
//     id: number;
//     code: string;
// }
// interface Grade {
//     id: number;
//     name: string;
// }
// interface Subject {
//     id: number;
//     name: string;
// }
// interface BooksEditProps {
//     book: {
//         id: number;
//         title: string;
//         description: string;
//         page_count: string;
//         publisher: string;
//         language: string;
//         published_at: string;
//         author: string;
//         flip_link: string;
//         code: string;
//         isbn: string;
//         view: string;
//         is_available: boolean;
//         pdf_url?: string;
//         cover?: string;
//         category_id: string | null;
//         subcategory_id: string | null;
//         shelf_id: string | null;
//         bookcase_id: string | null;
//         grade_id: string | null;
//         subject_id: string | null;
//         downloadable: boolean;
//         type: 'physical' | 'ebook' | 'audio';
//     };
//     categories: Category[];
//     subcategories: Subcategory[];
//     shelves: Shelf[];
//     bookcases: Bookcase[];
//     grades: Grade[];
//     subjects: Subject[];
//     flash?: { message: string | null; error: string | null };
// }
// interface FileFieldProps {
//     label: string;
//     id: string;
//     accept: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     previewUrl?: string | null;
//     onPreviewClick?: () => void;
//     error?: string;
//     helperText?: string;
//     isDragDrop?: boolean;
//     dragActive?: boolean;
//     onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
//     selectedFileName?: string;
//     onRemove?: () => void;
//     fileError?: string;
// }
//
// // Breadcrumbs (unchanged)
// const breadcrumbs: BreadcrumbItem[] = [
//     { title: 'Books', href: route('books.index') },
//     { title: 'Edit', href: '' },
// ];
//
// // Generate random string for code (unchanged)
// const generateRandomString = (length: number): string => {
//     const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// };
//
// // ErrorBoundary (unchanged)
// interface ErrorBoundaryProps {
//     children: ReactNode;
// }
// interface ErrorBoundaryState {
//     hasError: boolean;
// }
// class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
//     constructor(props: ErrorBoundaryProps) {
//         super(props);
//         this.state = { hasError: false };
//     }
//     static getDerivedStateFromError(_: Error): ErrorBoundaryState {
//         return { hasError: true };
//     }
//     render() {
//         if (this.state.hasError) {
//             return (
//                 <div className="p-4 sm:p-6 lg:p-8">
//                     <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-2xl dark:border-red-700 dark:from-red-900 dark:to-red-800">
//                         <h2 className="text-xl font-semibold text-red-600 dark:text-red-300">Something went wrong</h2>
//                         <p className="mt-2 text-gray-600 dark:text-gray-300">
//                             An error occurred while updating the book. Please try again or contact support.
//                         </p>
//                         <Button
//                             onClick={() => window.location.reload()}
//                             className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
//                         >
//                             Try Again
//                         </Button>
//                     </div>
//                 </div>
//             );
//         }
//         return this.props.children;
//     }
// }
//
// // FileField Component (Updated)
// const FileField: React.FC<FileFieldProps> = ({
//                                                  label,
//                                                  id,
//                                                  accept,
//                                                  onChange,
//                                                  previewUrl,
//                                                  onPreviewClick,
//                                                  error,
//                                                  helperText,
//                                                  isDragDrop = false,
//                                                  dragActive = false,
//                                                  onDrag,
//                                                  onDrop,
//                                                  selectedFileName,
//                                                  onRemove,
//                                                  fileError,
//                                              }) => (
//     <div className="space-y-2">
//         <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {label} {isDragDrop && <span className="text-red-500">*</span>}
//         </Label>
//         {isDragDrop ? (
//             <TooltipProvider>
//                 <Tooltip>
//                     <TooltipTrigger asChild>
//                         <div
//                             className={`border-2 border-dashed ${
//                                 dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-indigo-200 dark:border-indigo-600'
//                             } rounded-md p-4 text-center transition-all duration-200 ${
//                                 error || fileError ? 'border-red-500 dark:border-red-400' : ''
//                             } mx-auto h-64 w-full max-w-md`}
//                             onDragEnter={onDrag}
//                             onDragLeave={onDrag}
//                             onDragOver={onDrag}
//                             onDrop={onDrop}
//                             role="region"
//                             aria-label={`Drag and drop ${label.toLowerCase()} file`}
//                         >
//                             <Input
//                                 id={id}
//                                 type="file"
//                                 accept={accept}
//                                 onChange={onChange}
//                                 className="hidden"
//                                 aria-describedby={error || fileError ? `${id}-error` : undefined}
//                             />
//                             <div className="flex h-full flex-col justify-center space-y-2">
//                                 {selectedFileName ? (
//                                     <p className="text-sm text-gray-700 dark:text-gray-300">
//                                         Selected: {selectedFileName}{' '}
//                                         {onRemove && (
//                                             <Button
//                                                 variant="link"
//                                                 onClick={onRemove}
//                                                 className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
//                                                 aria-label={`Remove ${selectedFileName}`}
//                                             >
//                                                 Remove
//                                             </Button>
//                                         )}
//                                         {onPreviewClick && (
//                                             <Button
//                                                 variant="link"
//                                                 onClick={onPreviewClick}
//                                                 className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
//                                                 aria-label={`Preview ${selectedFileName}`}
//                                             >
//                                                 Preview
//                                             </Button>
//                                         )}
//                                     </p>
//                                 ) : (
//                                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                                         Drag and drop a {label.toLowerCase()} file here, or click to browse.
//                                     </p>
//                                 )}
//                                 <Button
//                                     type="button"
//                                     onClick={() => document.getElementById(id)?.click()}
//                                     className="rounded-md bg-indigo-500 px-3 py-1 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
//                                     aria-label="Browse files"
//                                 >
//                                     Browse
//                                 </Button>
//                             </div>
//                         </div>
//                     </TooltipTrigger>
//                     <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                         Upload a {label.toLowerCase()} file
//                     </TooltipContent>
//                 </Tooltip>
//                 {(error || fileError) && (
//                     <p id={`${id}-error`} className="text-center text-sm text-red-500 dark:text-red-400">
//                         {error || fileError}
//                     </p>
//                 )}
//                 {helperText && <p className="text-center text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
//             </TooltipProvider>
//         ) : (
//             <div className="space-y-2">
//                 <TooltipProvider>
//                     <Tooltip>
//                         <TooltipTrigger asChild>
//                             <div
//                                 className={`relative mx-auto h-64 w-full max-w-md border bg-white dark:bg-gray-700 ${
//                                     error || fileError ? 'border-red-500 dark:border-red-400' : 'border-indigo-200 dark:border-indigo-600'
//                                 } flex cursor-pointer items-center justify-center overflow-hidden rounded-md`}
//                                 onClick={() => document.getElementById(id)?.click()}
//                                 role="button"
//                                 tabIndex={0}
//                                 onKeyDown={(e) => {
//                                     if (e.key === 'Enter' || e.key === ' ') {
//                                         document.getElementById(id)?.click();
//                                     }
//                                 }}
//                             >
//                                 <Input
//                                     id={id}
//                                     type="file"
//                                     accept={accept}
//                                     onChange={onChange}
//                                     className="hidden"
//                                     aria-describedby={error || fileError ? `${id}-error` : undefined}
//                                 />
//                                 {previewUrl ? (
//                                     <div className="relative h-full w-full">
//                                         <img
//                                             src={previewUrl}
//                                             alt={`${label} Preview`}
//                                             className="h-full w-full object-contain"
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 onPreviewClick?.();
//                                             }}
//                                         />
//                                         {onRemove && (
//                                             <Button
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 dark:hover:bg-red-400"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     onRemove();
//                                                 }}
//                                                 aria-label="Remove cover image"
//                                             >
//                                                 <X className="h-4 w-4" />
//                                             </Button>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <span className="text-gray-600 dark:text-gray-400">Click to select image</span>
//                                 )}
//                             </div>
//                         </TooltipTrigger>
//                         <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                             Upload a {label.toLowerCase()} file
//                         </TooltipContent>
//                     </Tooltip>
//                 </TooltipProvider>
//                 {(error || fileError) && (
//                     <p id={`${id}-error`} className="text-center text-sm text-red-500 dark:text-red-400">
//                         {error || fileError}
//                     </p>
//                 )}
//                 {helperText && <p className="text-center text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
//             </div>
//         )}
//     </div>
// );
//
// export default function BooksEdit({
//                                       book,
//                                       categories: initialCategories,
//                                       subcategories: initialSubcategories,
//                                       shelves: initialShelves,
//                                       bookcases: initialBookcases,
//                                       grades: initialGrades,
//                                       subjects: initialSubjects,
//                                       flash,
//                                   }: BooksEditProps) {
//     const isEbook = book.type === 'ebook';
//     const isAudio = book.type === 'audio';
//     const [categories] = useState(initialCategories);
//     const [subcategories] = useState(initialSubcategories);
//     const [shelves] = useState(initialShelves);
//     const [bookcases] = useState(initialBookcases);
//     const [grades] = useState(initialGrades);
//     const [subjects] = useState(initialSubjects);
//     const [pdfFileError, setPdfFileError] = useState<string | null>(null);
//     const [showErrorAlert, setShowErrorAlert] = useState(!!flash?.error);
//     const [selectedDate, setSelectedDate] = useState<Date | undefined>(book.published_at ? new Date(book.published_at) : undefined);
//
//     const { data, setData, post, processing, errors, reset } = useForm({
//         title: book.title,
//         description: book.description,
//         page_count: book.page_count,
//         publisher: book.publisher,
//         language: book.language,
//         published_at: book.published_at,
//         author: book.author,
//         flip_link: book.flip_link,
//         cover: null as File | null,
//         code: book.code || '',
//         isbn: book.isbn || '',
//         view: book.view,
//         is_available: book.is_available,
//         pdf_url: null as File | null,
//         category_id: book.category_id || null,
//         subcategory_id: book.subcategory_id || null,
//         shelf_id: book.shelf_id || null,
//         bookcase_id: book.bookcase_id || null,
//         grade_id: book.grade_id || null,
//         subject_id: book.subject_id || null,
//         downloadable: book.downloadable,
//         type: book.type,
//         _method: 'PUT',
//     });
//
//     const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
//         book.cover? `/storage/${book.cover}` : null
//     );
//     const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(
//         book.pdf_url? `/storage/${book.pdf_url}` : null
//     );
//     const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
//     const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
//     const [dragActive, setDragActive] = useState(false);
//     const defaultLayoutPluginInstance = defaultLayoutPlugin();
//
//     useEffect(() => {
//         setShowErrorAlert(!!Object.keys(errors).length || !!flash?.error);
//     }, [errors, flash?.error]);
//
//     const generateCode = useCallback(() => {
//         const category = data.category_id ? categories.find((cat) => cat.id.toString() === data.category_id) : null;
//         const categoryPrefix = category ? category.name.slice(0, 3).toUpperCase() : 'UNK';
//         const typePrefix = isEbook ? 'EBK' : isAudio ? 'AUD' : 'PHY';
//         const randomSuffix = generateRandomString(4);
//         return `${categoryPrefix}-${typePrefix}-${randomSuffix}`.slice(0, 10);
//     }, [data.category_id, isEbook, isAudio, categories]);
//
//     useEffect(() => {
//         if (data.category_id && !data.code) {
//             setData('code', generateCode());
//         }
//     }, [data.category_id, generateCode]);
//
//     useEffect(() => {
//         return () => {
//             if (coverPreviewUrl && !coverPreviewUrl.startsWith('/storage/')) URL.revokeObjectURL(coverPreviewUrl);
//             if (pdfPreviewUrl && !pdfPreviewUrl.startsWith('/storage/')) URL.revokeObjectURL(pdfPreviewUrl);
//         };
//     }, [coverPreviewUrl, pdfPreviewUrl]);
//
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'pdf_url') => {
//         const file = e.target.files?.[0];
//         if (!file) {
//             setData(field, null);
//             if (field === 'cover') {
//                 setCoverPreviewUrl(book.cover? `/storage/${book.cover}` : null);
//             } else {
//                 setPdfPreviewUrl(book.pdf_url? `/storage/${book.pdf_url}` : null);
//                 setPdfFileError(null);
//             }
//             return;
//         }
//
//         if (field === 'cover') {
//             if (!file.type.match('image/(jpeg|png)')) {
//                 setData(field, null);
//                 e.target.value = '';
//                 setPdfFileError('Invalid file format. Please upload a JPEG or PNG image.');
//                 return;
//             }
//             if (file.size > 2 * 1024 * 1024) {
//                 setData(field, null);
//                 e.target.value = '';
//                 setPdfFileError('Cover image exceeds 2MB limit. Please upload a smaller file.');
//                 return;
//             }
//         }
//         if (field === 'pdf_url') {
//             if (file.type !== 'application/pdf') {
//                 setData(field, null);
//                 e.target.value = '';
//                 setPdfFileError('Invalid file format. Please upload a PDF file.');
//                 return;
//             }
//             if (file.size > 10 * 1024 * 1024) {
//                 setData(field, null);
//                 e.target.value = '';
//                 setPdfFileError('PDF file exceeds 10MB limit. Please upload a smaller file.');
//                 return;
//             }
//             setPdfFileError(null);
//         }
//
//         setData(field, file);
//         const newUrl = URL.createObjectURL(file);
//         if (field === 'cover') {
//             if (coverPreviewUrl && !coverPreviewUrl.startsWith('/storage/')) URL.revokeObjectURL(coverPreviewUrl);
//             setCoverPreviewUrl(newUrl);
//         } else {
//             if (pdfPreviewUrl && !pdfPreviewUrl.startsWith('/storage/')) URL.revokeObjectURL(pdfPreviewUrl);
//             setPdfPreviewUrl(newUrl);
//         }
//     };
//
//     const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (e.type === 'dragenter' || e.type === 'dragover') {
//             setDragActive(true);
//         } else if (e.type === 'dragleave') {
//             setDragActive(false);
//         }
//     };
//
//     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);
//         const file = e.dataTransfer.files?.[0];
//         if (!file) {
//             setPdfFileError('No file was dropped. Please try again.');
//             return;
//         }
//         if (file.type !== 'application/pdf') {
//             setPdfFileError('Invalid file format. Please drop a PDF file.');
//             return;
//         }
//         if (file.size > 10 * 1024 * 1024) {
//             setPdfFileError('PDF file exceeds 10MB limit. Please drop a smaller file.');
//             return;
//         }
//         setPdfFileError(null);
//         if (pdfPreviewUrl && !pdfPreviewUrl.startsWith('/storage/')) URL.revokeObjectURL(pdfPreviewUrl);
//         setData('pdf_url', file);
//         setPdfPreviewUrl(URL.createObjectURL(file));
//     };
//
//     const handleRemoveCover = () => {
//         setData('cover', null);
//         setCoverPreviewUrl(book.cover? `/storage/${book.cover}` : null);
//         setPdfFileError(null);
//     };
//
//     const handleRemovePdf = () => {
//         setData('pdf_url', null);
//         setPdfPreviewUrl(book.pdf_url? `/storage/${book.pdf_url}` : null);
//         setPdfFileError(null);
//     };
//
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (isAudio) return;
//         post(route('books.update', book.id), {
//             forceFormData: true,
//             onSuccess: () => {
//                 setShowErrorAlert(false);
//                 reset();
//                 setCoverPreviewUrl(book.cover ? `/storage/${book.cover}` : null);
//                 setPdfPreviewUrl(book.pdf_url? `/storage/${book.pdf_url}` : null);
//                 setPdfFileError(null);
//                 setSelectedDate(book.published_at ? new Date(book.published_at) : undefined);
//             },
//             onError: () => setShowErrorAlert(true),
//         });
//     };
//
//     return (
//         <ErrorBoundary>
//             <AppLayout breadcrumbs={breadcrumbs}>
//                 <Head title={`Edit ${isEbook ? 'E-Book' : isAudio ? 'Audio Book' : 'Physical Book'}`} />
//                 <div className="p-4 sm:p-6 lg:p-8">
//                     <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-2xl dark:border-indigo-700 dark:from-gray-800 dark:to-blue-900">
//                         <h1 className="mb-6 text-2xl font-bold text-indigo-600 dark:text-indigo-300">Edit Book</h1>
//
//                         {showErrorAlert && (Object.keys(errors).length > 0 || flash?.error) && (
//                             <Alert className="mb-4 flex items-start justify-between rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 text-gray-800 dark:border-red-700 dark:from-red-900 dark:to-red-800 dark:text-gray-100">
//                                 <div className="flex gap-2">
//                                     <CheckCircle2Icon className="h-4 w-4 text-red-600 dark:text-red-300" />
//                                     <div>
//                                         <AlertTitle className="text-red-600 dark:text-red-300">Error</AlertTitle>
//                                         <AlertDescription className="text-gray-600 dark:text-gray-300">
//                                             {flash?.error || Object.values(errors).join(', ')}
//                                         </AlertDescription>
//                                     </div>
//                                 </div>
//                                 <Button
//                                     onClick={() => setShowErrorAlert(false)}
//                                     className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
//                                     disabled={processing}
//                                     aria-label="Dismiss error alert"
//                                 >
//                                     <X className="h-4 w-4" />
//                                 </Button>
//                             </Alert>
//                         )}
//
//                         <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2" encType="multipart/form-data">
//                             <input type="hidden" name="_method" value="PUT" />
//                             <input type="hidden" name="type" value={book.type} />
//
//                             {/* Tabs (non-interactive, show only current type) */}
//                             <div className="col-span-full">
//                                 <div className="border-b border-indigo-200 dark:border-indigo-600">
//                                     <nav className="flex space-x-8">
//                                         {['physical', 'ebook', 'audio (coming soon)'].map((tab) => (
//                                             <span
//                                                 key={tab}
//                                                 className={`py-2 px-4 text-sm font-medium ${
//                                                     tab === book.type
//                                                         ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-300'
//                                                         : 'text-gray-500 dark:text-gray-400 opacity-50'
//                                                 } transition-colors duration-200`}
//                                             >
//                                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                             </span>
//                                         ))}
//                                     </nav>
//                                 </div>
//                             </div>
//
//                             {/* Basic Information */}
//                             <div className="col-span-full">
//                                 <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Basic Information</h2>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Title <span className="text-red-500">*</span>
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Input
//                                                     id="title"
//                                                     value={data.title}
//                                                     onChange={(e) => setData('title', e.target.value)}
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.title
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     required
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.title ? 'title-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter the book title
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.title && (
//                                         <p id="title-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.title}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Max 255 characters.</p>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Description <span className="text-red-500">*</span>
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <textarea
//                                                     id="description"
//                                                     value={data.description}
//                                                     onChange={(e) => setData('description', e.target.value)}
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.description
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     rows={4}
//                                                     required
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.description ? 'description-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter the book description
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.description && (
//                                         <p id="description-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.description}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Brief description of the book.</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="page_count" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Page Count <span className="text-red-500">*</span>
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Input
//                                                     id="page_count"
//                                                     type="number"
//                                                     value={data.page_count}
//                                                     onChange={(e) => setData('page_count', e.target.value)}
//                                                     min="1"
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.page_count
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     required
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.page_count ? 'page_count-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter the number of pages
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.page_count && (
//                                         <p id="page_count-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.page_count}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Total number of pages.</p>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="publisher" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Publisher <span className="text-red-500">*</span>
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Input
//                                                     id="publisher"
//                                                     value={data.publisher}
//                                                     onChange={(e) => setData('publisher', e.target.value)}
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.publisher
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     required
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.publisher ? 'publisher-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter the publisher name
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.publisher && (
//                                         <p id="publisher-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.publisher}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Max 255 characters.</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Language <span className="text-red-500">*</span>
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Select
//                                                     value={data.language}
//                                                     onValueChange={(value) => setData('language', value)}
//                                                     disabled={isAudio}
//                                                     required
//                                                 >
//                                                     <SelectTrigger
//                                                         className={`mt-1 w-full rounded-md border p-2 ${
//                                                             errors.language
//                                                                 ? 'border-red-500 dark:border-red-400'
//                                                                 : 'border-indigo-200 dark:border-indigo-600'
//                                                         } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                         aria-describedby={errors.language ? 'language-error' : undefined}
//                                                     >
//                                                         <SelectValue placeholder="Select language" />
//                                                     </SelectTrigger>
//                                                     <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
//                                                         <SelectItem value="kh">Khmer</SelectItem>
//                                                         <SelectItem value="en">English</SelectItem>
//                                                     </SelectContent>
//                                                 </Select>
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Select the book language
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.language && (
//                                         <p id="language-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.language}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Primary language of the book.</p>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="published_at" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Published Date
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Popover>
//                                                     <PopoverTrigger asChild>
//                                                         <Button
//                                                             variant="outline"
//                                                             className={`mt-1 w-full rounded-md border p-2 ${
//                                                                 errors.published_at
//                                                                     ? 'border-red-500 dark:border-red-400'
//                                                                     : 'border-indigo-200 dark:border-indigo-600'
//                                                             } justify-start bg-white text-left font-normal text-gray-800 dark:bg-gray-700 dark:text-gray-100 ${
//                                                                 !selectedDate && 'text-gray-500 dark:text-gray-400'
//                                                             }`}
//                                                             disabled={isAudio}
//                                                             aria-describedby={errors.published_at ? 'published_at-error' : undefined}
//                                                         >
//                                                             <CalendarIcon className="mr-2 h-4 w-4" />
//                                                             {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
//                                                         </Button>
//                                                     </PopoverTrigger>
//                                                     <PopoverContent className="w-auto border-indigo-200 bg-white p-0 dark:border-indigo-600 dark:bg-gray-700">
//                                                         <Calendar
//                                                             mode="single"
//                                                             selected={selectedDate}
//                                                             onSelect={(date) => {
//                                                                 setSelectedDate(date);
//                                                                 setData('published_at', date ? format(date, 'yyyy-MM-dd') : '');
//                                                             }}
//                                                             disabled={isAudio}
//                                                             initialFocus
//                                                         />
//                                                     </PopoverContent>
//                                                 </Popover>
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Select the publication date
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.published_at && (
//                                         <p id="published_at-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.published_at}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional publication date.</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="author" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Author
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Input
//                                                     id="author"
//                                                     value={data.author}
//                                                     onChange={(e) => setData('author', e.target.value)}
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.author
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.author ? 'author-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter the author name
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.author && (
//                                         <p id="author-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.author}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional, max 255 characters.</p>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="flip_link" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Flip Link
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Input
//                                                     id="flip_link"
//                                                     value={data.flip_link}
//                                                     onChange={(e) => setData('flip_link', e.target.value)}
//                                                     type="url"
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.flip_link
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.flip_link ? 'flip_link-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter the digital preview URL
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.flip_link && (
//                                         <p id="flip_link-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.flip_link}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional digital preview link.</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Code
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Input
//                                                     id="code"
//                                                     value={data.code}
//                                                     onChange={(e) => setData('code', e.target.value)}
//                                                     maxLength={10}
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.code
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.code ? 'code-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter or edit the book code
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.code && (
//                                         <p id="code-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.code}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional, max 10 characters, auto-generated if empty.</p>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="isbn" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         ISBN
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Input
//                                                     id="isbn"
//                                                     value={data.isbn}
//                                                     onChange={(e) => setData('isbn', e.target.value)}
//                                                     maxLength={13}
//                                                     className={`mt-1 w-full rounded-md border p-2 ${
//                                                         errors.isbn
//                                                             ? 'border-red-500 dark:border-red-400'
//                                                             : 'border-indigo-200 dark:border-indigo-600'
//                                                     } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                     disabled={isAudio}
//                                                     aria-describedby={errors.isbn ? 'isbn-error' : undefined}
//                                                 />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Enter the ISBN
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.isbn && (
//                                         <p id="isbn-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.isbn}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional, 13 characters.</p>
//                                 </div>
//                             </div>
//                             <div className="col-span-full space-y-4">
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         {isEbook ? 'Downloadable' : 'Available'} {isEbook ? <span className="text-red-500">*</span> : null}
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <div className="mt-1 flex items-center space-x-6">
//                                                     <div className="flex items-center">
//                                                         <input
//                                                             type="radio"
//                                                             id={isEbook ? 'downloadable-yes' : 'is_available-yes'}
//                                                             name={isEbook ? 'downloadable' : 'is_available'}
//                                                             checked={isEbook ? data.downloadable : data.is_available}
//                                                             onChange={() => setData(isEbook ? 'downloadable' : 'is_available', true)}
//                                                             className="h-4 w-4 border-indigo-200 bg-gray-100 text-indigo-600 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-gray-700 dark:focus:ring-indigo-400"
//                                                             required={!isEbook}
//                                                             disabled={isAudio}
//                                                             aria-describedby={
//                                                                 errors.is_available || errors.downloadable ? 'availability-error' : undefined
//                                                             }
//                                                         />
//                                                         <Label
//                                                             htmlFor={isEbook ? 'downloadable-yes' : 'is_available-yes'}
//                                                             className="ml-2 text-sm text-gray-700 dark:text-gray-300"
//                                                         >
//                                                             Yes
//                                                         </Label>
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <input
//                                                             type="radio"
//                                                             id={isEbook ? 'downloadable-no' : 'is_available-no'}
//                                                             name={isEbook ? 'downloadable' : 'is_available'}
//                                                             checked={isEbook ? !data.downloadable : !data.is_available}
//                                                             onChange={() => setData(isEbook ? 'downloadable' : 'is_available', false)}
//                                                             className="h-4 w-4 border-indigo-200 bg-gray-100 text-indigo-600 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-gray-700 dark:focus:ring-indigo-400"
//                                                             disabled={isAudio}
//                                                             aria-describedby={
//                                                                 errors.is_available || errors.downloadable ? 'availability-error' : undefined
//                                                             }
//                                                         />
//                                                         <Label
//                                                             htmlFor={isEbook ? 'downloadable-no' : 'is_available-no'}
//                                                             className="ml-2 text-sm text-gray-700 dark:text-gray-300"
//                                                         >
//                                                             No
//                                                         </Label>
//                                                     </div>
//                                                 </div>
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 {isEbook ? 'Set if the e-book is downloadable' : 'Set book availability'}
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {(errors.is_available || errors.downloadable) && (
//                                         <p id="availability-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.is_available || errors.downloadable}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                                         {isEbook ? 'Allow users to download the e-book.' : 'Indicate if the book is available.'}
//                                     </p>
//                                 </div>
//                             </div>
//
//                             {/* Classification */}
//                             <div className="col-span-full">
//                                 <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Classification</h2>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="category_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Category <span className="text-red-500">*</span>
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Select
//                                                     value={data.category_id || undefined}
//                                                     onValueChange={(value) => setData('category_id', value)}
//                                                     required
//                                                     disabled={isAudio}
//                                                 >
//                                                     <SelectTrigger
//                                                         className={`mt-1 w-full rounded-md border p-2 ${
//                                                             errors.category_id
//                                                                 ? 'border-red-500 dark:border-red-400'
//                                                                 : 'border-indigo-200 dark:border-indigo-600'
//                                                         } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                         aria-describedby={errors.category_id ? 'category_id-error' : undefined}
//                                                     >
//                                                         <SelectValue placeholder="Select category" />
//                                                     </SelectTrigger>
//                                                     <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
//                                                         {categories.map((cat) => (
//                                                             <SelectItem key={cat.id} value={cat.id.toString()}>
//                                                                 {cat.name}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Select the book category
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.category_id && (
//                                         <p id="category_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.category_id}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select a category for the book.</p>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="grade_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Grade
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Select
//                                                     value={data.grade_id || undefined}
//                                                     onValueChange={(value) => setData('grade_id', value === 'none' ? null : value)}
//                                                     disabled={isAudio}
//                                                 >
//                                                     <SelectTrigger
//                                                         className={`mt-1 w-full rounded-md border p-2 ${
//                                                             errors.grade_id
//                                                                 ? 'border-red-500 dark:border-red-400'
//                                                                 : 'border-indigo-200 dark:border-indigo-600'
//                                                         } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                         aria-describedby={errors.grade_id ? 'grade_id-error' : undefined}
//                                                     >
//                                                         <SelectValue placeholder="Select grade" />
//                                                     </SelectTrigger>
//                                                     <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
//                                                         <SelectItem value="none">None</SelectItem>
//                                                         {grades.map((grade) => (
//                                                             <SelectItem key={grade.id} value={grade.id.toString()}>
//                                                                 {grade.name}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Select the book grade (optional)
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.grade_id && (
//                                         <p id="grade_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.grade_id}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional grade level for the book.</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="subcategory_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Subcategory
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Select
//                                                     value={data.subcategory_id || undefined}
//                                                     onValueChange={(value) => setData('subcategory_id', value === 'none' ? null : value)}
//                                                     disabled={isAudio}
//                                                 >
//                                                     <SelectTrigger
//                                                         className={`mt-1 w-full rounded-md border p-2 ${
//                                                             errors.subcategory_id
//                                                                 ? 'border-red-500 dark:border-red-400'
//                                                                 : 'border-indigo-200 dark:border-indigo-600'
//                                                         } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                         aria-describedby={errors.subcategory_id ? 'subcategory_id-error' : undefined}
//                                                     >
//                                                         <SelectValue placeholder="Select subcategory" />
//                                                     </SelectTrigger>
//                                                     <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
//                                                         <SelectItem value="none">None</SelectItem>
//                                                         {subcategories.map((sub) => (
//                                                             <SelectItem key={sub.id} value={sub.id.toString()}>
//                                                                 {sub.name}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Select the book subcategory (optional)
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.subcategory_id && (
//                                         <p id="subcategory_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.subcategory_id}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional subcategory for the book.</p>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="subject_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Subject
//                                     </Label>
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Select
//                                                     value={data.subject_id || undefined}
//                                                     onValueChange={(value) => setData('subject_id', value === 'none' ? null : value)}
//                                                     disabled={isAudio}
//                                                 >
//                                                     <SelectTrigger
//                                                         className={`mt-1 w-full rounded-md border p-2 ${
//                                                             errors.subject_id
//                                                                 ? 'border-red-500 dark:border-red-400'
//                                                                 : 'border-indigo-200 dark:border-indigo-600'
//                                                         } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                         aria-describedby={errors.subject_id ? 'subject_id-error' : undefined}
//                                                     >
//                                                         <SelectValue placeholder="Select subject" />
//                                                     </SelectTrigger>
//                                                     <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
//                                                         <SelectItem value="none">None</SelectItem>
//                                                         {subjects.map((subject) => (
//                                                             <SelectItem key={subject.id} value={subject.id.toString()}>
//                                                                 {subject.name}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </TooltipTrigger>
//                                             <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                 Select the book subject (optional)
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                     {errors.subject_id && (
//                                         <p id="subject_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                             {errors.subject_id}
//                                         </p>
//                                     )}
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional subject for the book.</p>
//                                 </div>
//                             </div>
//
//                             {/* Location (Physical Books Only) */}
//                             {!isEbook && !isAudio && (
//                                 <>
//                                     <div className="col-span-full">
//                                         <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Location</h2>
//                                     </div>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <Label htmlFor="bookcase_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                                 Bookcase <span className="text-red-500">*</span>
//                                             </Label>
//                                             <TooltipProvider>
//                                                 <Tooltip>
//                                                     <TooltipTrigger asChild>
//                                                         <Select
//                                                             value={data.bookcase_id || undefined}
//                                                             onValueChange={(value) => setData('bookcase_id', value)}
//                                                             required
//                                                             disabled={isAudio}
//                                                         >
//                                                             <SelectTrigger
//                                                                 className={`mt-1 w-full rounded-md border p-2 ${
//                                                                     errors.bookcase_id
//                                                                         ? 'border-red-500 dark:border-red-400'
//                                                                         : 'border-indigo-200 dark:border-indigo-600'
//                                                                 } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                                 aria-describedby={errors.bookcase_id ? 'bookcase_id-error' : undefined}
//                                                             >
//                                                                 <SelectValue placeholder="Select bookcase" />
//                                                             </SelectTrigger>
//                                                             <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
//                                                                 {bookcases.map((bookcase) => (
//                                                                     <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
//                                                                         {bookcase.code}
//                                                                     </SelectItem>
//                                                                 ))}
//                                                             </SelectContent>
//                                                         </Select>
//                                                     </TooltipTrigger>
//                                                     <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                         Select the bookcase
//                                                     </TooltipContent>
//                                                 </Tooltip>
//                                             </TooltipProvider>
//                                             {errors.bookcase_id && (
//                                                 <p id="bookcase_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                                     {errors.bookcase_id}
//                                                 </p>
//                                             )}
//                                             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select a bookcase for the physical book.</p>
//                                         </div>
//                                     </div>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <Label htmlFor="shelf_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                                 Shelf <span className="text-red-500">*</span>
//                                             </Label>
//                                             <TooltipProvider>
//                                                 <Tooltip>
//                                                     <TooltipTrigger asChild>
//                                                         <Select
//                                                             value={data.shelf_id || undefined}
//                                                             onValueChange={(value) => setData('shelf_id', value)}
//                                                             required
//                                                             disabled={isAudio}
//                                                         >
//                                                             <SelectTrigger
//                                                                 className={`mt-1 w-full rounded-md border p-2 ${
//                                                                     errors.shelf_id
//                                                                         ? 'border-red-500 dark:border-red-400'
//                                                                         : 'border-indigo-200 dark:border-indigo-600'
//                                                                 } bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400`}
//                                                                 aria-describedby={errors.shelf_id ? 'shelf_id-error' : undefined}
//                                                             >
//                                                                 <SelectValue placeholder="Select shelf" />
//                                                             </SelectTrigger>
//                                                             <SelectContent className="border-indigo-200 bg-white dark:border-indigo-600 dark:bg-gray-700">
//                                                                 {shelves.map((shelf) => (
//                                                                     <SelectItem key={shelf.id} value={shelf.id.toString()}>
//                                                                         {shelf.code}
//                                                                     </SelectItem>
//                                                                 ))}
//                                                             </SelectContent>
//                                                         </Select>
//                                                     </TooltipTrigger>
//                                                     <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                                         Select the shelf
//                                                     </TooltipContent>
//                                                 </Tooltip>
//                                             </TooltipProvider>
//                                             {errors.shelf_id && (
//                                                 <p id="shelf_id-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
//                                                     {errors.shelf_id}
//                                                 </p>
//                                             )}
//                                             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select a shelf for the physical book.</p>
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//
//                             {/* Files */}
//                             <div className="col-span-full">
//                                 <h2 className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">Files</h2>
//                             </div>
//                             <div className="space-y-4">
//                                 <FileField
//                                     label="Cover"
//                                     id="cover"
//                                     accept="image/jpeg,image/png"
//                                     onChange={(e) => handleFileChange(e, 'cover')}
//                                     previewUrl={coverPreviewUrl}
//                                     onPreviewClick={() => setIsCoverModalOpen(true)}
//                                     error={errors.cover}
//                                     helperText="Optional: JPEG or PNG, max 2MB."
//                                     onRemove={handleRemoveCover}
//                                 />
//                             </div>
//                             {isEbook && (
//                                 <div className="space-y-4">
//                                     <FileField
//                                         label="PDF File"
//                                         id="pdf_url"
//                                         accept="application/pdf"
//                                         onChange={(e) => handleFileChange(e, 'pdf_url')}
//                                         previewUrl={pdfPreviewUrl}
//                                         onPreviewClick={() => setIsPdfModalOpen(true)}
//                                         error={errors.pdf_url}
//                                         fileError={pdfFileError}
//                                         helperText="Optional: PDF, max 10MB."
//                                         isDragDrop
//                                         dragActive={dragActive}
//                                         onDrag={handleDrag}
//                                         onDrop={handleDrop}
//                                         selectedFileName={data.pdf_url?.name}
//                                         onRemove={handleRemovePdf}
//                                     />
//                                 </div>
//                             )}
//
//                             {/* Submit and Cancel */}
//                             <div className="col-span-full mt-6 flex justify-end gap-4">
//                                 <TooltipProvider>
//                                     <Tooltip>
//                                         <TooltipTrigger asChild>
//                                             <Button
//                                                 type="submit"
//                                                 disabled={processing || isAudio}
//                                                 className="rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
//                                             >
//                                                 {processing ? 'Updating...' : 'Update Book'}
//                                             </Button>
//                                         </TooltipTrigger>
//                                         <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                             Save the updated book
//                                         </TooltipContent>
//                                     </Tooltip>
//                                 </TooltipProvider>
//                                 <TooltipProvider>
//                                     <Tooltip>
//                                         <TooltipTrigger asChild>
//                                             <Link href={route('books.index')}>
//                                                 <Button
//                                                     variant="outline"
//                                                     className="rounded-lg border-indigo-200 bg-white px-4 py-2 text-indigo-600 transition-colors duration-200 hover:bg-indigo-50 dark:border-indigo-600 dark:bg-gray-700 dark:text-indigo-300 dark:hover:bg-indigo-800"
//                                                     disabled={processing}
//                                                 >
//                                                     Cancel
//                                                 </Button>
//                                             </Link>
//                                         </TooltipTrigger>
//                                         <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-indigo-600 text-white">
//                                             Return to the books list
//                                         </TooltipContent>
//                                     </Tooltip>
//                                 </TooltipProvider>
//                             </div>
//                         </form>
//                     </div>
//
//                     {/* Cover Preview Dialog */}
//                     <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
//                         <DialogContent className="max-w-2xl rounded-2xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 dark:border-indigo-700 dark:from-gray-800 dark:to-blue-900 dark:text-gray-100">
//                             <DialogHeader>
//                                 <DialogTitle className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">Cover Preview</DialogTitle>
//                             </DialogHeader>
//                             {coverPreviewUrl ? (
//                                 <img src={coverPreviewUrl} alt="Cover Preview" className="h-auto max-h-[70vh] w-full rounded object-contain" />
//                             ) : (
//                                 <p className="text-red-500 dark:text-red-400">No cover image available.</p>
//                             )}
//                         </DialogContent>
//                     </Dialog>
//
//                     {/* PDF Preview Dialog */}
//                     <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
//                         <DialogContent className="max-w-4xl rounded-2xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 dark:border-indigo-700 dark:from-gray-800 dark:to-blue-900 dark:text-gray-100">
//                             <DialogHeader>
//                                 <DialogTitle className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">PDF Preview</DialogTitle>
//                             </DialogHeader>
//                             {pdfPreviewUrl ? (
//                                 <Worker workerUrl="/pdf.worker.min.js">
//                                     <div className="h-[70vh] w-full overflow-auto">
//                                         <Viewer fileUrl={pdfPreviewUrl} plugins={[defaultLayoutPluginInstance]} />
//                                     </div>
//                                 </Worker>
//                             ) : (
//                                 <p className="text-red-500 dark:text-red-400">No PDF file available.</p>
//                             )}
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </AppLayout>
//         </ErrorBoundary>
//     );
// }
