// components/TopBar.tsx
"use client";

import { router } from '@inertiajs/react';
import { Globe, LogOut } from 'lucide-react';
import { useState } from 'react';
import { translations } from '@/utils/translations';

interface AuthUser {
    name: string;
    email: string;
    avatar?: string;
    isVerified?: boolean;
}

interface TopBarProps {
    authUser?: AuthUser | null;
    language: 'en' | 'kh'; // Receive current language
    onLanguageChange: () => void; // Receive handler
}

export default function TopBar({ authUser, language, onLanguageChange }: TopBarProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showEmailTooltip, setShowEmailTooltip] = useState(false);

    const t = translations[language] || translations.en;

    const handleLanguageChange = () => {
        onLanguageChange(); // Call parent handler
        setShowUserMenu(false);
    };

    const handleLogout = () => {
        setShowUserMenu(false);
        router.post('/logout');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-lg py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <img
                            src="/images/DIS(no%20back).png"
                            alt="Library Logo"
                            className="h-14 w-auto transition-transform hover:scale-105"
                        />
                    </a>
                </div>
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLanguageChange}
                        className="flex items-center text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-base font-medium"
                        aria-label={t.switch_language}
                    >
                        <Globe className="w-6 h-6 mr-2" />
                        {t.switch_language}
                    </button>
                    {authUser && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                onMouseEnter={() => setShowEmailTooltip(true)}
                                onMouseLeave={() => setShowEmailTooltip(false)}
                                className="flex items-center"
                                aria-label={`${authUser.name}'s profile`}
                            >
                                <img
                                    src={authUser.avatar ? authUser.avatar : 'https://via.placeholder.com/40'}
                                    alt={authUser.name}
                                    className="h-12 w-12 rounded-full border-2 border-amber-500 hover:scale-105 transition-transform"
                                />
                            </button>
                            {showEmailTooltip && (
                                <div className="absolute right-0 top-[50px] bg-gray-800 text-white text-sm px-3 py-1 rounded-lg shadow-lg z-20">
                                    {authUser.email}
                                </div>
                            )}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-20 border border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={handleLogout}
                                        className="block px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 w-full text-left items-center transition-colors font-medium"
                                        aria-label={t.logout}
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        {t.logout}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
