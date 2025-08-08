import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface CategoriesShowProps {
    category: Category;
    flash?: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Show',
        href: '',
    },
];

export default function CategoriesShow({ category, flash }: CategoriesShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('categories.destroy', { id: category.id }), {
                onSuccess: () => {
                    // Optional: Redirect handled by backend
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category: ${category.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Category Details</h1>
                {flash?.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <strong className="font-semibold">ID: </strong>
                            <span>{category.id}</span>
                        </div>
                        <div>
                            <strong className="font-semibold">Name: </strong>
                            <span>{category.name}</span>
                        </div>
                        <div>
                            <strong className="font-semibold">Created At: </strong>
                            <span>{new Date(category.created_at).toLocaleString()}</span>
                        </div>
                        <div>
                            <strong className="font-semibold">Updated At: </strong>
                            <span>{new Date(category.updated_at).toLocaleString()}</span>
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Link href={route('categories.edit', { id: category.id })}>
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
                            <Link href={route('categories.index')}>
                                <Button variant="outline" size="sm">
                                    Back to Categories
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
