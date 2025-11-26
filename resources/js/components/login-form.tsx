import { cn } from "@/lib/utils"
import { Head, useForm } from '@inertiajs/react'
import { LoaderCircle, AtSign, KeyRound, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle, Cloud, Chrome, Github } from 'lucide-react'
import { FormEventHandler, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from '@/components/input-error'
import { Checkbox } from '@/components/ui/checkbox'

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

export function LoginForm({ className, status, canResetPassword, flash, ...props }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    })

    const [showPassword, setShowPassword] = useState(false)

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    // Google OAuth
    const handleGoogleLogin = () => {
        window.location.href = route('auth.google')
    }

    // GitHub OAuth
    const handleGithubLogin = () => {
        window.location.href = route('auth.github')
    }

    const flashMessage = flash?.message || flash?.error || flash?.warning
    const isError = flash?.error
    const isWarning = flash?.warning

    const MessageIcon = isError ? XCircle : isWarning ? AlertTriangle : CheckCircle2
    const messageColor = isError ? "text-red-600" : isWarning ? "text-yellow-700" : "text-green-600"
    const messageBg = isError ? "bg-red-50/70" : isWarning ? "bg-yellow-50/70" : "bg-green-50/70"

    return (
        <div className={cn("flex flex-col gap-8 w-full max-w-sm mx-auto", className)} {...props}>
            <Head title="Log in" />
            <Card className="overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-black/20 rounded-xl border-none">
                <CardContent className="p-0">
                    <form className="p-8 space-y-7" onSubmit={submit}>

                        {/* Title */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Cloud className="h-8 w-8 text-blue-600 animate-pulse" />
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">Welcome Back!</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Log in to your account to continue</p>
                        </div>

                        {/* Flash Messages */}
                        {flashMessage && (
                            <div className={cn("flex items-center gap-3 p-3 rounded-lg border", messageBg)}>
                                <MessageIcon className={cn("h-5 w-5", messageColor)} />
                                <span className={cn("text-sm font-medium", messageColor)}>{flashMessage}</span>
                            </div>
                        )}

                        {/* OAuth Buttons */}
                        <div className="space-y-3">
                            {/* Google */}
                            <Button type="button" variant="outline" className="w-full h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold" onClick={handleGoogleLogin}>
                                <Chrome className="h-4 w-4 mr-2" /> Sign in with Google
                            </Button>

                            {/* GitHub */}
                            {/*<Button type="button" variant="outline" className="w-full h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold" onClick={handleGithubLogin}>*/}
                            {/*    <Github className="h-4 w-4 mr-2" /> Sign in with GitHub*/}
                            {/*</Button>*/}
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400 font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input id="email" type="email" required autoFocus autoComplete="email" placeholder="you@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} className="pl-10 h-10 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-50" />
                            </div>
                            <InputError message={errors.email} className="mt-1 text-sm text-red-500" />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password" className="font-semibold text-gray-700 dark:text-gray-300">Password</Label>
                                {canResetPassword && (
                                    <a href={route('password.request')} className="ml-auto text-sm text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline transition">Forgot password?</a>
                                )}
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="pl-10 pr-10 h-10 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-50" />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            <InputError message={errors.password} className="mt-1 text-sm text-red-500" />
                        </div>

                        {/* Remember */}
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" name="remember" checked={data.remember} onCheckedChange={() => setData('remember', !data.remember)} className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white" />
                            <Label htmlFor="remember" className="text-gray-700 dark:text-gray-300">Remember me</Label>
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full h-11 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/50 dark:shadow-blue-900/50" disabled={processing}>
                            {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />} Log In
                        </Button>

                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                            Don’t have an account? <a href={route('register')} className="font-medium text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline transition">Sign up</a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
