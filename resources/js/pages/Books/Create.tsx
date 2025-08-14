import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { CheckCircle2Icon, X } from 'lucide-react';

interface User {
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

interface Bookcase {
    id: number;
    code: string;
}

interface Shelves {
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

interface BooksCreateProps {
    users: User[];
    categories: Category[];
    subcategories: Subcategory[];
    bookcases: Bookcase[];
    shelves: Shelves[];
    grades: Grade[];
    subjects: Subject[];
    flash?: {
        message: string | null;
        error: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Books', href: route('books.index') },
    { title: 'Create', href: '' },
];

export default function BooksCreate({
                                        users,
                                        categories,
                                        subcategories,
                                        bookcases,
                                        shelves,
                                        grades,
                                        subjects,
                                        flash,
                                    }: BooksCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        flip_link: '',
        cover: null as File | null,
        code: '',
        isbn: '',
        view: '0',
        is_available: false,
        pdf_url: null as File | null,
        user_id: '',
        category_id: '',
        subcategory_id: null as string | null,
        bookcase_id: null as string | null,
        shelf_id: null as string | null,
        grade_id: null as string | null,
        subject_id: null as string | null,
        is_deleted: false,
    });

    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showAlert, setShowAlert] = useState(!!flash?.message || !!flash?.error);

    // Create and clean up Blob URL for PDF preview
    const pdfBlobUrl = useMemo(() => {
        if (data.pdf_url) {
            return URL.createObjectURL(data.pdf_url);
        }
        return null;
    }, [data.pdf_url]);

