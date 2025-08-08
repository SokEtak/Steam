import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    category: Category | null;
}

interface SubcategoriesIndexProps {
    subcategories: Subcategory[];
    flash: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcategories',
        href: '/subcategories',
    },
];

export default function SubcategoriesIndex({ subcategories, flash }: SubcategoriesIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this subcategory?')) {
            router.delete(route('subcategories.destroy', { id }), {
                onSuccess: () => {
                    // Optional: Flash message handled by backend
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Of Subcategories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Subcategories({subcategories.length||0})</h1>
                    <Link href={route('subcategories.create')}>
                        <Button variant="default">Create Subcategory</Button>
                    </Link>
                </div>
                {flash.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subcategories.length > 0 ? (
                            subcategories.map((subcategory) => (
                                <TableRow key={subcategory.id}>
                                    <TableCell>{subcategory.id}</TableCell>
                                    <TableCell>{subcategory.name}</TableCell>
                                    <TableCell>
                                        {subcategory.category ? (
                                            <Link
                                                href={route('categories.show', { id: subcategory.category.id })}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {subcategory.category.name}
                                            </Link>
                                        ) : (
                                            'Unknown'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('subcategories.show', { id: subcategory.id })}>
                                                <Button variant="default" size="sm">
                                                    Show
                                                </Button>
                                            </Link>
                                            <Link href={route('subcategories.edit', { id: subcategory.id })}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(subcategory.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No subcategories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
