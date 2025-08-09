import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Bookcase {
    id: number;
    code: string;
}

interface Shelves {
    id: number;
    code: string;
    bookcase_id: number;
    bookcase: Bookcase | null;
    books_count: number;
}

interface ShelvesShowProps {
    shelf: Shelves;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shelves',
        href: route('shelves.index'),
    },
    {
        title: 'Show',
        href: '',
    },
];

export default function ShelvesShow({ shelf }: ShelvesShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shelf Details" />
            <div className="h-full flex-1 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 col-span-2">Shelf Details</h1>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ID</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{shelf.id}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{shelf.code}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bookcase</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                {shelf.bookcase_id ? (
                                    <Link
                                        href={route('bookcases.show', shelf.bookcase_id)}
                                        className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {shelf.bookcase?.code || 'N/A'}
                                    </Link>
                                ) : (
                                    <span className="text-red-500 dark:text-red-400">N/A</span>
                                )}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Number of Books</p>
                            <p className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">{shelf.books_count || 0}</p>
                        </div>
                    </div>
                    <div className="col-span-2 flex gap-4 mt-6">
                        <Link href={route('shelves.edit', { id: shelf.id })}>
                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Edit
                            </Button>
                        </Link>
                        <Link href={route('shelves.index')}>
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
