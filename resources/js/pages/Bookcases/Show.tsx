import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Book {
    id: number;
    title: string;
    code: string;
    isbn: string;
    view: string;
    is_available: boolean;
}

interface Bookcase {
    id: number;
    code: string;
    books: Book[];
}

interface BookcasesShowProps {
    bookcase: Bookcase;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookcases',
        href: route('bookcases.index'),
    },
    {
        title: 'Show',
        href: '',
    },
];

export default function BookcasesShow({ bookcase }: BookcasesShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookcase Details" />
            <div className="h-full flex-1 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 col-span-2">Bookcase Details</h1>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ID</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{bookcase.id}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{bookcase.code ?? 'N/A'}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Books in This Bookcase</h2>
                        {bookcase.books?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>ISBN</TableHead>
                                            <TableHead>Views</TableHead>
                                            <TableHead>Available</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookcase.books.map((book) => (
                                            <TableRow key={book.id}>
                                                <TableCell>{book.id}</TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={route('books.show', book.id)}
                                                        className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        {book.title || 'N/A'}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{book.code || 'N/A'}</TableCell>
                                                <TableCell>{book.isbn || 'N/A'}</TableCell>
                                                <TableCell>{book.view || 'N/A'}</TableCell>
                                                <TableCell>{book.is_available ? 'Yes' : 'No'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No books found in this bookcase.</p>
                        )}
                    </div>
                    <div className="col-span-2 flex gap-4 mt-6">
                        <Link href={route('bookcases.edit', { id: bookcase.id })}>
                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Edit
                            </Button>
                        </Link>
                        <Link href={route('bookcases.index')}>
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
