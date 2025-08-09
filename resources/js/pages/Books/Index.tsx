import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { X, Bell, Eye, Pencil, Trash, BookPlus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

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
    const [isNotificationVisible, setIsNotificationVisible] = useState(!!flash?.message);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.message) {
            setIsNotificationVisible(true);
            const timer = setTimeout(() => {
                setIsNotificationVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setIsNotificationVisible(false);
        }
    }, [flash?.message]);

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            destroy(route('books.destroy', deleteId), {
                onSuccess: () => {
                    setDeleteId(null);
                },
                onError: () => {
                    alert('Failed to delete the book. Please try again.');
                },
            });
        }
    };

    const handleCloseNotification = () => {
        setIsNotificationVisible(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Books({books.length || 0})</h1>
                    <Link href={route('books.create')}>
                        <Button className="flex items-center gap-1">
                            <BookPlus className="h-5 w-5" />
                            Add New Book
                        </Button>
                    </Link>
                </div>
                {isNotificationVisible && flash?.message && (
                    <Alert className="mb-4 relative flex items-center p-3 rounded-md">
                        <Bell className="h-5 w-5 mr-2" />
                        <div className="flex-1">
                            <AlertTitle className="text-sm font-medium text-blue-700">Notification</AlertTitle>
                            <AlertDescription className="text-sm">{flash.message}</AlertDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCloseNotification}
                            className="text-gray-500 hover:text-gray-700 absolute right-2 top-2"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </Alert>
                )}
                <div className="overflow-x-auto md:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{book.title}</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>ID:</strong> {book.id}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Flip Link:</strong>{' '}
                                    <a
                                        href={book.flip_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={book.flip_link ? "text-blue-500 underline" : "text-red-500 dark:text-red-400"}
                                    >
                                        {book.flip_link || 'N/A'}
                                    </a>
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Code:</strong> {book.code}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>ISBN:</strong> {book.isbn}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Views:</strong> {book.view}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Available:</strong> {book.is_available ? 'Yes' : 'No'}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>User:</strong>{' '}
                                    {book.user_id ? (
                                        <Link
                                            href={route('users.show', book.user_id)}
                                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {book.user?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-500 dark:text-red-400">N/A</span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Category:</strong>{' '}
                                    {book.category_id ? (
                                        <Link
                                            href={route('categories.show', book.category_id)}
                                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {book.category?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-500 dark:text-red-400">N/A</span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Subcategory:</strong>{' '}
                                    {book.subcategory_id ? (
                                        <Link
                                            href={route('subcategories.show', book.subcategory_id)}
                                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {book.subcategory?.name || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-500 dark:text-red-400">N/A</span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Bookcase:</strong>{' '}
                                    {book.bookcase_id ? (
                                        <Link
                                            href={route('bookcases.show', book.bookcase_id)}
                                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {book.bookcase?.code || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-500 dark:text-red-400">N/A</span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Shelf:</strong>{' '}
                                    {book.shelf_id ? (
                                        <Link
                                            href={route('shelves.show', book.shelf_id)}
                                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {book.shelf?.code || 'N/A'}
                                        </Link>
                                    ) : (
                                        <span className="text-red-500 dark:text-red-400">N/A</span>
                                    )}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <Link href={route('books.show', book.id)}>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Show
                                        </Button>
                                    </Link>
                                    <Link href={route('books.edit', book.id)}>
                                        <Button
                                            size="sm"
                                            className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-gray-100 flex items-center gap-1"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={processing}
                                                onClick={() => handleDelete(book.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-1"
                                            >
                                                <Trash className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the book
                                                    and remove its data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={confirmDelete}
                                                    disabled={processing}
                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                >
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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
                                            className={book.flip_link ? "text-blue-500 underline" : "text-red-500 dark:text-red-400"}
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
                                                className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {book.user?.name || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-500 dark:text-red-400">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.category_id ? (
                                            <Link
                                                href={route('categories.show', book.category_id)}
                                                className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {book.category?.name || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-500 dark:text-red-400">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.subcategory_id ? (
                                            <Link
                                                href={route('subcategories.show', book.subcategory_id)}
                                                className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {book.subcategory?.name || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-500 dark:text-red-400">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.bookcase_id ? (
                                            <Link
                                                href={route('bookcases.show', book.bookcase_id)}
                                                className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {book.bookcase?.code || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-500 dark:text-red-400">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.shelf_id ? (
                                            <Link
                                                href={route('shelves.show', book.shelf_id)}
                                                className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {book.shelf?.code || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-500 dark:text-red-400">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link href={route('books.show', book.id)}>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View book details</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link href={route('books.edit', book.id)}>
                                                            <Button
                                                                size="sm"
                                                                className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-gray-100 flex items-center"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Edit book information</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    disabled={processing}
                                                                    onClick={() => handleDelete(book.id)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 flex items-center"
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the book
                                                                        and remove its data from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={confirmDelete}
                                                                        disabled={processing}
                                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                                    >
                                                                        Continue
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Delete this book</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
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
