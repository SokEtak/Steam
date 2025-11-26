// resources/js/Pages/AssetTransactions/Create.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle2Icon, X, ChevronDown, Package, User, Building, DoorOpen, ArrowRight } from "lucide-react";
import { useForm } from '@inertiajs/react';

interface Asset { id: number; name: string; }
interface User { id: number; name: string; }
interface Department { id: number; name: string; }
interface Room { id: number; name: string; }

interface AssetTransactionsCreateProps {
    assets: Asset[];
    users: User[];
    departments: Department[];
    rooms: Room[];
    flash?: { message?: string };
}

export default function AssetTransactionsCreate({
                                                    assets, users, departments, rooms, flash
                                                }: AssetTransactionsCreateProps) {

    const initialFormData = {
        asset_id: "",
        type: "",
        performed_by: "",
        performed_at: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Phnom_Penh' }).slice(0, 16),
        from_department_id: "",
        to_department_id: "",
        from_room_id: "",
        to_room_id: "",
        note: ""
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [isDirty, setIsDirty] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);

    const [openAsset, setOpenAsset] = useState(false);
    const [openPerformer, setOpenPerformer] = useState(false);
    const [openFromDept, setOpenFromDept] = useState(false);
    const [openToDept, setOpenToDept] = useState(false);
    const [openFromRoom, setOpenFromRoom] = useState(false);
    const [openToRoom, setOpenToRoom] = useState(false);

    useEffect(() => {
        const hasChanges = Object.keys(data).some(k => data[k] !== initialFormData[k as keyof typeof initialFormData]);
        setIsDirty(hasChanges);
    }, [data]);

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

    const selectedNames = useMemo(() => ({
        asset: assets.find(a => a.id.toString() === data.asset_id)?.name,
        performer: users.find(u => u.id.toString() === data.performed_by)?.name,
        fromDept: departments.find(d => d.id.toString() === data.from_department_id)?.name,
        toDept: departments.find(d => d.id.toString() === data.to_department_id)?.name,
        fromRoom: rooms.find(r => r.id.toString() === data.from_room_id)?.name,
        toRoom: rooms.find(r => r.id.toString() === data.to_room_id)?.name,
    }), [data, assets, users, departments, rooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("asset-transactions.store"), {
            onSuccess: () => { reset(); setIsDirty(false); },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleCancel = () => {
        if (isDirty) setShowLeaveDialog(true);
        else router.visit(route("asset-transactions.index"));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: "ការផ្លាស់ប្តូរទ្រព្យសកម្ម", href: route("asset-transactions.index") },
            { title: "បង្កើតថ្មី", href: "" },
        ]}>
            <Head title="បង្កើតការផ្លាស់ប្តូរទ្រព្យសកម្ម" />

            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold mb-8 text-center">
                        បង្កើតការផ្លាស់ប្តូរទ្រព្យសកម្ម
                    </h1>

                    {/* សារ Success / Error */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border-blue-200">
                            <CheckCircle2Icon className="h-5 w-5 text-blue-600" />
                            <div>
                                <AlertTitle>ជោគជ័យ!</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowSuccessAlert(false)} variant="ghost" size="icon"><X /></Button>
                        </Alert>
                    )}
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-900/50 border-red-200">
                            <CheckCircle2Icon className="h-5 w-5 text-red-600" />
                            <div>
                                <AlertTitle>មានបញ្ហា</AlertTitle>
                                <AlertDescription>{Object.values(errors).join(", ")}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowErrorAlert(false)} variant="ghost" size="icon"><X /></Button>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* ជួរខាងលើ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ទ្រព្យសកម្ម */}
                            <div className="space-y-2">
                                <label><span className="text-red-500">*</span> ទ្រព្យសកម្ម</label>
                                <Popover open={openAsset} onOpenChange={setOpenAsset}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedNames.asset || "ជ្រើសរើសទ្រព្យសកម្ម"}
                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="ស្វែងរកទ្រព្យសកម្ម..." />
                                            <CommandList>
                                                <CommandEmpty>រកមិនឃើញទេ</CommandEmpty>
                                                <CommandGroup>
                                                    {assets.map(asset => (
                                                        <CommandItem key={asset.id} value={asset.name} onSelect={() => {
                                                            setData("asset_id", asset.id.toString());
                                                            setOpenAsset(false);
                                                        }}>
                                                            <Package className="mr-2 h-4 w-4" />
                                                            {asset.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.asset_id && <p className="text-red-500 text-sm">{errors.asset_id}</p>}
                            </div>

                            {/* ប្រភេទ */}
                            <div className="space-y-2">
                                <label><span className="text-red-500">*</span> ប្រភេទ</label>
                                <Select value={data.type} onValueChange={(v) => setData("type", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="ជ្រើសរើសប្រភេទ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="received">ទទួល</SelectItem>
                                        <SelectItem value="allocated">ចែកចាយ</SelectItem>
                                        <SelectItem value="returned">ប្រគល់វិញ</SelectItem>
                                        <SelectItem value="transfer">ផ្ទេរ</SelectItem>
                                        <SelectItem value="maintenance_start">ចាប់ផ្ដើមជួសជុល</SelectItem>
                                        <SelectItem value="maintenance_end">បញ្ចប់ជួសជុល</SelectItem>
                                        <SelectItem value="disposed">បោះចោល</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                            </div>

                            {/* អ្នកធ្វើការ */}
                            <div className="space-y-2">
                                <label><span className="text-red-500">*</span> អ្នកធ្វើការ</label>
                                <Popover open={openPerformer} onOpenChange={setOpenPerformer}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedNames.performer || "ជ្រើសរើសអ្នកធ្វើការ"}
                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="ស្វែងរកអ្នកប្រើប្រាស់..." />
                                            <CommandList>
                                                <CommandEmpty>រកមិនឃើញទេ</CommandEmpty>
                                                <CommandGroup>
                                                    {users.map(user => (
                                                        <CommandItem key={user.id} value={user.name} onSelect={() => {
                                                            setData("performed_by", user.id.toString());
                                                            setOpenPerformer(false);
                                                        }}>
                                                            <User className="mr-2 h-4 w-4" />
                                                            {user.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.performed_by && <p className="text-red-500 text-sm">{errors.performed_by}</p>}
                            </div>

                            {/* កាលបរិច្ឆេទនិងម៉ោង */}
                            <div className="space-y-2">
                                <label><span className="text-red-500">*</span> កាលបរិច្ឆេទនិងម៉ោង</label>
                                <Input type="datetime-local" value={data.performed_at} onChange={e => setData("performed_at", e.target.value)} />
                                {errors.performed_at && <p className="text-red-500 text-sm">{errors.performed_at}</p>}
                            </div>
                        </div>

                        {/* ពី → ទៅ */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3">
                                    <ArrowRight className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* ពី (FROM) */}
                                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-6 text-center">ពី</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">នាយកដ្ឋាន</label>
                                            <Popover open={openFromDept} onOpenChange={setOpenFromDept}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                                        {selectedNames.fromDept || "ជ្រើសរើសនាយកដ្ឋាន"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="ស្វែងរកនាយកដ្ឋាន..." />
                                                        <CommandList>
                                                            <CommandEmpty>រកមិនឃើញទេ</CommandEmpty>
                                                            <CommandGroup>
                                                                {departments.map(dept => (
                                                                    <CommandItem key={dept.id} value={dept.name} onSelect={() => {
                                                                        setData("from_department_id", dept.id.toString());
                                                                        setOpenFromDept(false);
                                                                    }}>
                                                                        <Building className="mr-2 h-4 w-4 text-red-600" />
                                                                        {dept.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">បន្ទប់</label>
                                            <Popover open={openFromRoom} onOpenChange={setOpenFromRoom}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                                        {selectedNames.fromRoom || "ជ្រើសរើសបន្ទប់"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="ស្វែងរកបន្ទប់..." />
                                                        <CommandList>
                                                            <CommandEmpty>រកមិនឃើញទេ</CommandEmpty>
                                                            <CommandGroup>
                                                                {rooms.map(room => (
                                                                    <CommandItem key={room.id} value={room.name} onSelect={() => {
                                                                        setData("from_room_id", room.id.toString());
                                                                        setOpenFromRoom(false);
                                                                    }}>
                                                                        <DoorOpen className="mr-2 h-4 w-4 text-red-600" />
                                                                        {room.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>

                                {/* ទៅ (TO) */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                                    <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-6 text-center">ទៅ</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">នាយកដ្ឋាន</label>
                                            <Popover open={openToDept} onOpenChange={setOpenToDept}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                                        {selectedNames.toDept || "ជ្រើសរើសនាយកដ្ឋាន"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="ស្វែងរកនាយកដ្ឋាន..." />
                                                        <CommandList>
                                                            <CommandEmpty>រកមិនឃើញទេ</CommandEmpty>
                                                            <CommandGroup>
                                                                {departments.map(dept => (
                                                                    <CommandItem key={dept.id} value={dept.name} onSelect={() => {
                                                                        setData("to_department_id", dept.id.toString());
                                                                        setOpenToDept(false);
                                                                    }}>
                                                                        <Building className="mr-2 h-4 w-4 text-green-600" />
                                                                        {dept.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">បន្ទប់</label>
                                            <Popover open={openToRoom} onOpenChange={setOpenToRoom}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                                        {selectedNames.toRoom || "ជ្រើសរើសបន្ទប់"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="ស្វែងរកបន្ទប់..." />
                                                        <CommandList>
                                                            <CommandEmpty>រកមិនឃើញទេ</CommandEmpty>
                                                            <CommandGroup>
                                                                {rooms.map(room => (
                                                                    <CommandItem key={room.id} value={room.name} onSelect={() => {
                                                                        setData("to_room_id", room.id.toString());
                                                                        setOpenToRoom(false);
                                                                    }}>
                                                                        <DoorOpen className="mr-2 h-4 w-4 text-green-600" />
                                                                        {room.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* កំណត់ចំណាំ */}
                        <div className="space-y-2">
                            <label>កំណត់ចំណាំ</label>
                            <Textarea
                                value={data.note}
                                onChange={e => setData("note", e.target.value)}
                                placeholder="បញ្ចូលកំណត់ចំណាំបន្ថែម (មិនបង្ខំ)"
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* ប៊ូតុង */}
                        <div className="flex justify-end gap-4 pt-8">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing || !data.asset_id || !data.type || !data.performed_by}
                            >
                                {processing ? "កំពុងបង្កើត..." : "បង្កើត"}
                            </Button>
                            <Button variant="outline" size="lg" onClick={handleCancel} disabled={processing}>
                                បោះបង់
                            </Button>
                        </div>
                    </form>

                    {/* បញ្ជាក់មុនចាកចេញ */}
                    <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>ចាកចេញដោយមិនរក្សាទុក?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    អ្នកមានការបំពេញដែលមិនបានរក្សាទុក។ តើអ្នកប្រាកដទេ?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>បន្តបំពេញ</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.visit(route("asset-transactions.index"))}>
                                    ចាកចេញ
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AppLayout>
    );
}
