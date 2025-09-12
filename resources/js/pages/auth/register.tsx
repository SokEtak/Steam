import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar: File | null;
    campus_id: string;
    code: string;
};

export default function Register({ campus }: { campus: { id: number; name: string }[] }) {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
        campus_id: '',
        code: '',
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('avatar', file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation', 'avatar', 'code');
                setPreview(null);
                setShowPreview(false);
            },
        });
    };

    return (
        <AuthLayout title="Create a Dewey-Steam Account" description="Join us by filling out the details below">
            <Head title="Register" />
            <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-900 dark:text-gray-100 font-semibold">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.name} className="mt-2 text-red-600 dark:text-red-400" />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-900 dark:text-gray-100 font-semibold">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="vireaksereyboth@diu.edu.kh"
                                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.email} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-gray-900 dark:text-gray-100 font-semibold">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={5}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.password} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-gray-900 dark:text-gray-100 font-semibold">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={6}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.password_confirmation} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Campus */}
                        <div className="grid gap-2">
                            <Label htmlFor="campus_id" className="text-gray-900 dark:text-gray-100 font-semibold">Campus</Label>
                            <Select
                                value={data.campus_id}
                                onValueChange={(value) => setData('campus_id', value)}
                                disabled={processing}
                            >
                                <SelectTrigger id="campus_id" tabIndex={3} className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                    <SelectValue placeholder="Select a campus" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                                    {campus.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.campus_id} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Code */}
                        <div className="grid gap-2">
                            <Label htmlFor="code" className="text-gray-900 dark:text-gray-100 font-semibold">Campus Code</Label>
                            <Input
                                id="code"
                                type="text"
                                required
                                tabIndex={4}
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                disabled={processing}
                                placeholder="Enter campus code"
                                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.code} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Image Upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="avatar" className="text-gray-900 dark:text-gray-100 font-semibold">Profile Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={processing}
                                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.avatar} className="text-red-600 dark:text-red-400" />

                            {/* Thumbnail */}
                            {preview && (
                                <div className="relative mt-2 h-24 w-24">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-24 w-24 rounded-full object-cover border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                        onClick={() => setShowPreview(true)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="mt-4 w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                            tabIndex={7}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Create account
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Already have an account?{' '}
                        <TextLink href={route('login')} tabIndex={8} className="text-teal-600 dark:text-teal-500 hover:text-teal-800 dark:hover:text-teal-400 font-medium">
                            Log in
                        </TextLink>
                    </div>
                </form>
            </div>

            {/* Modal Preview */}
            {showPreview && preview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 dark:bg-opacity-90"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 dark:hover:text-gray-400 transition-colors duration-200"
                            onClick={() => setShowPreview(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <img
                            src={preview}
                            alt="Full Preview"
                            className="max-h-[80vh] max-w-[90vw] rounded-xl border border-gray-300 dark:border-gray-600 shadow-2xl object-contain"
                        />
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
