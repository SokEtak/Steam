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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Shelf Details</h1>
                <div className="space-y-4">
                    <div><strong>ID:</strong> {shelf.id}</div>
                    <div><strong>Code:</strong> {shelf.code}</div>
                    <div>
                        <strong>Bookcase:</strong>
                        {shelf.bookcase_id ? (
                            <Link href={route('bookcases.show', shelf.bookcase_id)} className="text-blue-500 underline ml-2">
                                {shelf.bookcase?.code || 'N/A'}
                            </Link>
                        ) : 'N/A'}
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Link href={route('shelves.index')}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
