import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, X, User, Mail, Lock, Building2, Eye, EyeOff, Camera, Upload } from 'lucide-react';
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
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

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
            <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transform transition-all duration-300">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-900 dark:text-gray-100 font-semibold">Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                                    className="pl-10 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2 text-red-600 dark:text-red-400" />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-900 dark:text-gray-100 font-semibold">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="eg. vireaksereyboth@diu.edu.kh"
                                    className="pl-10 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <InputError message={errors.email} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-gray-900 dark:text-gray-100 font-semibold">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                    className="pl-10 pr-10 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            <InputError message={errors.password} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-gray-900 dark:text-gray-100 font-semibold">Confirm password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input
                                    id="password_confirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                    className="pl-10 pr-10 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    aria-label={showPasswordConfirmation ? "Hide password" : "Show password"}
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            <InputError message={errors.password_confirmation} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Campuses */}
                        <div className="grid gap-2">
                            <Label htmlFor="campus_id" className="text-gray-900 dark:text-gray-100 font-semibold">Campus</Label>
                            <Select
                                value={data.campus_id}
                                onValueChange={(value) => setData('campus_id', value)}
                                disabled={processing}
                            >
                                <SelectTrigger id="campus_id" tabIndex={3} className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                    <SelectValue placeholder="Select a campus" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
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
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input
                                    id="code"
                                    type="text"
                                    required
                                    tabIndex={4}
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    disabled={processing}
                                    placeholder="Enter campus code"
                                    className="pl-10 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <InputError message={errors.code} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Image Upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="avatar" className="text-gray-900 dark:text-gray-100 font-semibold">Profile Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative h-24 w-24">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-24 w-24 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all duration-200 cursor-pointer"
                                            onClick={() => setShowPreview(true)}
                                        />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-400 dark:border-gray-600">
                                            <Camera className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={processing}
                                        className="hidden"
                                    />
                                    <Label htmlFor="avatar" className="flex items-center gap-2 cursor-pointer bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                                        <Upload className="h-4 w-4" />
                                        {data.avatar ? data.avatar.name.substring(0, 15) + '...' : 'Choose File'}
                                    </Label>
                                </div>
                            </div>
                            <InputError message={errors.avatar} className="text-red-600 dark:text-red-400" />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                            tabIndex={7}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Create account
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Already have an account?{' '}
                        <TextLink href={route('login')} tabIndex={8} className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 font-medium">
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
