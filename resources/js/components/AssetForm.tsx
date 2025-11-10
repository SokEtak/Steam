import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { translations } from '@/utils/translations/asset/asset';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useEffect, useMemo } from 'react';

export default function AssetForm({ data, setData, errors, categories, subcategories, departments, rooms, users,purchaseOrders = [], lang = 'en' }: any) {
    const l = lang as 'en' | 'kh';
    const trans = translations[l] ?? translations.en;

    // --- Memoize options for SearchableSelect ---
    // This converts your data arrays into the { value, label } format
    // and only recalculates if the source data changes.

    // Convert POs to SearchableSelect format
    const poOptions = useMemo(() =>
            purchaseOrders.map(po => ({
                value: String(po.id),
                label: `${po.po_number}${po.supplier ? ` — ${po.supplier.name}` : ''}`
            })),
        [purchaseOrders]
    );

    const categoryOptions = useMemo(
        () => categories.map((c: any) => ({ value: String(c.id), label: c.name })),
        [categories]
    );

    const subcategoryOptions = useMemo(
        () => subcategories.map((s: any) => ({ value: String(s.id), label: s.name })),
        [subcategories]
    );

    const departmentOptions = useMemo(
        () => departments.map((d: any) => ({ value: String(d.id), label: d.name })),
        [departments]
    );

    const roomOptions = useMemo(
        () => rooms.map((r: any) => ({ value: String(r.id), label: r.name })),
        [rooms]
    );

    const userOptions = useMemo(
        () => users.map((u: any) => ({ value: String(u.id), label: u.name })),
        [users]
    );
    // --- End Memoization ---

    useEffect(() => {
        if (data.purchase_order_id) {
            const po = purchaseOrders.find(p => p.id === Number(data.purchase_order_id));
            if (po && po.total_cost && !data.cost) {
                setData('cost', po.total_cost.toString());
            }
        }
    }, [data.purchase_order_id, purchaseOrders]);

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>
                        {trans.assetTagLabel} <span className="text-red-500">*</span>
                    </Label>
                    <Input value={data.asset_tag || ""} onChange={(e) => setData('asset_tag', e.target.value)} />
                    {errors.asset_tag && <p className="text-sm text-red-500">{errors.asset_tag}</p>}
                </div>
                <div>
                    <Label>
                        {trans.assetNameLabel} <span className="text-red-500">*</span>
                    </Label>
                    <Input value={data.name || ""} onChange={(e) => setData('name', e.target.value)} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>
                        {trans.categoryLabel} <span className="text-red-500">*</span>
                    </Label>
                    {/* --- REPLACED WITH SEARCHABLE SELECT --- */}
                    <SearchableSelect
                        value={data.asset_category_id || ""}
                        onValueChange={(v) => {
                            setData({
                                ...data,
                                asset_category_id: v,
                                asset_subcategory_id: '', // Keep your reset logic
                            });
                        }}
                        options={categoryOptions}
                        placeholder="Select a category..."
                    />
                </div>
                <div>
                    <Label>{trans.subcategoryLabel}</Label>
                    {/* --- REPLACED WITH SEARCHABLE SELECT --- */}
                    <SearchableSelect
                        value={data.asset_subcategory_id || ""}
                        onValueChange={(v) => setData('asset_subcategory_id', v || null)}
                        options={subcategoryOptions}
                        placeholder="Select a subcategory..."
                        emptyPlaceholder={data.asset_category_id ? trans.noSubcategories : trans.selectCategoryFirst}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>{trans.serialNumberLabel}</Label>
                    <Input value={data.serial_number || ""} onChange={(e) => setData('serial_number', e.target.value)} />
                </div>
                <div>
                    <Label>{trans.modelLabel}</Label>
                    <Input value={data.model || ""} onChange={(e) => setData('model', e.target.value)} />
                </div>
            </div>

            <div>
                <Label>{trans.purchaseOrderLabel}</Label>
                <SearchableSelect
                    value={data.purchase_order_id || ""}
                    onValueChange={(v) => {
                        setData('purchase_order_id', v || null);
                        const po = purchaseOrders.find(p => p.id === Number(v));
                        if (po?.total_cost) {
                            setData('cost', po.total_cost.toString());
                        }
                    }}
                    options={purchaseOrders.map(po => ({
                        value: String(po.id),
                        label: `${po.po_number}${po.supplier ? ` — ${po.supplier.name}` : ''}`
                    }))}
                    placeholder={trans.searchPO}
                    emptyPlaceholder={trans.noPOs}
                />
                {errors.purchase_order_id && (
                    <p className="text-sm text-red-500 mt-1">{errors.purchase_order_id}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>
                        {trans.purchaseDateLabel} <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" value={data.purchase_date || ""} onChange={(e) => setData('purchase_date', e.target.value)} />
                </div>
                <div>
                    <Label>{trans.warrantyUntilLabel}</Label>
                    <Input type="date" value={data.warranty_until || ""} onChange={(e) => setData('warranty_until', e.target.value)} />
                </div>
            </div>

            <div>
                <Label>
                    {trans.costLabel} <span className="text-red-500">*</span>
                </Label>
                <Input type="number" step="0.01" value={data.cost || ""} onChange={(e) => setData('cost', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>{trans.conditionLabel}</Label>
                    {/* Keep simple Select for short, non-searchable lists */}
                    <Select value={data.condition} onValueChange={(v) => setData('condition', v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">{trans.conditionNew}</SelectItem>
                            <SelectItem value="secondhand">{trans.conditionSecondhand}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>{trans.statusLabel}</Label>
                    {/* Keep simple Select for short, non-searchable lists */}
                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">{trans.statusAvailable}</SelectItem>
                            <SelectItem value="allocated">{trans.statusAllocated}</SelectItem>
                            <SelectItem value="maintenance">{trans.statusMaintenance}</SelectItem>
                            <SelectItem value="disposed">{trans.statusDisposed}</SelectItem>
                            <SelectItem value="lost">{trans.statusLost}</SelectItem>
                            <SelectItem value="damaged">{trans.statusDamaged}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>{trans.departmentLabel}</Label>
                    {/* --- REPLACED WITH SEARCHABLE SELECT --- */}
                    <SearchableSelect
                        value={data.current_department_id || ""}
                        onValueChange={(v) => setData('current_department_id', v || null)}
                        options={departmentOptions}
                        placeholder="Select a department..."
                    />
                </div>
                <div>
                    <Label>{trans.roomLabel}</Label>
                    {/* --- REPLACED WITH SEARCHABLE SELECT --- */}
                    <SearchableSelect
                        value={data.current_room_id || ""}
                        onValueChange={(v) => setData('current_room_id', v || null)}
                        options={roomOptions}
                        placeholder="Select a room..."
                    />
                </div>
            </div>

            <div>
                <Label>{trans.custodianLabel}</Label>
                {/* --- REPLACED WITH SEARCHABLE SELECT --- */}
                <SearchableSelect
                    value={data.custodian_user_id || ""}
                    onValueChange={(v) => setData('custodian_user_id', v || null)}
                    options={userOptions}
                    placeholder="Select a custodian..."
                />
            </div>

            <div>
                <Label>{trans.notesLabel}</Label>
                <Textarea value={data.notes || ""} onChange={(e) => setData('notes', e.target.value)} rows={4} />
            </div>
        </>
    );
}
