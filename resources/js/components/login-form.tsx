import { cn } from "@/lib/utils"
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, AtSign, KeyRound, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    className?: string;
    status?: string;
    canResetPassword: boolean;
    flash?: {
        message?: string;
        error?: string;
        warning?: string;
    };
}

export function LoginForm({
                              className,
                              status,
                              canResetPassword,
                              flash,
                              ...props
                          }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleSocialLogin = (provider: string) => {
        if (provider === 'google') {
            post(route(`login.${provider}`), {
                data: { email: data.email },
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            post(route(`login.${provider}`), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const flashMessage = flash?.message || flash?.error || flash?.warning;
    const isError = flash?.error;
    const isWarning = flash?.warning;

    const MessageIcon = isError ? XCircle : isWarning ? AlertTriangle : CheckCircle2;
    const messageColor = isError ? "text-red-500" : isWarning ? "text-yellow-500" : "text-green-500";
    const messageBg = isError ? "bg-red-50" : isWarning ? "bg-yellow-50" : "bg-green-50";

    return (
        <div className={cn("flex flex-col gap-8 w-full max-w-lg mx-auto", className)} {...props}>
            <Head title="Log in" />
            <Card className="overflow-hidden shadow-lg rounded-2xl">
                <CardContent className="p-0">
                    <form className="p-8 md:p-12 space-y-6" onSubmit={submit}>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Welcome to Dewey Steam</h1>
                            <p className="text-balance text-muted-foreground">
                                Log in to your account to continue
                            </p>
                        </div>

                        {flashMessage && (
                            <div className={cn("flex items-center gap-2 p-3 rounded-lg", messageBg)}>
                                <MessageIcon className={cn("h-5 w-5", messageColor)} />
                                <span className={cn("text-sm font-medium", messageColor)}>
                                    {flashMessage}
                                </span>
                            </div>
                        )}

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold">Email</Label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="eg. vireaksereybot@diu.edu.kh"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1 text-red-500" />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="font-semibold">Password</Label>
                                    {canResetPassword && (
                                        <a
                                            href={route('password.request')}
                                            className="ml-auto text-sm text-blue-600 underline-offset-4 hover:underline"
                                        >
                                            Forgot password?
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pl-10 pr-10"
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
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                <InputError message={errors.password} className="mt-1 text-red-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={() => setData('remember', !data.remember)}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 transition-all duration-300 bg-blue-600 hover:bg-blue-700" disabled={processing}>
                            {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                            Login
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <a href={route('register')} className="font-medium text-blue-600 underline-offset-4 hover:underline">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline underline-offset-4 hover:text-blue-600">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-4 hover:text-blue-600">Privacy Policy</a>.
            </div>
        </div>
    )
}
