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

interface Book {
    id: number;
    title: string;
}

interface BookLoan {
    id: number;
    return_date: string; // Assuming date string (e.g., '2025-08-08')
    book_id: number;
    user_id: number;
    book: Book | null;
    user: User | null;
}

interface BookLoansIndexProps {
    bookloans: BookLoan[];
    flash?: {
        message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book Loans',
        href: '',
    },
];

export default function BookLoansIndex({ bookloans }: BookLoansIndexProps) {
    const { delete: destroy, processing } = useForm();
    const { props } = usePage();
    const flash = props.flash as { message?: string } | undefined;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this book loan?')) {
            destroy(route('bookloans.destroy', id), {
                onSuccess: () => {
                    window.location.reload();
                },
                onError: () => {
                    alert('Failed to delete the book loan. Please try again.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Loans" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Book Loans({bookloans.length||0})</h1>
                    <Link href={route('bookloans.create')}>
                        <Button>Create New Book Loan</Button>
                    </Link>
                </div>
                {flash?.message && (
                    <Alert className="mb-4">
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Return Date</TableHead>
                                <TableHead>Book</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookloans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell>{loan.id}</TableCell>
                                    <TableCell>{loan.return_date || 'N/A'}</TableCell>
                                    <TableCell>
                                        {loan.book_id ? (
                                            <Link
                                                href={route('books.show', loan.book_id)}
                                                className="text-blue-500 underline"
                                            >
                                                {loan.book?.title || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-600">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {loan.user_id ? (
                                            <Link
                                                href={route('users.show', loan.user_id)}
                                                className="text-blue-500 underline"
                                            >
                                                {loan.user?.name || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-600">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={route('bookloans.show', loan.id)}>
                                                <Button size="sm" variant="secondary">Show</Button>
                                            </Link>
                                            <Link href={route('bookloans.edit', loan.id)}>
                                                <Button size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(loan.id)}
                                                disabled={processing}
                                            >
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