    // Cleanup Blob URL on component unmount or file change
    useEffect(() => {
        return () => {
            if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
            }
            if (coverPreviewUrl) {
                URL.revokeObjectURL(coverPreviewUrl);
            }
        };
    }, [pdfBlobUrl, coverPreviewUrl]);

    // Initialize PDF viewer plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== '') {
                formData.append(key, value as string | Blob);
            }
        }
        post(route('books.store'), {
            data: formData,
            forceFormData: true, // Ensure Inertia sends FormData correctly
            onSuccess: () => {
                setShowAlert(true);
                // Reset form after successful submission
                setData({
                    title: '',
                    flip_link: '',
                    cover: null,
                    code: '',
                    isbn: '',
                    view: '0',
                    is_available: false,
                    pdf_url: null,
                    user_id: '',
                    category_id: '',
                    subcategory_id: null,
                    bookcase_id: null,
                    shelf_id: null,
                    grade_id: null,
                    subject_id: null,
                    is_deleted: false,
                });
                setCoverPreviewUrl(null);
                setPdfPreviewUrl(null);
            },
            onError: () => {
                setShowAlert(true);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.match('image/(jpeg|png)')) {
                setData('cover', file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCoverPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file (jpg, jpeg, png).');
            }
        } else {
            setData('cover', null);
            setCoverPreviewUrl(null);
        }
    };

    const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                setData('pdf_url', file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPdfPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid PDF file.');
            }
        } else {
            setData('pdf_url', null);
            setPdfPreviewUrl(null);
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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setData('pdf_url', file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPdfPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please drop a valid PDF file.');
            }
        }
    };

    const handleCoverPreviewClick = () => {
        setIsCoverModalOpen(true);
    };

    const handlePdfPreviewClick = () => {
        setIsPdfModalOpen(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Book" />
            <div className="h-full flex-1 p-4 sm:p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create Book</h1>
                    {showAlert && (flash?.message || flash?.error) && (
                        <Alert
                            className={`mb-4 flex items-start justify-between ${
                                flash.error ? 'border-red-500' : 'border-blue-200 dark:border-blue-800'
                            } bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-lg`}
                        >
                            <div className="flex gap-2">
                                <CheckCircle2Icon className={`h-4 w-4 ${flash.error ? 'text-red-500' : 'text-blue-500'}`} />
                                <div>
                                    <AlertTitle>{flash.error ? 'Error' : 'Success'}</AlertTitle>
                                    <AlertDescription>{flash.message || flash.error}</AlertDescription>
                                </div>
                            </div>
                            <Button
                                onClick={handleCloseAlert}
                                className="text-sm font-medium cursor-pointer"
                                disabled={processing}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" encType="multipart/form-data">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                required
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="flip_link" className="text-sm font-medium text-gray-700 dark:text-gray-300">Flip Link</Label>
                            <Input
                                id="flip_link"
                                value={data.flip_link}
                                onChange={(e) => setData('flip_link', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                                    errors.flip_link ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.flip_link && <p className="text-red-500 text-sm">{errors.flip_link}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                                    errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="isbn" className="text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</Label>
                            <Input
                                id="isbn"
                                value={data.isbn}
                                onChange={(e) => setData('isbn', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                                    errors.isbn ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="view" className="text-sm font-medium text-gray-700 dark:text-gray-300">Views</Label>
                            <Input
                                id="view"
                                type="number"
                                value={data.view}
                                onChange={(e) => setData('view', e.target.value)}
                                min="0"
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                                    errors.view ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.view && <p className="text-red-500 text-sm">{errors.view}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="is_available" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</Label>
                            <Select
                                value={data.is_available ? 'true' : 'false'}
                                onValueChange={(value) => setData('is_available', value === 'true')}
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.is_available ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.is_available && <p className="text-red-500 text-sm">{errors.is_available}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                User <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.user_id}
                                onValueChange={(value) => setData('user_id', value)}
                                required
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.user_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) => setData('category_id', value)}
                                required
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.category_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subcategory_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory</Label>
                            <Select
                                value={data.subcategory_id || 'none'}
                                onValueChange={(value) => setData('subcategory_id', value === 'none' ? null : value)}
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.subcategory_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {subcategories.map((subcategory) => (
                                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                            {subcategory.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.subcategory_id && <p className="text-red-500 text-sm">{errors.subcategory_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bookcase_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bookcase</Label>
                            <Select
                                value={data.bookcase_id || 'none'}
                                onValueChange={(value) => setData('bookcase_id', value === 'none' ? null : value)}
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.bookcase_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a bookcase" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {bookcases.map((bookcase) => (
                                        <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
                                            {bookcase.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.bookcase_id && <p className="text-red-500 text-sm">{errors.bookcase_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shelf_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Shelf</Label>
                            <Select
                                value={data.shelf_id || 'none'}
                                onValueChange={(value) => setData('shelf_id', value === 'none' ? null : value)}
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.shelf_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a shelf" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {shelves.map((shelf) => (
                                        <SelectItem key={shelf.id} value={shelf.id.toString()}>
                                            {shelf.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.shelf_id && <p className="text-red-500 text-sm">{errors.shelf_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grade_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade</Label>
                            <Select
                                value={data.grade_id || 'none'}
                                onValueChange={(value) => setData('grade_id', value === 'none' ? null : value)}
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.grade_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {grades.map((grade) => (
                                        <SelectItem key={grade.id} value={grade.id.toString()}>
                                            {grade.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.grade_id && <p className="text-red-500 text-sm">{errors.grade_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</Label>
                            <Select
                                value={data.subject_id || 'none'}
                                onValueChange={(value) => setData('subject_id', value === 'none' ? null : value)}
                            >
                                <SelectTrigger
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border ${
                                        errors.subject_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.subject_id && <p className="text-red-500 text-sm">{errors.subject_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cover" className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover</Label>
                            <Input
                                id="cover"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFileChange}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                                    errors.cover ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {coverPreviewUrl && (
                                <div className="mt-2">
                                    <img
                                        src={coverPreviewUrl}
                                        alt="Cover Preview"
                                        className="w-32 h-auto rounded-md cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={handleCoverPreviewClick}
                                    />
                                </div>
                            )}
                            {errors.cover && <p className="text-red-500 text-sm">{errors.cover}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pdf_url" className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF File</Label>
                            <div
                                className={`border-2 border-dashed ${
                                    dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'
                                } p-4 rounded-md text-center ${errors.pdf_url ? 'border-red-500' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Input
                                    id="pdf_url"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePdfFileChange}
                                    className="hidden"
                                />
                                <div className="space-y-2">
                                    {data.pdf_url ? (
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Selected: {(data.pdf_url as File).name}{' '}
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setData('pdf_url', null);
                                                    setPdfPreviewUrl(null);
                                                }}
                                                className="text-red-500 dark:text-red-400 hover:underline"
                                            >
                                                Remove
                                            </Button>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Drag and drop a PDF file here, or click to browse.
                                        </p>
                                    )}
                                    <Button
                                        type="button"
                                        onClick={() => document.getElementById('pdf_url')?.click()}
                                        className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
                                    >
                                        Browse
                                    </Button>
                                </div>
                            </div>
                            {pdfPreviewUrl && (
                                <div className="mt-2">
                                    <Button
                                        variant="link"
                                        onClick={handlePdfPreviewClick}
                                        className="text-blue-500 dark:text-blue-400 hover:underline"
                                    >
                                        Preview PDF
                                    </Button>
                                </div>
                            )}
                            {errors.pdf_url && <p className="text-red-500 text-sm">{errors.pdf_url}</p>}
                        </div>
                        <div className="col-span-1 sm:col-span-2 flex gap-4 mt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                {processing ? 'Creating...' : 'Create Book'}
                            </Button>
                            <Link href={route('books.index')}>
                                <Button
                                    variant="outline"
                                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
                <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
                    <DialogContent className="max-w-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Cover Preview</DialogTitle>
                        </DialogHeader>
                        {coverPreviewUrl ? (
                            <img
                                src={coverPreviewUrl}
                                alt="Cover Preview"
                                className="w-full h-auto rounded-md"
                                onError={() => setIsCoverModalOpen(false)} // Close modal if image fails to load
                            />
                        ) : (
                            <p className="text-red-500 dark:text-red-400">No cover image available</p>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsCoverModalOpen(false)}
                                className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                    <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">PDF Preview</DialogTitle>
                        </DialogHeader>
                        {pdfBlobUrl ? (
                            <Worker workerUrl="/pdf.worker.min.js">
                                <div style={{ height: '600px' }}>
                                    <Viewer fileUrl={pdfBlobUrl} plugins={[defaultLayoutPluginInstance]} />
                                </div>
                            </Worker>
                        ) : (
                            <p className="text-red-500 dark:text-red-400">No PDF available</p>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsPdfModalOpen(false)}
                                className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
