import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Bookcase {
    id: number;
    code: string;
    books_count: number | null; // Allow null
}

interface BookcasesIndexProps {
    bookcases: Bookcase[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookcases',
        href: '',
    },
];

export default function BookcasesIndex({ bookcases }: BookcasesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookcases" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Bookcases({bookcases.length||0})</h1>
                    <Link href={route('bookcases.create')}>
                        <Button>Create New Bookcase</Button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Number of Books</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookcases.map((bookcase) => (
                                <TableRow key={bookcase.id}>
                                    <TableCell>{bookcase.id}</TableCell>
                                    <TableCell>{bookcase.code}</TableCell>
                                    <TableCell>{bookcase.books_count ?? 0}</TableCell> {/* Fallback to 0 if null */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
