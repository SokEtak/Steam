import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Copy, Check, X, ArrowRight, ArrowLeft } from 'lucide-react';

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
    description: string | null;
    flip_link: string | null;
    cover: string | null;
    code: string;
    isbn: string;
    view: number;
    is_available: boolean;
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
    page_count: number | null;
    publisher: string | null;
    language: string | null;
    program: string | null;
    published_at: string | null;
    author: string | null;
    type: string | null;
    downloadable: boolean | null;
    created_at: string | null;
    updated_at: string | null;
}

interface BooksShowProps {
    book: Book;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: route('books.index'),
    },
    {
        title: 'Show',
        href: '',
    },
];

export default function BooksShow({ book }: BooksShowProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Details" />
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10">
                    {book.cover && (
                        <div className="mb-10 flex justify-center">
                            <img
                                src={book.cover}
                                alt="Book Cover"
                                className="w-full max-w-sm rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer"
                                onClick={toggleModal}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { label: 'ID', value: book.id.toString(), field: 'id', copyable: true },
                            { label: 'Title', value: book.title, field: 'title', copyable: true },
                            { label: 'Description', value: book.description || 'N/A', field: 'description', copyable: true },
                            { label: 'Page Count', value: book.page_count ? `${book.page_count} pages` : 'N/A', field: 'page_count' },
                            { label: 'Publisher', value: book.publisher || 'N/A', field: 'publisher' },
                            {
                                label: 'Language',
                                value: book.language === 'en'
                                    ? 'English'
                                    : book.language === 'kh'
                                        ? 'Khmer'
                                        : 'N/A',
                                field: 'language'
                            },
                            {
                                label: 'Program',
                                value: book.program || 'N/A',
                                field: 'program',
                            },
                            {
                                label: 'Published At',
                                value: book.published_at
                                    ? new Date(book.published_at).toLocaleString('en-US', {
                                        timeZone: 'Asia/Bangkok',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'N/A',
                                field: 'published_at',
                            },
                            { label: 'Author', value: book.author || 'N/A', field: 'author' },
                            {
                                label: 'Book Type',
                                value: book.type ? book.type.charAt(0).toUpperCase() + book.type.slice(1) : 'N/A',
                                field: 'type'
                            },
                            {
                                label: 'Downloadable',
                                value: book.downloadable ? 'Yes' : 'No',
                                field: 'downloadable',
                                className: book.downloadable ? 'text-green-500' : 'text-red-500',
                            },
                            {
                                label: 'Posted At',
                                value: book.created_at
                                    ? new Date(book.created_at).toLocaleString('en-US', {
                                        timeZone: 'Asia/Bangkok',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    })
                                    : 'N/A',
                                field: 'created_at',
                            },
                            {
                                label: 'Last Modified',
                                value: book.updated_at
                                    ? new Date(book.updated_at).toLocaleString('en-US', {
                                        timeZone: 'Asia/Bangkok',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'N/A',
                                field: 'updated_at',
                            },
                            {
                                label: 'Flip Link',
                                value: book.flip_link || 'N/A',
                                field: 'flip_link',
                                copyable: true,
                                render: () =>
                                    book.flip_link ? (
                                        <a
                                            href={book.flip_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.flip_link}
                                        </a>
                                    ) : (
                                        'N/A'
                                    ),
                            },
                            { label: 'Code', value: book.code, field: 'code', copyable: true },
                            { label: 'ISBN', value: book.isbn, field: 'isbn', copyable: true },
                            { label: 'Views', value: book.view.toString(), field: 'view' },
                            {
                                label: 'Availability',
                                value: book.is_available ? 'Yes' : 'No',
                                field: 'is_available',
                                className: book.is_available ? 'text-green-500' : 'text-red-500',
                            },
                            {
                                label: 'Posted By',
                                value: book.user?.name || 'N/A',
                                field: 'user',
                                render: () =>
                                    book.user_id ? (
                                        <Link
                                            href={""}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.user?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        'N/A'
                                    ),
                            },
                            {
                                label: 'Category',
                                value: book.category?.name || 'N/A',
                                field: 'category',
                                render: () =>
                                    book.category_id ? (
                                        <Link
                                            href={route('categories.show', book.category_id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.category?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        'N/A'
                                    ),
                            },
                            {
                                label: 'Subcategory',
                                value: book.subcategory?.name || 'N/A',
                                field: 'subcategory',
                                render: () =>
                                    book.subcategory_id ? (
                                        <Link
                                            href={route('subcategory.show', book.subcategory_id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.subcategory?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        'N/A'
                                    ),
                            },
                            {
                                label: 'Bookcase',
                                value: book.bookcase?.code || 'N/A',
                                field: 'bookcase',
                                render: () =>
                                    book.bookcase_id ? (
                                        <Link
                                            href={route('bookcases.show', book.bookcase_id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.bookcase?.code || 'N/A'}
                                        </Link>
                                    ) : (
                                        'N/A'
                                    ),
                            },
                            {
                                label: 'Shelf',
                                value: book.shelf?.code || 'N/A',
                                field: 'shelf',
                                render: () =>
                                    book.shelf_id ? (
                                        <Link
                                            href={route('shelves.show', book.shelf_id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.shelf?.code || 'N/A'}
                                        </Link>
                                    ) : (
                                        'N/A'
                                    ),
                            },
                            { label: 'Grade', value: book.grade?.name || 'N/A', field: 'grade' },
                            { label: 'Subject', value: book.subject?.name || 'N/A', field: 'subject' },
                        ].map(({ label, value, field, className, render, copyable }) => (
                            <div
                                key={field}
                                className="relative group bg-gray-200 dark:bg-gray-700 rounded-xl p-4 transform transition-all duration-300 hover:scale-105 translate-2 hover:shadow-lg"
                            >
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">{label}</label>
                                <div className="flex items-center mt-2">
                                    <p className={`flex-1 text-gray-900 dark:text-gray-100 ${className || ''}`}>
                                        {render ? render() : value}
                                    </p>
                                    {copyable && (
                                        <button
                                            onClick={() => copyToClipboard(value, field)}
                                            className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                                            title="Copy to clipboard"
                                        >
                                            {copiedField === field ? (
                                                <Check className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                {copiedField === field && (
                                    <span className="absolute top-0 right-0 mt-12 mr-2 text-xs text-green-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md shadow">
                                        Copied!
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 flex gap-4 justify-center">
                        <Link href={route('books.index')}>
                            <Button className="border-2  px-8 py-3 rounded-lg font-semibold cursor-pointer">
                                <ArrowLeft/> Go Back Book List
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            {isModalOpen && book.cover && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full">
                        <button
                            onClick={toggleModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={`/storage/${book.cover}`}
                            alt="Book Cover Large"
                            className="w-full max-h-[80vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
