import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    return_date: string;
    book_id: number;
    user_id: number;
}

interface BookLoansEditProps {
    loan: BookLoan;
    books: Book[];
    users: User[];
    flash?: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book Loans',
        href: route('bookloans.index'),
    },
    {
        title: 'Edit',
        href: '',
    },
];

export default function BookLoansEdit({ loan, books, users, flash }: BookLoansEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        return_date: loan.return_date,
        book_id: loan.book_id.toString(),
        user_id: loan.user_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('bookloans.update', loan.id), {
            data,
            onSuccess: () => {},
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Book Loan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Edit Book Loan</h1>
                {flash?.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="return_date">Return Date</Label>
                        <Input
                            id="return_date"
                            type="date"
                            value={data.return_date}
                            onChange={(e) => setData('return_date', e.target.value)}
                            className={errors.return_date ? 'border-red-500' : ''}
                        />
                        {errors.return_date && <p className="text-red-500 text-sm">{errors.return_date}</p>}
                    </div>
                    <div>
                        <Label htmlFor="book_id">Book</Label>
                        <Select
                            onValueChange={(value) => setData('book_id', value)}
                            value={data.book_id}
                        >
                            <SelectTrigger id="book_id" className={errors.book_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a book" />
                            </SelectTrigger>
                            <SelectContent>
                                {books.map((book) => (
                                    <SelectItem key={book.id} value={book.id.toString()}>
                                        {book.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.book_id && <p className="text-red-500 text-sm">{errors.book_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="user_id">User</Label>
                        <Select
                            onValueChange={(value) => setData('user_id', value)}
                            value={data.user_id}
                        >
                            <SelectTrigger id="user_id" className={errors.user_id ? 'border-red-500' : ''}>
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
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                        <Link href={route('bookloans.show', loan.id)}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
