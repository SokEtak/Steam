import { Globe, Library, BookOpen, ArrowLeft } from "lucide-react";
import { route } from "ziggy-js";

const Button = ({ children, className, ...props }) => (
    <button
        type="button"
        className={`px-4 py-2 font-semibold rounded-lg ${className}`}
        {...props}
    >
        {children}
    </button>
);

const Link = ({ href, children, ...props }) => (
    <a href={href} {...props}>
        {children}
    </a>
);

interface DashboardTypeProps {}

const DashboardType: React.FC<DashboardTypeProps> = ({ auth, canRegister }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-sky-100 to-lime-100 dark:from-gray-900 dark:via-purple-950 dark:to-blue-900 transition-colors duration-700 flex items-center justify-center py-12">
            <div className="container mx-auto px-4">
                <div className="text-center">

                    {/* Logo */}
                    <a href="/" className="inline-block mb-10 transition-transform duration-300 hover:scale-105">
                        <img
                            src="/images/DIS(no back).png"
                            alt="Dewey International School Library Logo"
                            className="h-30 w-auto"
                        />
                    </a>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pink-600 dark:text-yellow-300 mb-6 transition-colors duration-500 leading-20">
                        សូមស្វាគមន៍មកកាន់បណ្ណាល័យរបស់សាលាអន្តរជាតិ ឌូវី
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto transition-colors duration-300 animate-in fade-in slide-in-from-top-4 delay-150 duration-500">
                        ជ្រើសរើសបណ្ណាល័យដែលអ្នកចូលចិត្ត ដើម្បីស្វែងយល់ពីសៀវភៅ និងធនធានរបស់យើងខ្ញុំ
                    </p>

                    {/* Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12 animate-in fade-in duration-700 delay-300">

                        {/* 1. Global Library */}
                        <Link href={route("global library")} className="group block" style={{ animationDelay: "300ms" }}>
                            <div className="h-full flex flex-col justify-between bg-cyan-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-transparent transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 group-hover:border-cyan-500 group-hover:shadow-[0_25px_50px_-12px_rgba(6,182,212,0.5)] dark:group-hover:shadow-[0_25px_50px_-12px_rgba(45,212,191,0.6)]">
                                <div className="flex flex-col items-center space-y-5">
                                    <div className="p-4 bg-cyan-100 dark:bg-cyan-900 rounded-full transition-all duration-300 group-hover:bg-cyan-300 dark:group-hover:bg-cyan-700 group-hover:ring-8 group-hover:ring-cyan-500/50">
                                        <Globe className="w-10 h-10 text-cyan-600 dark:text-cyan-400 transition-colors duration-300 group-hover:scale-110" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">បណ្ណាល័យសកល</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-center transition-colors duration-300 h-10 flex items-center justify-center">
                                        ស្វែងរកសៀវភៅទាំងអស់នៅគ្រប់សាខា
                                    </p>
                                </div>
                                <Button className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white transition-all duration-300 shadow-xl group-hover:shadow-cyan-500/50">
                                    ចូលប្រើ
                                </Button>
                            </div>
                        </Link>

                        {/* 2. Local Library */}
                        <Link href={route("local library")} className="group block" style={{ animationDelay: "500ms" }}>
                            <div className="h-full flex flex-col justify-between bg-yellow-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-transparent transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 group-hover:border-yellow-500 group-hover:shadow-[0_25px_50px_-12px_rgba(234,179,8,0.5)] dark:group-hover:shadow-[0_25px_50px_-12px_rgba(251,191,36,0.6)]">
                                <div className="flex flex-col items-center space-y-5">
                                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full transition-all duration-300 group-hover:bg-yellow-300 dark:group-hover:bg-yellow-700 group-hover:ring-8 group-hover:ring-yellow-500/50">
                                        <Library className="w-10 h-10 text-yellow-600 dark:text-yellow-400 transition-colors duration-300 group-hover:scale-110" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">បណ្ណាល័យក្នុងសាខា</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-center transition-colors duration-300 h-10 flex items-center justify-center">
                                        រកមើលសៀវភៅនៃសាខារបស់លោកអ្នក
                                    </p>
                                </div>
                                <Button className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-gray-800 hover:text-white transition-all duration-300 shadow-xl group-hover:shadow-yellow-500/50">
                                    ចូលប្រើ
                                </Button>
                            </div>
                        </Link>

                        {/* 3. E-Library */}
                        <Link href={route("global e-library")} className="group block" style={{ animationDelay: "700ms" }}>
                            <div className="h-full flex flex-col justify-between bg-rose-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-transparent transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 group-hover:border-rose-500 group-hover:shadow-[0_25px_50px_-12px_rgba(244,63,94,0.5)] dark:group-hover:shadow-[0_25px_50px_-12px_rgba(251,113,133,0.6)]">
                                <div className="flex flex-col items-center space-y-5">
                                    <div className="p-4 bg-rose-100 dark:bg-rose-900 rounded-full transition-all duration-300 group-hover:bg-rose-300 dark:group-hover:bg-rose-700 group-hover:ring-8 group-hover:ring-rose-500/50">
                                        <BookOpen className="w-10 h-10 text-rose-600 dark:text-rose-400 transition-colors duration-300 group-hover:scale-110" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-rose-600 dark:group-hover:text-rose-400">បណ្ណាល័យអេឡិចត្រូនិក</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-center transition-colors duration-300 h-10 flex items-center justify-center">
                                        សៀវភៅឌីជីថលដែលអាចប្រើបាន
                                    </p>
                                </div>
                                <Button className="mt-8 w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white transition-all duration-300 shadow-xl group-hover:shadow-rose-500/50">
                                    ចូលប្រើ
                                </Button>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardType;
