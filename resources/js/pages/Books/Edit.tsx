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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

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

interface Book {
    id: number;
    title: string;
    flip_link: string | null;
    cover: string | null;
    code: string;
    isbn: string;
    view: string;
    is_available: boolean;
    pdf_url: string | null;
    user_id: number;
    category_id: number;
    subcategory_id: number | null;
    bookcase_id: number | null;
    shelf_id: number | null;
    grade_id: number | null;
    subject_id: number | null;
    is_deleted: boolean;
    user: User | null;
    category: Category | null;
    subcategory: Subcategory | null;
    bookcase: Bookcase | null;
    shelf: Shelves | null;
    grade: Grade | null;
    subject: Subject | null;
}

interface BooksEditProps {
    book: Book;
    users: User[];
    categories: Category[];
    subcategories: Subcategory[];
    bookcases: Bookcase[];
    shelves: Shelves[];
    grades: Grade[];
    subjects: Subject[];
    flash?: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Books', href: route('books.index') },
    { title: 'Edit', href: '' },
];

export default function BooksEdit({
                                      book,
                                      users,
                                      categories,
                                      subcategories,
                                      bookcases,
                                      shelves,
                                      grades,
                                      subjects,
                                      flash,
                                  }: BooksEditProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: book.title,
        flip_link: book.flip_link || '',
        cover: null as File | null,
        code: book.code,
        isbn: book.isbn,
        view: book.view || '0',
        is_available: book.is_available,
        pdf_url: null as File | null,
        user_id: book.user_id.toString(),
        category_id: book.category_id.toString(),
        subcategory_id: book.subcategory_id?.toString() || 'none',
        bookcase_id: book.bookcase_id?.toString() || 'none',
        shelf_id: book.shelf_id?.toString() || 'none',
        grade_id: book.grade_id?.toString() || 'none',
        subject_id: book.subject_id?.toString() || 'none',
        is_deleted: book.is_deleted,
    });

    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(book.cover ? `/storage/${book.cover}` : null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(book.pdf_url ? `/storage/${book.pdf_url}` : null);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Create a Blob URL for PDF preview
    const pdfBlobUrl = useMemo(() => {
        if (data.pdf_url) {
            return URL.createObjectURL(data.pdf_url);
        }
        return book.pdf_url ? `/storage/${book.pdf_url}` : null;
    }, [data.pdf_url, book.pdf_url]);

    // Initialize PDF viewer plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== 'none') {
                formData.append(key, value as string | Blob);
            }
        }
        put(route('books.update', { id: book.id }), {
            data: formData,
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                setData('cover', file);
                setCoverPreviewUrl(URL.createObjectURL(file));
            } else {
                alert('Please select a valid image file (jpg, jpeg, png).');
            }
        } else {
            setData('cover', null);
            setCoverPreviewUrl(book.cover ? `/storage/${book.cover}` : null);
        }
    };

    const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                setData('pdf_url', file);
                setPdfPreviewUrl(URL.createObjectURL(file));
            } else {
                alert('Please select a valid PDF file.');
            }
        } else {
            setData('pdf_url', null);
            setPdfPreviewUrl(book.pdf_url ? `/storage/${book.pdf_url}` : null);
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
                setPdfPreviewUrl(URL.createObjectURL(file));
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Book" />
            <div className="h-full flex-1 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 col-span-2">Edit Book</h1>
                    {flash?.message && (
                        <Alert className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 rounded-lg col-span-2 mt-4">
                            <AlertDescription className="text-sm">{flash.message}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6" encType="multipart/form-data">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="flip_link" className="text-sm font-medium text-gray-700 dark:text-gray-300">Flip Link</Label>
                            <Input
                                id="flip_link"
                                value={data.flip_link}
                                onChange={(e) => setData('flip_link', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.flip_link ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.flip_link && <p className="text-red-500 text-sm">{errors.flip_link}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="isbn" className="text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</Label>
                            <Input
                                id="isbn"
                                value={data.isbn}
                                onChange={(e) => setData('isbn', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.isbn ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="view" className="text-sm font-medium text-gray-700 dark:text-gray-300">Views</Label>
                            <Input
                                id="view"
                                type="number"
                                value={data.view}
                                onChange={(e) => setData('view', e.target.value || '0')}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.view ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.view && <p className="text-red-500 text-sm">{errors.view}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="is_available" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</Label>
                            <Select
                                value={data.is_available ? 'true' : 'false'}
                                onValueChange={(value) => setData('is_available', value === 'true')}
                                className={errors.is_available ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                            <Label htmlFor="user_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">User</Label>
                            <Select
                                value={data.user_id}
                                onValueChange={(value) => setData('user_id', value)}
                                className={errors.user_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                            <Label htmlFor="category_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) => setData('category_id', value)}
                                className={errors.category_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                                value={data.subcategory_id}
                                onValueChange={(value) => setData('subcategory_id', value)}
                                className={errors.subcategory_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                                value={data.bookcase_id}
                                onValueChange={(value) => setData('bookcase_id', value)}
                                className={errors.bookcase_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                                value={data.shelf_id}
                                onValueChange={(value) => setData('shelf_id', value)}
                                className={errors.shelf_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                                value={data.grade_id}
                                onValueChange={(value) => setData('grade_id', value)}
                                className={errors.grade_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                                value={data.subject_id}
                                onValueChange={(value) => setData('subject_id', value)}
                                className={errors.subject_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                                className={`w-full px-3 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.cover ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {coverPreviewUrl && (
                                <div className="mt-2">
                                    <img
                                        src={coverPreviewUrl}
                                        alt="Cover Preview"
                                        className="w-32 h-auto rounded-md cursor-pointer"
                                        onClick={handleCoverPreviewClick}
                                    />
                                </div>
                            )}
                            {errors.cover && <p className="text-red-500 text-sm">{errors.cover}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pdf_url" className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF URL</Label>
                            <div
                                className={`border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-gray-600'} p-4 rounded-md text-center ${errors.pdf_url ? 'border-red-500' : ''}`}
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
                                            Selected: {(data.pdf_url as File).name}
                                        </p>
                                    ) : book.pdf_url ? (
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Current: {book.pdf_url.split('/').pop()}
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
                            {(pdfPreviewUrl || book.pdf_url) && (
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
                        <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
                            <DialogContent className="max-w-md bg-gradient-to-br from-amber-900 to-orange-900 text-white border border-amber-700 rounded-xl shadow-xl md:max-w-md sm:max-w-[80%] max-w-[90%]">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Cover Preview</DialogTitle>
                                </DialogHeader>
                                {coverPreviewUrl ? (
                                    <img
                                        src={coverPreviewUrl}
                                        alt="Cover Preview"
                                        className="w-full h-auto rounded-md"
                                    />
                                ) : (
                                    <p className="text-red-400">No cover image available</p>
                                )}
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCoverModalOpen(false)}
                                        className="bg-white text-amber-900 border-amber-700 hover:bg-amber-100"
                                    >
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                            <DialogContent className="max-w-4xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl p-6 transition-all duration-300">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-indigo-600 dark:text-indigo-300">PDF Preview</DialogTitle>
                                </DialogHeader>
                                {pdfBlobUrl ? (
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                        <Viewer fileUrl={pdfBlobUrl} plugins={[defaultLayoutPluginInstance]} />
                                    </Worker>
                                ) : (
                                    <p className="text-red-500 dark:text-red-400">No PDF available</p>
                                )}
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsPdfModalOpen(false)}
                                        className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800"
                                    >
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="col-span-2 flex gap-4 mt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                {processing ? 'Saving...' : 'Save Book'}
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
            </div>
        </AppLayout>
    );
}
