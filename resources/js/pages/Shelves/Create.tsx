import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Bookcase {
    id: number;
    code: string;
}

interface ShelvesCreateProps {
    bookcases: Bookcase[];
    flash?: {
        message: string | null;
    };
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

export default function ShelvesCreate({ bookcases, flash }: ShelvesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        bookcase_id: '',
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Create Shelf</h1>
                {flash?.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Label htmlFor="bookcase_id">Bookcase</Label>
                        <Select
                            onValueChange={(value) => setData('bookcase_id', value)}
                            value={data.bookcase_id}
                        >
                            <SelectTrigger id="bookcase_id" className={errors.bookcase_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a bookcase" />
                            </SelectTrigger>
                            <SelectContent>
                                {bookcases.map((bookcase) => (
                                    <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
                                        {bookcase.code}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.bookcase_id && <p className="text-red-500 text-sm">{errors.bookcase_id}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Shelf'}
                        </Button>
                        <Link href={route('shelves.index')}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
