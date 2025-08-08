import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    view: string;
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

interface BooksIndexProps {
    books: Book[];
    flash?: {
        message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: '',
    },
];

export default function BooksIndex({ books }: BooksIndexProps) {
    const { delete: destroy, processing } = useForm();
    const { props } = usePage();
    const flash = props.flash as { message?: string } | undefined;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this book?')) {
            destroy(route('books.destroy', id), {
                onSuccess: () => {
                    window.location.reload();
                },
                onError: () => {
                    alert('Failed to delete the book. Please try again.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Books({books.length || 0})</h1>
                    <Link href={route('books.create')}>
                        <Button>Create New Book</Button>
                    </Link>
                </div>
                {flash?.message && (
                    <Alert className="mb-4">
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <div className="overflow-x-auto md:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {books.map((book) => (
                            <div key={book.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold">{book.title}</h3>
                                <p><strong>ID:</strong> {book.id}</p>
                                <p>
                                    <strong>Flip Link:</strong>{' '}
                                    <a
                                        href={book.flip_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={book.flip_link ? "text-blue-500 underline" : "text-red-600"}
                                    >
                                        {book.flip_link || 'N/A'}
                                    </a>
                                </p>
                                <p><strong>Code:</strong> {book.code}</p>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                <p><strong>Views:</strong> {book.view}</p>
                                <p><strong>Available:</strong> {book.is_available ? 'Yes' : 'No'}</p>
                                <p>
                                    <strong>User:</strong>{' '}
                                    {book.user_id ? (
                                        <Link href={route('users.show', book.user_id)} className="text-blue-500 underline">
                                            {book.user?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-600">N/A</span>
                                    )}
                                </p>
                                <p>
                                    <strong>Category:</strong>{' '}
                                    {book.category_id ? (
                                        <Link href={route('categories.show', book.category_id)} className="text-blue-500 underline">
                                            {book.category?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-600">N/A</span>
                                    )}
                                </p>
                                <p>
                                    <strong>Subcategory:</strong>{' '}
                                    {book.subcategory_id ? (
                                        <Link href={route('subcategories.show', book.subcategory_id)} className="text-blue-500 underline">
                                            {book.subcategory?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-600">N/A</span>
                                    )}
                                </p>
                                <p>
                                    <strong>Bookcase:</strong>{' '}
                                    {book.bookcase_id ? (
                                        <Link href={route('bookcases.show', book.bookcase_id)} className="text-blue-500 underline">
                                            {book.bookcase?.code || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-600">N/A</span>
                                    )}
                                </p>
                                <p>
                                    <strong>Shelf:</strong>{' '}
                                    {book.shelf_id ? (
                                        <Link href={route('shelves.show', book.shelf_id)} className="text-blue-500 underline">
                                            {book.shelf?.code || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-600">N/A</span>
                                    )}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <Link href={route('books.show', book.id)}>
                                        <Button size="sm" variant="secondary">Show</Button>
                                    </Link>
                                    <Link href={route('books.edit', book.id)}>
                                        <Button size="sm">Edit</Button>
                                    </Link>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(book.id)} disabled={processing}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Flip Link</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Available</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Subcategory</TableHead>
                                <TableHead>Bookcase</TableHead>
                                <TableHead>Shelf</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.id}</TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>
                                        <a
                                            href={book.flip_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={book.flip_link ? "text-blue-500 underline" : "text-red-600"}
                                        >
                                            {book.flip_link || 'N/A'}
                                        </a>
                                    </TableCell>
                                    <TableCell>{book.code}</TableCell>
                                    <TableCell>{book.isbn}</TableCell>
                                    <TableCell>{book.view}</TableCell>
                                    <TableCell>{book.is_available ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        {book.user_id ? (
                                            <Link
                                                href={route('users.show', book.user_id)}
                                                className="text-blue-500 underline"
                                            >
                                                {book.user?.name || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-600">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.category_id ? (
                                            <Link
                                                href={route('categories.show', book.category_id)}
                                                className="text-blue-500 underline"
                                            >
                                                {book.category?.name || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-600">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.subcategory_id ? (
                                            <Link
                                                href={route('subcategories.show', book.subcategory_id)}
                                                className="text-blue-500 underline"
                                            >
                                                {book.subcategory?.name || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-600">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.bookcase_id ? (
                                            <Link
                                                href={route('bookcases.show', book.bookcase_id)}
                                                className="text-blue-500 underline"
                                            >
                                                {book.bookcase?.code || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-600">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.shelf_id ? (
                                            <Link
                                                href={route('shelves.show', book.shelf_id)}
                                                className="text-blue-500 underline"
                                            >
                                                {book.shelf?.code || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-600">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={route('books.show', book.id)}>
                                                <Button size="sm" variant="secondary">Show</Button>
                                            </Link>
                                            <Link href={route('books.edit', book.id)}>
                                                <Button size="sm">Edit</Button>
                                            </Link>
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(book.id)} disabled={processing}>
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
