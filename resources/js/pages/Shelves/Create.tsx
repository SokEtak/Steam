import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Bookcase {
    id: number;
    code: string;
}

interface ShelvesCreateProps {
    bookcases: Bookcase[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shelves',
        href: route('shelves.index'),
    },
    {
        title: 'Create',
        href: '',
    },
];

export default function ShelvesCreate({ bookcases }: ShelvesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        bookcase_id: 'none',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('shelves.store'), {
            data,
            onSuccess: () => {},
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Shelf" />
            <div className="h-full flex-1 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 col-span-2">Create Shelf</h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</p>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bookcase</p>
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
                        <div className="col-span-2 flex gap-4 mt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                {processing ? 'Creating...' : 'Create Shelf'}
                            </Button>
                            <Link href={route('shelves.index')}>
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
