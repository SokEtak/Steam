import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface Book {
    id: number;
    title: string;
    flip_link: string;
    code: string;
    isbn: string;
    view: string;
    is_available: boolean;
    user_id: number;
    category_id: number;
    subcategory_id: number | null;
    bookcase_id: number | null;
    shelf_id: number | null;
}

interface BooksEditProps {
    book: Book;
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
    {
        title: 'Books',
        href: route('books.index'),
    },
    {
        title: 'Edit',
        href: '',
    },
];

export default function BooksEdit({
                                      book,
                                      users,
                                      categories,
                                      subcategories,
                                      bookcases,
                                      shelves,
                                      flash,
                                  }: BooksEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: book.title,
        flip_link: book.flip_link,
        code: book.code,
        isbn: book.isbn,
        view: book.view,
        is_available: book.is_available,
        user_id: book.user_id.toString(),
        category_id: book.category_id.toString(),
        subcategory_id: book.subcategory_id?.toString() || 'none', // Use 'none' if null
        bookcase_id: book.bookcase_id?.toString() || 'none',       // Use 'none' if null
        shelf_id: book.shelf_id?.toString() || 'none',            // Use 'none' if null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('books.update', book.id), {
            data,
            onSuccess: () => {},
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Book" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Edit Book</h1>
                {flash?.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>
                    <div>
                        <Label htmlFor="flip_link">Flip Link</Label>
                        <Input
                            id="flip_link"
                            value={data.flip_link}
                            onChange={(e) => setData('flip_link', e.target.value)}
                            className={errors.flip_link ? 'border-red-500' : ''}
                        />
                        {errors.flip_link && <p className="text-red-500 text-sm">{errors.flip_link}</p>}
                    </div>
                    <div>
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                    </div>
                    <div>
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input
                            id="isbn"
                            value={data.isbn}
                            onChange={(e) => setData('isbn', e.target.value)}
                            className={errors.isbn ? 'border-red-500' : ''}
                        />
                        {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
                    </div>
                    <div>
                        <Label htmlFor="view">Views</Label>
                        <Input
                            id="view"
                            value={data.view}
                            onChange={(e) => setData('view', e.target.value)}
                            className={errors.view ? 'border-red-500' : ''}
                        />
                        {errors.view && <p className="text-red-500 text-sm">{errors.view}</p>}
                    </div>
                    <div>
                        <Label htmlFor="is_available">Available</Label>
                        <select
                            id="is_available"
                            value={data.is_available ? 'true' : 'false'}
                            onChange={(e) => setData('is_available', e.target.value === 'true')}
                            className={errors.is_available ? 'border-red-500' : ''}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        {errors.is_available && <p className="text-red-500 text-sm">{errors.is_available}</p>}
                    </div>
                    <div>
                        <Label htmlFor="user_id">User</Label>
                        <Select
                            onValueChange={(value) => setData('user_id', value)}
                            value={data.user_id}
                        >
                            <SelectTrigger id="user_id" className={errors.user_id ? 'border-red-500' : ''}>
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
                    <div>
                        <Label htmlFor="subcategory_id">Subcategory</Label>
                        <Select
                            onValueChange={(value) => setData('subcategory_id', value)}
                            value={data.subcategory_id}
                        >
                            <SelectTrigger id="subcategory_id" className={errors.subcategory_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a subcategory or none" />
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
                    <div>
                        <Label htmlFor="bookcase_id">Bookcase</Label>
                        <Select
                            onValueChange={(value) => setData('bookcase_id', value)}
                            value={data.bookcase_id}
                        >
                            <SelectTrigger id="bookcase_id" className={errors.bookcase_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a bookcase or none" />
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
                    <div>
                        <Label htmlFor="shelf_id">Shelf</Label>
                        <Select
                            onValueChange={(value) => setData('shelf_id', value)}
                            value={data.shelf_id}
                        >
                            <SelectTrigger id="shelf_id" className={errors.shelf_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a shelf or none" />
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
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                        <Link href={route('books.show', book.id)}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
