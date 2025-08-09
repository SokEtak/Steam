import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

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

interface Book {
    id: number;
    title: string;
    flip_link: string;
    code: string;
    isbn: string;
    view: number;
    is_available: boolean;
    user_id: number;
    category_id: number;
    subcategory_id: number | null;
    bookcase_id: number | null;
    shelf_id: number | null;
    user: User | null;
    category: Category | null;
    subcategory: Subcategory | null;
    bookcase: Bookcase | null;
    shelf: Shelves | null;
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Details" />
            <div className="h-full flex-1 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 col-span-2">Book Details</h1>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ID</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{book.id}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{book.title}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Flip Link</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                <a href={book.flip_link} target="_blank" rel="noopener noreferrer" className={book.flip_link ? "text-blue-500 underline" : "text-red-500 dark:text-red-400"}>
                                    {book.flip_link || 'N/A'}
                                </a>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{book.code}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{book.isbn}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Views</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{book.view}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{book.is_available ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">User</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                {book.user_id ? (
                                    <Link href={route('users.show', book.user_id)} className="text-blue-500 underline">
                                        {book.user?.name || 'N/A'}
                                    </Link>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                {book.category_id ? (
                                    <Link href={route('categories.show', book.category_id)} className="text-blue-500 underline">
                                        {book.category?.name || 'N/A'}
                                    </Link>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                {book.subcategory_id ? (
                                    <Link href={route('subcategories.show', book.subcategory_id)} className="text-blue-500 underline">
                                        {book.subcategory?.name || 'N/A'}
                                    </Link>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bookcase</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                {book.bookcase_id ? (
                                    <Link href={route('bookcases.show', book.bookcase_id)} className="text-blue-500 underline">
                                        {book.bookcase?.code || 'N/A'}
                                    </Link>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Shelf</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                {book.shelf_id ? (
                                    <Link href={route('shelves.show', book.shelf_id)} className="text-blue-500 underline">
                                        {book.shelf?.code || 'N/A'}
                                    </Link>
                                ) : 'N/A'}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-2 flex gap-4 mt-6">
                        <Link href={route('books.edit', book.id)}>
                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Edit
                            </Button>
                        </Link>
                        <Link href={route('books.index')}>
                            <Button
                                variant="outline"
                                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
