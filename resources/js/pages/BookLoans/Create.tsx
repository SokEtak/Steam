import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
}

interface BookLoansCreateProps {
    books: Book[];
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book Loans',
        href: route('bookloans.index'),
    },
    {
        title: 'Create',
        href: '',
    },
];

export default function BookLoansCreate({ books, users }: BookLoansCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        return_date: '',
        book_id: 'none',
        user_id: 'none',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookloans.store'), {
            data,
            onSuccess: () => {},
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Book Loan" />
            <div className="h-full flex-1 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 col-span-2">Create Book Loan</h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Return Date</p>
                            <Input
                                id="return_date"
                                type="date"
                                value={data.return_date}
                                onChange={(e) => setData('return_date', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.return_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.return_date && <p className="text-red-500 text-sm">{errors.return_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Book</p>
                            <Select
                                value={data.book_id}
                                onValueChange={(value) => setData('book_id', value)}
                                className={errors.book_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select a book" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {books.map((book) => (
                                        <SelectItem key={book.id} value={book.id.toString()}>
                                            {book.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.book_id && <p className="text-red-500 text-sm">{errors.book_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">User</p>
                            <Select
                                value={data.user_id}
                                onValueChange={(value) => setData('user_id', value)}
                                className={errors.user_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
                        </div>
                        <div className="col-span-2 flex gap-4 mt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                {processing ? 'Creating...' : 'Create Book Loan'}
                            </Button>
                            <Link href={route('bookloans.index')}>
                                <Button
                                    variant="outline"
                                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
