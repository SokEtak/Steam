import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

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
    return_date: string;
    book_id: number;
    user_id: number;
    book: Book | null;
    user: User | null;
}

interface BookLoansShowProps {
    loan: BookLoan;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book Loans',
        href: route('bookloans.index'),
    },
    {
        title: 'Show',
        href: '',
    },
];

export default function BookLoansShow({ loan }: BookLoansShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Loan Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Book Loan Details</h1>
                <div className="space-y-4">
                    <div><strong>ID:</strong> {loan.id}</div>
                    <div><strong>Return Date:</strong> {loan.return_date || 'N/A'}</div>
                    <div>
                        <strong>Book:</strong>{' '}
                        {loan.book_id ? (
                            <Link
                                href={route('books.show', loan.book_id)}
                                className="text-blue-500 underline ml-2"
                            >
                                {loan.book?.title || 'N/A'}
                            </Link>
                        ) : (
                            <span className="text-red-600">N/A</span>
                        )}
                    </div>
                    <div>
                        <strong>User:</strong>{' '}
                        {loan.user_id ? (
                            <Link
                                href={route('users.show', loan.user_id)}
                                className="text-blue-500 underline ml-2"
                            >
                                {loan.user?.name || 'N/A'}
                            </Link>
                        ) : (
                            <span className="text-red-600">N/A</span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={route('bookloans.edit', loan.id)}>
                        <Button>Edit</Button>
                    </Link>
                    <Link href={route('bookloans.index')}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
