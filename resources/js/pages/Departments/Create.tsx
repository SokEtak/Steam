"use client";

import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2Icon, X, ChevronDown, Building2, User } from "lucide-react";
import { translations } from "@/utils/translations/department/department";

interface Campus { id: number; name: string; }
interface Building { id: number; name: string; campus_id: number; }
interface User { id: number; name: string; }

interface DepartmentsCreateProps {
    campuses: Campus[];
    buildings: Building[];
    users: User[];
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function DepartmentsCreate({
                                              campuses,
                                              buildings,
                                              users,
                                              flash,
                                              lang = "en",
                                          }: DepartmentsCreateProps) {
    const t = translations[lang] || translations.en;

    const initialFormData = {
        campus_id: "none",
        building_id: "none",
        name: "",
        code: "",
        head_user_id: "none",
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [openCampus, setOpenCampus] = useState(false);
    const [openBuilding, setOpenBuilding] = useState(false);
    const [openHead, setOpenHead] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Track changes
    useEffect(() => {
        const hasChanges = Object.keys(data).some(k => data[k] !== initialFormData[k]);
        setIsDirty(hasChanges);
    }, [data]);

    // Prevent navigation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) { e.preventDefault(); e.returnValue = ""; }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash?.message]);

    // Filtered buildings: all if no campus, filtered if campus selected
    const filteredBuildings = useMemo(() => {
        if (data.campus_id === "none") return buildings;
        return buildings.filter(b => b.campus_id.toString() === data.campus_id);
    }, [buildings, data.campus_id]);

    // Selected building name
    const selectedBuildingName = useMemo(() => {
        if (data.building_id === "none") return null;
        const b = buildings.find(b => b.id.toString() === data.building_id);
        return b?.name ?? null;
    }, [data.building_id, buildings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("departments.store"), {
            onSuccess: () => { reset(); setIsDirty(false); },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleCancel = () => {
        if (isDirty) setShowLeaveDialog(true);
        else router.visit(route("departments.index"));
    };

    const breadcrumbs = [
        { title: t.indexTitle, href: route("departments.index") },
        { title: t.createBreadcrumb, href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.createTitle} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold mb-8">{t.createTitle}</h1>

                    {/* Alerts */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border-blue-200">
                            <CheckCircle2Icon className="h-5 w-5 text-blue-600" />
                            <div>
                                <AlertTitle>{t.createNotification}</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowSuccessAlert(false)} variant="ghost" size="icon"><X /></Button>
                        </Alert>
                    )}

                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-900/50 border-red-200">
                            <CheckCircle2Icon className="h-5 w-5 text-red-600" />
                            <div>
                                <AlertTitle>{t.createError}</AlertTitle>
                                <AlertDescription>{Object.values(errors).join(", ")}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowErrorAlert(false)} variant="ghost" size="icon"><X /></Button>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Campus */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createCampus}</label>
                            <Popover open={openCampus} onOpenChange={setOpenCampus}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {data.campus_id !== "none" ? campuses.find(c => c.id.toString() === data.campus_id)?.name : t.createCampusPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align={"start"}>
                                    <Command>
                                        <CommandInput placeholder={t.createCampusPlaceholder}/>
                                        <CommandList>
                                            <CommandEmpty>{t.createCampusEmpty ?? "No campus found."}</CommandEmpty>
                                            <CommandGroup>
                                                {campuses.map(c => (
                                                    <CommandItem
                                                        key={c.id}
                                                        value={c.name}
                                                        onSelect={() => {
                                                            setData("campus_id", c.id.toString());
                                                            setOpenCampus(false);
                                                        }}
                                                    >
                                                        <Building2 className="mr-2 h-4 w-4 text-indigo-600" />
                                                        {c.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.campus_id && <p className="text-red-500 text-sm">{errors.campus_id}</p>}
                        </div>

                        {/* Building – ALWAYS ENABLED */}
                        <div className="space-y-2">
                            <label>{t.createBuilding}</label>
                            <Popover open={openBuilding} onOpenChange={setOpenBuilding}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-between ${errors.building_id ? "border-red-500" : ""}`}
                                    >
                                        {selectedBuildingName ?? t.createBuildingPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align={"start"} >
                                    <Command>
                                        <CommandInput placeholder={t.createBuildingPlaceholder} />
                                        <CommandList>
                                            <CommandEmpty>
                                                {filteredBuildings.length === 0 ? t.createBuildingEmpty : t.createBuildingNoMatch}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {filteredBuildings.map(b => {
                                                    const campus = campuses.find(c => c.id === b.campus_id);
                                                    return (
                                                        <CommandItem
                                                            key={b.id}
                                                            value={b.name}
                                                            onSelect={() => {
                                                                setData("building_id", b.id.toString());
                                                                setOpenBuilding(false);
                                                            }}
                                                        >
                                                            <Building2 className="mr-2 h-4 w-4 text-indigo-600" />
                                                            <div className="flex-1">{b.name}</div>
                                                            <span className="ml-auto text-xs text-gray-500">
                                                                {campus?.name}
                                                            </span>
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.building_id && <p className="text-red-500 text-sm">{errors.building_id}</p>}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createName}</label>
                            <Input value={data.name} onChange={e => setData("name", e.target.value)} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Code */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createCode}</label>
                            <Input value={data.code} onChange={e => setData("code", e.target.value)} />
                            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                        </div>

                        {/* Head */}
                        <div className="space-y-2">
                            <label>{t.createHead}</label>
                            <Popover open={openHead} onOpenChange={setOpenHead}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {data.head_user_id !== "none" ? users.find(u => u.id.toString() === data.head_user_id)?.name : t.createHeadPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align={"start"}>
                                    <Command>
                                        <CommandInput placeholder={t.createHeadPlaceholder} />
                                        <CommandList>
                                            <CommandEmpty>{t.createHeadEmpty ?? "No user found."}</CommandEmpty>
                                            <CommandGroup>
                                                {users.map(u => (
                                                    <CommandItem
                                                        key={u.id}
                                                        value={u.name}
                                                        onSelect={() => {
                                                            setData("head_user_id", u.id.toString());
                                                            setOpenHead(false);
                                                        }}
                                                    >
                                                        <User className="mr-2 h-4 w-4 text-indigo-600" />
                                                        <div className="flex-1">{u.name}</div>
                                                        <Link
                                                            href={route("users.show", u.id)}
                                                            className="ml-auto text-xs text-indigo-500 hover:underline"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            View
                                                        </Link>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.head_user_id && <p className="text-red-500 text-sm">{errors.head_user_id}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button type="submit" disabled={processing}>
                                {processing ? t.createCreating : t.createCreate}
                            </Button>
                            <Button variant="outline" onClick={handleCancel} disabled={processing}>
                                {t.createCancel}
                            </Button>
                        </div>
                    </form>

                    <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{lang === "kh" ? "តើអ្នកប្រាកដទេ?" : "Are you sure?"}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {lang === "kh" ? "អ្នកមានការផ្លាស់ប្តូរដែលមិនបានរក្សាទុក។" : "You have unsaved changes."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.createCancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.visit(route("departments.index"))}>
                                    {lang === "kh" ? "ចាកចេញ" : "Leave"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AppLayout>
    );
}
