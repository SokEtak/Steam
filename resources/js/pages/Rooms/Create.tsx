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
import { CheckCircle2Icon, X, ChevronDown, Building2, Home, Users } from "lucide-react";
import { translations } from "@/utils/translations/room/room";

interface Campus { id: number; name: string; }
interface Building { id: number; name: string; campus_id: number; }
interface Department { id: number; name: string; }

interface RoomsCreateProps {
    campuses: Campus[];
    buildings: Building[];
    departments: Department[];
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function RoomsCreate({
                                        campuses,
                                        buildings,
                                        departments,
                                        flash,
                                        lang = "en",
                                    }: RoomsCreateProps) {
    const t = translations[lang] || translations.en;

    const initialFormData = {
        campus_id: "none",
        building_id: "none",
        department_id: "",
        name: "",
        room_number: "",
        floor: "",
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [openCampus, setOpenCampus] = useState(false);
    const [openBuilding, setOpenBuilding] = useState(false);
    const [openDepartment, setOpenDepartment] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Track form changes
    useEffect(() => {
        const hasChanges = Object.keys(data).some(k => data[k] !== initialFormData[k]);
        setIsDirty(hasChanges);
    }, [data]);

    // Prevent accidental navigation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash?.message]);

    // Filter buildings by selected campus
    const filteredBuildings = useMemo(() => {
        if (data.campus_id === "none") return buildings;
        return buildings.filter(b => b.campus_id.toString() === data.campus_id);
    }, [buildings, data.campus_id]);

    // Selected names
    const selectedCampusName = useMemo(() => {
        if (data.campus_id === "none") return null;
        return campuses.find(c => c.id.toString() === data.campus_id)?.name ?? null;
    }, [data.campus_id, campuses]);

    const selectedBuildingName = useMemo(() => {
        if (data.building_id === "none") return null;
        const b = buildings.find(b => b.id.toString() === data.building_id);
        return b?.name ?? null;
    }, [data.building_id, buildings]);

    const selectedDepartmentName = useMemo(() => {
        if (data.department_id === "none") return null;
        return departments.find(d => d.id.toString() === data.department_id)?.name ?? null;
    }, [data.department_id, departments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...data,
            building_id: data.building_id === "none" ? null : data.building_id,
            // department_id is now REQUIRED → no conversion
        };

        post(route("rooms.store"), {
            data: payload,
            onSuccess: () => {
                reset();
                setIsDirty(false);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleCancel = () => {
        if (isDirty) setShowLeaveDialog(true);
        else router.visit(route("rooms.index"));
    };

    const breadcrumbs = [
        { title: t.indexTitle, href: route("rooms.index") },
        { title: t.createBreadcrumb, href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.createTitle} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold mb-8">{t.createTitle}</h1>

                    {/* Success Alert */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border-blue-200">
                            <CheckCircle2Icon className="h-5 w-5 text-blue-600" />
                            <div>
                                <AlertTitle>{t.createNotification}</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowSuccessAlert(false)} variant="ghost" size="icon">
                                <X />
                            </Button>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-900/50 border-red-200">
                            <CheckCircle2Icon className="h-5 w-5 text-red-600" />
                            <div>
                                <AlertTitle>{t.createError}</AlertTitle>
                                <AlertDescription>{Object.values(errors).join(", ")}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowErrorAlert(false)} variant="ghost" size="icon">
                                <X />
                            </Button>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Campus */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createCampus}</label>
                            <Popover open={openCampus} onOpenChange={setOpenCampus}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedCampusName ?? t.createCampusPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align="start">
                                    <Command>
                                        <CommandInput placeholder={t.createCampusPlaceholder} />
                                        <CommandList>
                                            <CommandEmpty>{t.createCampusEmpty ?? "No campus found."}</CommandEmpty>
                                            <CommandGroup>
                                                {campuses.map(c => (
                                                    <CommandItem
                                                        key={c.id}
                                                        value={c.name}
                                                        onSelect={() => {
                                                            setData("campus_id", c.id.toString());
                                                            setData("building_id", "none"); // Reset building
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

                        {/* Building */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createBuilding}</label>
                            <Popover open={openBuilding} onOpenChange={setOpenBuilding}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-between ${errors.building_id ? "border-red-500" : ""}`}
                                        disabled={data.campus_id === "none"}
                                    >
                                        {selectedBuildingName ?? t.createBuildingPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align="start">
                                    <Command>
                                        <CommandInput placeholder={t.createBuildingPlaceholder} />
                                        <CommandList>
                                            <CommandEmpty>
                                                {filteredBuildings.length === 0
                                                    ? t.createBuildingEmpty
                                                    : t.createBuildingNoMatch}
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
                                                            <Home className="mr-2 h-4 w-4 text-indigo-600" />
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

                        {/* Department (Optional) */}
                        {/* Department (REQUIRED) */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createDepartment}</label>
                            <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-between ${errors.department_id ? "border-red-500" : ""}`}
                                    >
                                        {selectedDepartmentName ?? t.createDepartmentPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align="start">
                                    <Command>
                                        <CommandInput placeholder={t.createDepartmentPlaceholder} />
                                        <CommandList>
                                            <CommandEmpty>
                                                {departments.length === 0
                                                    ? t.createDepartmentEmpty
                                                    : t.createDepartmentNoMatch}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {departments.map(d => (
                                                    <CommandItem
                                                        key={d.id}
                                                        value={d.name}
                                                        onSelect={() => {
                                                            setData("department_id", d.id.toString());
                                                            setOpenDepartment(false);
                                                        }}
                                                    >
                                                        <Users className="mr-2 h-4 w-4 text-indigo-600" />
                                                        {d.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.department_id && <p className="text-red-500 text-sm">{errors.department_id}</p>}
                        </div>

                        {/* Room Name */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createName}</label>
                            <Input
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                                placeholder={t.createNamePlaceholder}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Room Number */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createRoomNumber}</label>
                            <Input
                                value={data.room_number}
                                onChange={e => setData("room_number", e.target.value)}
                                placeholder="A101"
                            />
                            {errors.room_number && <p className="text-red-500 text-sm">{errors.room_number}</p>}
                        </div>

                        {/* Floor */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createFloor}</label>
                            <Input
                                type="number"
                                value={data.floor}
                                onChange={e => setData("floor", e.target.value)}
                                min="0"
                                max="50"
                                placeholder="3"
                            />
                            {errors.floor && <p className="text-red-500 text-sm">{errors.floor}</p>}
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

                    {/* Leave Confirmation */}
                    <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {lang === "kh" ? "តើអ្នកប្រាកដទេ?" : "Are you sure?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {lang === "kh"
                                        ? "អ្នកមានការផ្លាស់ប្តូរដែលមិនបានរក្សាទុក។"
                                        : "You have unsaved changes."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.createCancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.visit(route("rooms.index"))}>
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
