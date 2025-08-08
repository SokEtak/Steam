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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Bookcase Details</h1>

                {/* Part 1: Bookcase Info */}
                <div className="space-y-4">
                    <div><strong>Code:</strong> {bookcase.code}</div>
                </div>

                {/* Part 2: Books in Bookcase */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Books in This Bookcase</h2>
                    {bookcase.books.length > 0 ? (
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
                                            <TableCell>{book.title}</TableCell>
                                            <TableCell>{book.code}</TableCell>
                                            <TableCell>{book.isbn}</TableCell>
                                            <TableCell>{book.view}</TableCell>
                                            <TableCell>{book.is_available ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p>No books found in this bookcase.</p>
                    )}
                </div>

                <div className="flex gap-2 mt-4">
                    <Link href={route('bookcases.index')}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
