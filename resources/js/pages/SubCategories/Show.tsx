import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    category: Category | null;
}

interface SubcategoriesShowProps {
    subcategory: Subcategory;
    flash?: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcategories',
        href: '/subcategories',
    },
    {
        title: 'Show',
        href: '',
    },
];

export default function SubcategoriesShow({ subcategory, flash }: SubcategoriesShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this subcategory?')) {
            router.delete(route('subcategories.destroy', { id: subcategory.id }), {
                onSuccess: () => {
                    // Optional: Redirect handled by backend
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Subcategory: ${subcategory.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Subcategory Details</h1>
                {flash?.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>{subcategory.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <strong className="font-semibold">ID: </strong>
                            <span>{subcategory.id}</span>
                        </div>
                        <div>
                            <strong className="font-semibold">Name: </strong>
                            <span>{subcategory.name}</span>
                        </div>
                        <div>
                            <strong className="font-semibold">Category: </strong>
                            {subcategory.category ? (
                                <Link
                                    href={route('categories.show', { id: subcategory.category.id })}
                                    className="text-blue-600 hover:underline"
                                >
                                    {subcategory.category.name}
                                </Link>
                            ) : (
                                <span>Unknown</span>
                            )}
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Link href={route('subcategories.edit', { id: subcategory.id })}>
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Link href={route('subcategories.index')}>
                                <Button variant="outline" size="sm">
                                    Back to Subcategories
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
