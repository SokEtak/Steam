import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
}

interface Bookcase {
    id: number;
    code: string;
}

interface Shelves {
    id: number;
    code: string;
}

interface BooksCreateProps {
    users: User[];
    categories: Category[];
    subcategories: Subcategory[];
    bookcases: Bookcase[];
    shelves: Shelves[];
    flash?: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Books', href: route('books.index') },
    { title: 'Create', href: '' },
];

export default function BooksCreate({
                                        users,
                                        categories,
                                        subcategories,
                                        bookcases,
                                        shelves,
                                        flash,
                                    }: BooksCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        flip_link: '',
        code: '',
        isbn: '',
        view: '0',
        is_available: false,
        user_id: '',
        category_id: '',
        subcategory_id: 'none',
        bookcase_id: 'none',
        shelf_id: 'none',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('books.store'), { data, onSuccess: () => {} });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Book" />
            <div className="h-full flex-1 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 col-span-2">Create Book</h1>
                    {flash?.message && (
                        <Alert className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 rounded-lg col-span-2 mt-4">
                            <AlertDescription className="text-sm">{flash.message}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="flip_link" className="text-sm font-medium text-gray-700 dark:text-gray-300">Flip Link</Label>
                            <Input
                                id="flip_link"
                                value={data.flip_link}
                                onChange={(e) => setData('flip_link', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.flip_link ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.flip_link && <p className="text-red-500 text-sm">{errors.flip_link}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="isbn" className="text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</Label>
                            <Input
                                id="isbn"
                                value={data.isbn}
                                onChange={(e) => setData('isbn', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.isbn ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="view" className="text-sm font-medium text-gray-700 dark:text-gray-300">Views</Label>
                            <Input
                                id="view"
                                type="number"
                                value={data.view}
                                onChange={(e) => setData('view', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.view ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.view && <p className="text-red-500 text-sm">{errors.view}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="is_available" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</Label>
                            <Select
                                value={data.is_available ? 'true' : 'false'}
                                onValueChange={(value) => setData('is_available', value === 'true')}
                                className={errors.is_available ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.is_available && <p className="text-red-500 text-sm">{errors.is_available}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">User</Label>
                            <Select
                                value={data.user_id}
                                onValueChange={(value) => setData('user_id', value)}
                                className={errors.user_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) => setData('category_id', value)}
                                className={errors.category_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
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
                        <div className="space-y-2">
                            <Label htmlFor="subcategory_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory</Label>
                            <Select
                                value={data.subcategory_id}
                                onValueChange={(value) => setData('subcategory_id', value)}
                                className={errors.subcategory_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select a subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {subcategories.map((subcategory) => (
                                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                            {subcategory.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.subcategory_id && <p className="text-red-500 text-sm">{errors.subcategory_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bookcase_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bookcase</Label>
                            <Select
                                value={data.bookcase_id}
                                onValueChange={(value) => setData('bookcase_id', value)}
                                className={errors.bookcase_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select a bookcase" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {bookcases.map((bookcase) => (
                                        <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
                                            {bookcase.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.bookcase_id && <p className="text-red-500 text-sm">{errors.bookcase_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shelf_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Shelf</Label>
                            <Select
                                value={data.shelf_id}
                                onValueChange={(value) => setData('shelf_id', value)}
                                className={errors.shelf_id ? 'border-red-500' : ''}
                            >
                                <SelectTrigger className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select a shelf" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {shelves.map((shelf) => (
                                        <SelectItem key={shelf.id} value={shelf.id.toString()}>
                                            {shelf.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.shelf_id && <p className="text-red-500 text-sm">{errors.shelf_id}</p>}
                        </div>
                        <div className="col-span-2 flex gap-4 mt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                {processing ? 'Creating...' : 'Create Book'}
                            </Button>
                            <Link href={route('books.index')}>
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
