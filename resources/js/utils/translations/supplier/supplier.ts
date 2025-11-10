// resources/js/utils/translations/supplier/supplier.ts

export const translations = {
    en: {
        // === Index Page ===
        indexTitle: "Suppliers",
        indexId: "ID",
        indexName: "Name",
        indexContactPerson: "Contact Person",
        indexPhone: "Phone",
        indexEmail: "Email",
        indexCreatedAt: "Created At",
        indexSearch: "Search",
        indexSearchPlaceholder: "Search by name...",
        indexViewTooltip: "View",
        indexEditTooltip: "Edit",
        indexDeleteTooltip: "Delete",
        indexDeleteConfirm: "Are you sure you want to delete this supplier?",

        // === Create Page ===
        createTitle: "Create Supplier",
        createBreadcrumb: "Create",
        name: "Name",
        createNamePlaceholder: "e.g., Acme Corp",
        contact_person: "Contact Person",
        contactPlaceholder: "John Doe",
        phone: "Phone",
        phonePlaceholder: "+855 12 345 678",
        email: "Email",
        emailPlaceholder: "contact@acme.com",
        address: "Address",
        createCreate: "Create",
        createCreating: "Creating...",
        createCancel: "Cancel",
        createNotification: "Supplier created successfully.",
        createError: "Please fix the errors below.",

        // === Edit Page ===
        editTitle: "Edit Supplier",
        editBreadcrumb: "Edit",
        editNamePlaceholder: "e.g., Acme Corp",
        editUpdate: "Update",
        editUpdating: "Updating...",
        editCancel: "Cancel",
        editNotification: "Supplier updated successfully.",
        editError: "Please fix the errors below.",

        // === Show Page ===
        showTitle: "View Supplier",
        showBack: "Back to List",
    },

    kh: {
        // === Index Page ===
        indexTitle: "អ្នកផ្គត់ផ្គង់",
        indexId: "លេខសម្គាល់",
        indexName: "ឈ្មោះ",
        indexContactPerson: "អ្នកទំនាក់ទំនង",
        indexPhone: "លេខទូរស័ព្ទ",
        indexEmail: "អ៊ីមែល",
        indexCreatedAt: "បង្កើតនៅ",
        indexSearch: "ស្វែងរក",
        indexSearchPlaceholder: "ស្វែងរកតាមឈ្មោះ...",
        indexViewTooltip: "មើល",
        indexEditTooltip: "កែ",
        indexDeleteTooltip: "លុប",
        indexDeleteConfirm: "តើអ្នកប្រាកដជាចង់លុបអ្នកផ្គត់ផ្គង់នេះមែនទេ?",

        // === Create Page ===
        createTitle: "បង្កើតអ្នកផ្គត់ផ្គង់",
        createBreadcrumb: "បង្កើត",
        name: "ឈ្មោះ",
        createNamePlaceholder: "ឧ. ក្រុមហ៊ុន អេស៊ីម",
        contact_person: "អ្នកទំនាក់ទំនង",
        contactPlaceholder: "ចន ដូ",
        phone: "លេខទូរស័ព្ទ",
        phonePlaceholder: "+៨៥៥ ១២ ៣៤៥ ៦៧៨",
        email: "អ៊ីមែល",
        emailPlaceholder: "contact@acme.com",
        address: "អាសយដ្ឋាន",
        createCreate: "បង្កើត",
        createCreating: "កំពុងបង្កើត...",
        createCancel: "បោះបង់",
        createNotification: "បានបង្កើតអ្នកផ្គត់ផ្គង់ដោយជោគជ័យ។",
        createError: "សូមកែកំហុសខាងក្រោម។",

        // === Edit Page ===
        editTitle: "កែអ្នកផ្គត់ផ្គង់",
        editBreadcrumb: "កែ",
        editNamePlaceholder: "ឧ. ក្រុមហ៊ុន អេស៊ីម",
        editUpdate: "កែ",
        editUpdating: "កំពុងកែ...",
        editCancel: "បោះបង់",
        editNotification: "បានកែអ្នកផ្គត់ផ្គង់ដោយជោគជ័យ។",
        editError: "សូមកែកំហុសខាងក្រោម។",

        // === Show Page ===
        showTitle: "មើលអ្នកផ្គត់ផ្គង់",
        showBack: "ត្រឡប់ទៅបញ្ជី",
    },
} as const;

export type SupplierTranslationKey = keyof typeof translations.en;
