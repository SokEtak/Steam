import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface SubcategoriesEditProps {
    subcategory: Subcategory;
    categories: Category[];
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
        title: 'Edit',
        href: '',
    },
];

export default function SubcategoriesEdit({ subcategory, categories, flash }: SubcategoriesEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: subcategory.name,
        category_id: subcategory.category ? subcategory.category.id.toString() : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('subcategories.update', { id: subcategory.id }), {
            onSuccess: () => {
                // Optional: Redirect or reset handled by backend
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Subcategory" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Edit Subcategory</h1>
                {flash?.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            onValueChange={(value) => setData('category_id', value)}
                            value={data.category_id}
                        >
                            <SelectTrigger id="category_id" className={errors.category_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Subcategory'}
                        </Button>
                        <Link href={route('subcategories.index')}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
