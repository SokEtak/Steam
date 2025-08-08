import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Bookcase {
    id: number;
    code: string;
}

interface Shelves {
    id: number;
    code: string;
    bookcase_id: number;
    bookcase: Bookcase | null;
    books_count: number; // Added for withCount
}

interface ShelvesIndexProps {
    shelves: Shelves[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shelves',
        href: '',
    },
];

export default function ShelvesIndex({ shelves }: ShelvesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shelves" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Shelves({shelves.length||0})</h1>
                    <Link href={route('shelves.create')}>
                        <Button>Create New Shelf</Button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Bookcase</TableHead>
                                <TableHead>Number of Books</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shelves.map((shelf) => (
                                <TableRow key={shelf.id}>
                                    <TableCell>{shelf.id}</TableCell>
                                    <TableCell>{shelf.code}</TableCell>
                                    <TableCell>
                                        {shelf.bookcase_id ? (
                                            <Link href={route('bookcases.show', shelf.bookcase_id)} className="text-blue-500 underline">
                                                {shelf.bookcase?.code || 'N/A'}
                                            </Link>
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>{shelf.books_count || 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
