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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Book Details</h1>
                <div className="space-y-4">
                    <div><strong>ID:</strong> {book.id}</div>
                    <div><strong>Title:</strong> {book.title}</div>
                    <div><strong>Flip Link:</strong> <a href={book.flip_link} target="_blank" rel="noopener noreferrer">{book.flip_link}</a></div>
                    <div><strong>Code:</strong> {book.code}</div>
                    <div><strong>ISBN:</strong> {book.isbn}</div>
                    <div><strong>Views:</strong> {book.view}</div>
                    <div><strong>Available:</strong> {book.is_available ? 'Yes' : 'No'}</div>
                    <div>
                        <strong>User:</strong>
                        {book.user_id ? (
                            <Link href={route('users.show', book.user_id)} className="text-blue-500 underline ml-2">
                                {book.user?.name || 'N/A'}
                            </Link>
                        ) : 'N/A'}
                    </div>
                    <div>
                        <strong>Category:</strong>
                        {book.category_id ? (
                            <Link href={route('categories.show', book.category_id)} className="text-blue-500 underline ml-2">
                                {book.category?.name || 'N/A'}
                            </Link>
                        ) : 'N/A'}
                    </div>
                    <div>
                        <strong>Subcategory:</strong>
                        {book.subcategory_id ? (
                            <Link href={route('subcategories.show', book.subcategory_id)} className="text-blue-500 underline ml-2">
                                {book.subcategory?.name || 'N/A'}
                            </Link>
                        ) : 'N/A'}
                    </div>
                    <div>
                        <strong>Bookcase:</strong>
                        {book.bookcase_id ? (
                            <Link href={route('bookcases.show', book.bookcase_id)} className="text-blue-500 underline ml-2">
                                {book.bookcase?.code || 'N/A'}
                            </Link>
                        ) : 'N/A'}
                    </div>
                    <div>
                        <strong>Shelf:</strong>
                        {book.shelf_id ? (
                            <Link href={route('shelves.show', book.shelf_id)} className="text-blue-500 underline ml-2">
                                {book.shelf?.code || 'N/A'}
                            </Link>
                        ) : 'N/A'}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={route('books.edit', book.id)}>
                        <Button>Edit</Button>
                    </Link>
                    <Link href={route('books.index')}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
