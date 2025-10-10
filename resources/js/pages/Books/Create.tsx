"use client";

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2Icon, X } from 'lucide-react';
import { useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { toast } from 'sonner'; // Import sonner for toast notifications
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
}

interface Shelf {
  id: number;
  code: string;
}

interface Bookcase {
  id: number;
  code: string;
}

interface Grade {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface BooksCreateProps {
  categories: Category[];
  subcategories: Subcategory[];
  shelves: Shelf[];
  bookcases: Bookcase[];
  grades: Grade[];
  subjects: Subject[];
  flash?: {
    message: string | null;
    error: string | null;
    warning: string | null; // Added warning to match flash structure
  };
  type: 'physical' | 'ebook';
}

// Translation object for English and Khmer
const translations = {
  en: {
    go_back: 'Book List',
    createBook: 'Create New Book',
    createEBook: 'Create E-Book',
    createPhysicalBook: 'Create Physical Book',
    error: 'Error',
    tryAgain: 'Try Again',
    somethingWentWrong: 'Something went wrong',
    errorDescription: 'An error occurred while creating the book. Please try again or contact support.',
    bookCreated: 'Book created successfully!',
    undo: 'Undo',
    basicInformation: 'Basic Information',
    title: 'Title',
    titlePlaceholder: 'Enter the book title',
    titleError: 'Please provide a valid title (max 255 characters).',
    titleHelper: 'Max 255 characters.',
    description: 'Description',
    descriptionPlaceholder: 'Enter the book description',
    descriptionError: 'Please provide a valid description.',
    descriptionHelper: 'Brief description of the book.',
    pageCount: 'Page Count',
    pageCountPlaceholder: 'Enter the number of pages',
    pageCountError: 'Please provide a valid page count (minimum 1).',
    pageCountHelper: 'Total number of pages.',
    publisher: 'Publisher',
    publisherPlaceholder: 'Enter the publisher name',
    publisherError: 'Please provide a valid publisher name (max 255 characters).',
    publisherHelper: 'Max 255 characters.',
    language: 'Language',
    languagePlaceholder: 'Select language',
    languageError: 'Please select a valid language.',
    languageHelper: 'Primary language of the book.',
    program: 'Program',
    programPlaceholder: 'Select program',
    programError: 'Please select a valid program.',
    programHelper: 'Select the program for the book (Cambodia or American).',
    publishedAt: 'Published Year',
    publishedAtPlaceholder: 'Select Year',
    publishedAtError: 'Please select a valid publication year.',
    publishedAtHelper: 'Optional publication year.',
    author: 'Author',
    authorPlaceholder: 'Enter the author name',
    authorError: 'Please provide a valid author name (max 255 characters).',
    authorHelper: 'Optional, max 255 characters.',
    flipLink: 'Flip Link',
    flipLinkPlaceholder: 'Enter the digital preview URL',
    flipLinkError: 'Please provide a valid URL for the digital preview.',
    flipLinkHelper: 'Optional digital preview link.',
    code: 'Code',
    codePlaceholder: 'Auto-generated after selecting category',
    codeError: 'Please provide a valid book code (max 10 characters).',
    codeHelper: 'Max 10 characters, auto-generated.',
    isbn: 'ISBN',
    isbnPlaceholder: 'Enter the ISBN',
    isbnError: 'Please provide a valid ISBN (max 13 characters).',
    isbnHelper: 'Optional, 13 characters.',
    availability: 'Availability',
    downloadable: 'Downloadable',
    availabilityError: 'Please select an availability option.',
    availabilityHelper: 'Indicate if the book is available.',
    downloadableHelper: 'Allow users to download the e-book.',
    yes: 'Yes',
    no: 'No',
    classification: 'Classification',
    category: 'Category',
    categoryPlaceholder: 'Select category',
    categoryError: 'Please select a valid category.',
    categoryHelper: 'Select a category for the book.',
    subcategory: 'Subcategory',
    subcategoryPlaceholder: 'Select subcategory',
    subcategoryError: 'Please select a valid subcategory.',
    subcategoryHelper: 'Optional subcategory for the book.',
    grade: 'Grade',
    gradePlaceholder: 'Select grade',
    gradeError: 'Please select a valid grade.',
    gradeHelper: 'Optional grade level for the book.',
    subject: 'Subject',
    subjectPlaceholder: 'Select subject',
    subjectError: 'Please select a valid subject.',
    subjectHelper: 'Optional subject for the book.',
    location: 'Location',
    bookcase: 'Bookcase',
    bookcasePlaceholder: 'Select bookcase',
    bookcaseError: 'Please select a valid bookcase.',
    bookcaseHelper: 'Select a bookcase for the physical book.',
    shelf: 'Shelf',
    shelfPlaceholder: 'Select shelf',
    shelfError: 'Please select a valid shelf.',
    shelfHelper: 'Select a shelf for the physical book.',
    files: 'Files',
    cover: 'Cover (portrait recommended)',
    coverPlaceholder: 'Upload a cover image',
    coverError: 'Please upload a valid cover image (JPEG/PNG, max 2MB).',
    coverHelper: 'JPEG or PNG, max 2MB.',
    pdfFile: 'PDF File (30MB max)',
    pdfFilePlaceholder: 'Upload a PDF file',
    pdfFileError: 'Please upload a valid PDF file (max 30MB).',
    pdfFileHelper: 'Optional: PDF, max 30MB.',
    browse: 'Browse',
    remove: 'Remove',
    preview: 'Preview',
    createButton: 'Create Book',
    creating: 'Creating...',
    cancel: 'Cancel, Go Back to Book List',
    coverPreview: 'Cover Preview',
    pdfPreview: 'PDF Preview',
    noCoverAvailable: 'No cover image available.',
    noPdfAvailable: 'No PDF file available.',
    saveBook: 'Save the new book',
    returnToBooks: 'Return to the book list',
    physical: 'Physical',
    ebook: 'E-Book',
    audio: 'Audio',
    comingSoon: '(soon)',
    isContinue: 'Is Continue',
  },
  kh: {
    go_back: 'បញ្ជីសៀវភៅ',
    createBook: 'បង្កើតសៀវភៅថ្មី',
    createEBook: 'បង្កើតសៀវភៅអេឡិចត្រូនិក',
    createPhysicalBook: 'បង្កើតសៀវភៅផ្ទាល់',
    error: 'កំហុស',
    tryAgain: 'ព្យាយាមម្តងទៀត',
    somethingWentWrong: 'មានអ្វីមួយខុសឆ្គង',
    errorDescription: 'មានកំហុសកើតឡើងនៅពេលបង្កើតសៀវភៅ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងផ្នែកជំនួយ។',
    bookCreated: 'សៀវភៅត្រូវបានបង្កើតដោយជោគជ័យ!',
    undo: 'មិនធ្វើវិញ',
    basicInformation: 'ព័ត៌មានមូលដ្ឋាន',
    title: 'ចំណងជើង',
    titlePlaceholder: 'បញ្ចូលចំណងជើងសៀវភៅ',
    titleError: 'សូមផ្តល់ចំណងជើងត្រឹមត្រូវ (អតិបរមា ២៥៥ តួអក្សរ)។',
    titleHelper: 'អតិបរមា ២៥៥ តួអក្សរ។',
    description: 'ការពិពណ៌នា',
    descriptionPlaceholder: 'បញ្ចូលការពិពណ៌នាសៀវភៅ',
    descriptionError: 'សូមផ្តល់ការពិពណ៌នាត្រឹមត្រូវ។',
    descriptionHelper: 'ការពិពណ៌នាសង្ខេបនៃសៀវភៅ។',
    pageCount: 'ចំនួនទំព័រ',
    pageCountPlaceholder: 'បញ្ចូលចំនួនទំព័រ',
    pageCountError: 'សូមផ្តល់ចំនួនទំព័រត្រឹមត្រូវ (អប្បបរមា ១)',
    pageCountHelper: 'ចំនួនទំព័រសរុប។',
    publisher: 'អ្នកបោះពុម្ព',
    publisherPlaceholder: 'បញ្ចូលឈ្មោះអ្នកបោះពុម្ព',
    publisherError: 'សូមផ្តល់ឈ្មោះអ្នកបោះពុម្ពត្រឹមត្រូវ (អតិបរមា ២៥៥ តួអក្សរ)។',
    publisherHelper: 'អតិបរមា ២៥៥ តួអក្សរ។',
    language: 'ភាសា',
    languagePlaceholder: 'ជ្រើសរើសភាសា',
    languageError: 'សូមជ្រើសរើសភាសាត្រឹមត្រូវ។',
    languageHelper: 'ភាសាចម្បងនៃសៀវភៅ។',
    program: 'កម្មវិធី',
    programPlaceholder: 'ជ្រើសរើសកម្មវិធី',
    programError: 'សូមជ្រើសរើសកម្មវិធីត្រឹមត្រូវ។',
    programHelper: 'ជ្រើសរើសកម្មវិធីសម្រាប់សៀវភៅ (កម្ពុជា ឬអាមេរិក)។',
    publishedAt: 'ឆ្នាំបោះពុម្ព',
    publishedAtPlaceholder: 'ជ្រើសរើសឆ្នាំ',
    publishedAtError: 'សូមជ្រើសរើសឆ្នាំបោះពុម្ពត្រឹមត្រូវ។',
    publishedAtHelper: 'ឆ្នាំបោះពុម្ពជាជម្រើស។',
    author: 'អ្នកនិពន្ធ',
    authorPlaceholder: 'បញ្ចូលឈ្មោះអ្នកនិពន្ធ',
    authorError: 'សូមផ្តល់ឈ្មោះអ្នកនិពន្ធត្រឹមត្រូវ (អតិបរមា ២៥៥ តួអក្សរ)។',
    authorHelper: 'ជាជម្រើស អតិបរមា ២៥៥ តួអក្សរ។',
    flipLink: 'តំណភ្ជាប់ឌីជីថល',
    flipLinkPlaceholder: 'បញ្ចូល URL មើលជាមុនឌីជីថល',
    flipLinkError: 'សូមផ្តល់ URL ត្រឹមត្រូវសម្រាប់មើលជាមុនឌីជីថល។',
    flipLinkHelper: 'តំណភ្ជាប់មើលជាមុនឌីជីថលជាជម្រើស។',
    code: 'កូដ',
    codePlaceholder: 'បង្កើតដោយស្វ័យប្រវត្តិបន្ទាប់ពីជ្រើសរើសប្រភេទ',
    codeError: 'សូមផ្តល់កូដសៀវភៅត្រឹមត្រូវ (អតិបរមា ១០ តួអក្សរ)។',
    codeHelper: 'អតិបរមា ១០ តួអក្សរ។ បង្កើតដោយស្វ័យប្រវត្តិ។',
    isbn: 'ISBN',
    isbnPlaceholder: 'បញ្ចូល ISBN',
    isbnError: 'សូមផ្តល់ ISBN ត្រឹមត្រូវ (អតិបរមា ១៣ តួអក្សរ)។',
    isbnHelper: 'ជាជម្រើស ១៣ តួអក្សរ។',
    availability: 'ភាពអាចរកបាន',
    downloadable: 'អាចទាញយកបាន',
    availabilityError: 'សូមជ្រើសរើសជម្រើសភាពអាចរកបាន។',
    availabilityHelper: 'បញ្ជាក់ថាសៀវភៅអាចរកបាន។',
    downloadableHelper: 'អនុញ្ញាតឱ្យអ្នកប្រើប្រាស់ទាញយកសៀវភៅអេឡិចត្រូនិក។',
    yes: 'បាន',
    no: 'ទេ',
    classification: 'ការចាត់ថ្នាក់',
    category: 'ប្រភេទ',
    categoryPlaceholder: 'ជ្រើសរើសប្រភេទ',
    categoryError: 'សូមជ្រើសរើសប្រភេទត្រឹមត្រូវ។',
    categoryHelper: 'ជ្រើសរើសប្រភេទសម្រាប់សៀវភៅ។',
    subcategory: 'ប្រភេទរង',
    subcategoryPlaceholder: 'ជ្រើសរើសប្រភេទរង',
    subcategoryError: 'សូមជ្រើសរើសប្រភេទរងត្រឹមត្រូវ។',
    subcategoryHelper: 'ប្រភេទរងជាជម្រើសសម្រាប់សៀវភៅ។',
    grade: 'កម្រិត',
    gradePlaceholder: 'ជ្រើសរើសកម្រិត',
    gradeError: 'សូមជ្រើសរើសកម្រិតត្រឹមត្រូវ។',
    gradeHelper: 'កម្រិតជាជម្រើសសម្រាប់សៀវភៅ។',
    subject: 'មុខវិជ្ជា',
    subjectPlaceholder: 'ជ្រើសរើសមុខវិជ្ជា',
    subjectError: 'សូមជ្រើសរើសមុខវិជ្ជាត្រឹមត្រូវ។',
    subjectHelper: 'មុខវិជ្ជាជាជម្រើសសម្រាប់សៀវភៅ។',
    location: 'ទីតាំង',
    bookcase: 'ទូសៀវភៅ',
    bookcasePlaceholder: 'ជ្រើសរើសទូសៀវភៅ',
    bookcaseError: 'សូមជ្រើសរើសទូសៀវភៅត្រឹមត្រូវ',
    bookcaseHelper: 'ជ្រើសរើសទូសៀវភៅសម្រាប់សៀវភៅផ្ទាល់',
    shelf: 'ធ្នើ',
    shelfPlaceholder: 'ជ្រើសរើសធ្នើ',
    shelfError: 'សូមជ្រើសរើសធ្នើត្រឹមត្រូវ។',
    shelfHelper: 'ជ្រើសរើសធ្នើសម្រាប់សៀវភៅផ្ទាល់',
    files: 'ឯកសារ',
    cover: 'គម្រប (ណែនាំទំរង់បញ្ឈរ)',
    coverPlaceholder: 'ផ្ទុកឡើងរូបភាពគម្រប',
    coverError: 'សូមផ្ទុកឡើងរូបភាពគម្របត្រឹមត្រូវ (JPEG/PNG, អតិបរមា 5MB)។',
    coverHelper: 'JPEG ឬ PNG, អតិបរមា 5MB។',
    pdfFile: 'ឯកសារ PDF (អតិបរមា 30MB)',
    pdfFilePlaceholder: 'ផ្ទុកឡើងឯកសារ PDF',
    pdfFileError: 'សូមផ្ទុកឡើងឯកសារ PDF ត្រឹមត្រូវ (អតិបរមា 30MB)',
    pdfFileHelper: 'ជាជម្រើស: PDF, អតិបរមា 30MB',
    browse: 'រកមើល',
    remove: 'លុប',
    preview: 'មើលជាមុន',
    createButton: 'បង្កើតសៀវភៅ',
    creating: 'កំពុងបង្កើត...',
    cancel: 'បោះបង់ ត្រឡប់ទៅបញ្ជីសៀវភៅ',
    coverPreview: 'មើលគម្របជាមុន',
    pdfPreview: 'មើល PDF ជាមុន',
    noCoverAvailable: 'គ្មានរូបភាពគម្របទេ១',
    noPdfAvailable: 'គ្មានឯកសារ PDF ទេ។',
    saveBook: 'រក្សាទុកសៀវភៅថ្មី',
    returnToBooks: 'ត្រឡប់ទៅបញ្ជីសៀវភៅ',
    physical: 'សៀវភៅ',
    ebook: 'សៀវភៅអេឡិចត្រូនិក',
    audio: 'សំឡេង',
    comingSoon: '(ឆាប់ៗនេះ)',
    isContinue: 'បន្ត',
  },
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: translations.kh.go_back, href: route('books.index') },
  { title: translations.kh.createBook, href: '' },
];

const generateRandomString = (length: number): string => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      const t = translations.kh;
      return (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-200 dark:border-red-700 p-6">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">{t.somethingWentWrong}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{t.errorDescription}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 rounded-lg"
            >
              {t.tryAgain}
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface FileFieldProps {
  label: string;
  id: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
  onPreviewClick?: () => void;
  error?: string;
  helperText?: string;
  isDragDrop?: boolean;
  dragActive?: boolean;
  onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  selectedFileName?: string;
  onRemove?: () => void;
  fileError?: string;
  required?: boolean;
}

const FileField: React.FC<FileFieldProps> = ({
  label,
  id,
  accept,
  onChange,
  previewUrl,
  onPreviewClick,
  error,
  helperText,
  isDragDrop = false,
  dragActive = false,
  onDrag,
  onDrop,
  selectedFileName,
  onRemove,
  fileError,
  required = false,
}) => {
  const t = translations.kh;

  // Handle paste event for cover image field only
  useEffect(() => {
    if (id !== 'cover') return; // Restrict to cover field

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.match('image/(jpeg|png)')) {
          const file = item.getAsFile();
          if (!file) return;

          // Validate file size (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            onChange({ target: { files: null } } as any);
            return;
          }

          // Create synthetic event for existing onChange handler
          const syntheticEvent = {
            target: { files: [file] },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
          break; // Process only the first valid image
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [id, onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </Label>
      {isDragDrop ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 w-full max-w-md h-64 mx-auto flex flex-col justify-center items-center ${
    dragActive
        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
        : 'border-gray-300 dark:border-gray-600'
} ${error || fileError ? 'border-red-500 dark:border-red-400' : ''}`}
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
                role="region"
                aria-label={`Drag and drop ${label.toLowerCase()} file`}
              >
                <Input
                  id={id}
                  type="file"
                  accept={accept}
                  onChange={onChange}
                  className="hidden"
                  required={required}
                  aria-describedby={error || fileError ? `${id}-error` : undefined}
                />
                <div className="space-y-3">
                  {selectedFileName ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Selected: {selectedFileName}{' '}
                      {onRemove && (
                        <Button
                          variant="link"
                          onClick={onRemove}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                          aria-label={`${t.remove} ${selectedFileName}`}
                        >
                          {t.remove}
                        </Button>
                      )}
                      {onPreviewClick && (
                        <Button
                          variant="link"
                          onClick={onPreviewClick}
                          className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                          aria-label={`${t.preview} ${selectedFileName}`}
                        >
                          {t.preview}
                        </Button>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.pdfFilePlaceholder}
                    </p>
                  )}
                  <Button
                    type="button"
                    onClick={() => document.getElementById(id)?.click()}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 rounded-lg"
                    aria-label={t.browse}
                  >
                    {t.browse}
                  </Button>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-indigo-600 text-white rounded-lg">
              {t.pdfFilePlaceholder}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`relative w-full max-w-md h-64 mx-auto bg-gray-100 dark:bg-gray-700 border rounded-lg overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-200 ${
    error || fileError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} hover:border-indigo-500 dark:hover:border-indigo-400`}
                  onClick={() => document.getElementById(id)?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      document.getElementById(id)?.click();
                    }
                  }}
                >
                  <Input
                    id={id}
                    type="file"
                    accept={accept}
                    onChange={onChange}
                    className="hidden"
                    aria-describedby={error || fileError ? `${id}-error` : undefined}
                  />
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt={`${t.cover} Preview`}
                        className="w-full h-full object-contain"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewClick?.();
                        }}
                      />
                      {onRemove && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                          }}
                          aria-label={t.remove}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 sm:text-center">{t.coverPlaceholder} (or Ctrl+V)</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                {t.coverPlaceholder} (or paste image with Ctrl+V)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {(error || fileError) && (
            <p id={`${id}-error`} className="text-red-500 dark:text-red-400 text-sm text-center">
              {error || fileError || t.coverError}
            </p>
          )}
          {helperText && <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{helperText}</p>}
        </div>
      )}
    </div>
  );
};

export default function BooksCreate({
  categories: initialCategories,
  subcategories: initialSubcategories,
  shelves: initialShelves,
  bookcases: initialBookcases,
  grades: initialGrades,
  subjects: initialSubjects,
  flash,
  type: initialType,
}: BooksCreateProps) {
  const t = translations.kh;

  const [type, setType] = useState<'physical' | 'ebook'>('physical');
  const isEbook = type === 'ebook';
  const [categories, setCategories] = useState(initialCategories);
  const [subcategories, setSubcategories] = useState(initialSubcategories);
  const [shelves, setShelves] = useState(initialShelves);
  const [bookcases, setBookcases] = useState(initialBookcases);
  const [grades, setGrades] = useState(initialGrades);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [pdfFileError, setPdfFileError] = useState<string | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(!!flash?.error);

    const { data, setData, post, processing, errors, reset, setErrors } = useForm({
        //where to set initial form value
        title: '',
        description: '',
        page_count: '1',
        publisher: 'ក្រសួងអប់រំយុវជននិងកីឡា',
        language: 'kh',
        program: '',
        published_at: '201',
        author: 'ក្រសួងអប់រំយុវជននិងកីឡា',
        flip_link: '',
        cover: null,
        code: 'J',
        isbn: '978999500',
        view: '0',
        is_available: !isEbook,
        pdf_url: null,
        category_id: '5',
        subcategory_id: '',
        shelf_id: isEbook ? '' : '',
        bookcase_id: isEbook ? '' : '',
        grade_id: '',
        subject_id: '',
        downloadable: !isEbook,
        type,
        is_continue: true,
    });

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  //temp log
    useEffect(() => {
        console.log('setErrors:', setErrors); // Debug to confirm setErrors is a function
    }, [setErrors]);

  // Handle flash messages for toast notifications
    useEffect(() => {
        if (flash?.message) {
            toast(t.bookCreated, {
                description: new Date().toLocaleString('km-KH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }),
                action: {
                    label: t.undo,
                    onClick: () => router.get(route('books.index')),
                },
            });
        }
        setShowErrorAlert(!!Object.keys(errors).length || !!flash?.error);
    }, [flash, errors, t]);

  // const generateCode = useCallback(() => {
  //   const randomPrefix = generateRandomString(3).toUpperCase();
  //   const typePrefix = isEbook ? 'EBK' : 'PHY';
  //   const randomSuffix = generateRandomString(4);
  //   return `${randomPrefix}-${typePrefix}-${randomSuffix}`.slice(0, 10);
  // }, [isEbook]);

  // auto code generate after category selected
  // useEffect(() => {
  //   if (data.category_id) {
  //     setData('code', generateCode());
  //   }
  // }, [data.category_id, generateCode]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    };
  }, [coverPreviewUrl, pdfPreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'pdf_url') => {
    const file = e.target.files?.[0];
    if (!file) {
      setData(field, null);
      if (field === 'cover') setCoverPreviewUrl(null);
      else {
        setPdfPreviewUrl(null);
        setPdfFileError(null);
      }
      return;
    }

    if (field === 'cover') {
      if (!file.type.match('image/(jpeg|png)')) {
        setData(field, null);
        e.target.value = '';
        setPdfFileError(t.coverError);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setData(field, null);
        e.target.value = '';
        setPdfFileError('រូបភាពគម្របលើស 5MB។ សូមផ្ទុកឡើងឯកសារតូចជាង។');
        return;
      }
    }
    if (field === 'pdf_url') {
      if (file.type !== 'application/pdf') {
        setData(field, null);
        e.target.value = '';
        setPdfFileError(t.pdfFileError);
        return;
      }
      if (file.size > 30 * 1024 * 1024) {
        setData(field, null);
        e.target.value = '';
        setPdfFileError('ឯកសារ PDF លើស ៣៦MB។ សូមផ្ទុកឡើងឯកសារតូចជាង។');
        return;
      }
      setPdfFileError(null);
    }

    setData(field, file);
    const newUrl = URL.createObjectURL(file);
    if (field === 'cover') {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      setCoverPreviewUrl(newUrl);
    } else {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(newUrl);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) {
      setPdfFileError('គ្មានឯកសារត្រូវបានទម្លាក់។ សូមព្យាយាមម្តងទៀត។');
      return;
    }
    if (file.type !== 'application/pdf') {
      setPdfFileError(t.pdfFileError);
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setPdfFileError('ឯកសារ PDF លើស ៣៦MB។ សូមទម្លាក់ឯកសារតូចជាង។');
      return;
    }
    setPdfFileError(null);
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setData('pdf_url', file);
    setPdfPreviewUrl(URL.createObjectURL(file));
  };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEbook && !data.pdf_url) {
            setErrors((prev) => ({ ...prev, pdf_url: undefined }));
            setPdfFileError(null);
        }
        post(route('books.store'), {
            forceFormData: true,
            onSuccess: () => {
                setShowErrorAlert(false);
                // Delay reset slightly to ensure toast renders
                setTimeout(() => {
                    reset();
                    setCoverPreviewUrl(null);
                    setPdfPreviewUrl(null);
                    setPdfFileError(null);
                }, 100);
            },
            onError: (errors) => {
                setShowErrorAlert(true);
                if (errors.code?.includes('unique')) {
                    alert(t.codeError + ' សូមបញ្ចូលកូដថ្មី។');
                }
            },
        });
    };

  const handleTypeChange = (newType: 'physical' | 'ebook') => {
    setType(newType);
    setData('type', newType);
    router.get(
      route('books.create'),
      { type: newType },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  };

  return (
    <ErrorBoundary>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={isEbook ? t.createEBook : t.createPhysicalBook} />
        <div className="p-2 sm:p-6 lg:p-8 max-w-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {isEbook ? t.createEBook : t.createPhysicalBook}
            </h1>

            {showErrorAlert && (Object.keys(errors).length > 0 || flash?.error) && (
              <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <CheckCircle2Icon className="h-5 w-5 text-red-500 dark:text-red-400" />
                    <div>
                      <AlertTitle className="text-red-600 dark:text-red-400">{t.error}</AlertTitle>
                      <AlertDescription className="text-gray-600 dark:text-gray-300">
                        {flash?.error || Object.values(errors).join(', ')}
                      </AlertDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowErrorAlert(false)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    variant="ghost"
                    size="sm"
                    disabled={processing}
                    aria-label="Dismiss error alert"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-6" encType="multipart/form-data">
              <input type="hidden" name="type" value={type} />

              {/* Tabs for Physical/Ebook */}
              <div className="col-span-full">
                <div className="border-b border-gray-200 dark:border-gray-600">
                  <nav className="flex space-x-4">
                    {['physical', 'ebook', 'audio'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => (tab === 'physical' || tab === 'ebook') && handleTypeChange(tab as 'physical' | 'ebook')}
                        className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
    type === tab
        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
        : tab === 'audio'
            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
}`}
                        disabled={tab === 'audio'}
                      >
                        {t[tab as keyof typeof t]} {tab === 'audio' && t.comingSoon}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Basic Information */}
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0">{t.basicInformation}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.title} <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="title"
                          value={data.title}
                          onChange={(e) => setData('title', e.target.value)}
                          className={`w-full mt-1 rounded-lg border ${
    errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          required
                          aria-describedby={errors.title ? 'title-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.titlePlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.title && (
                    <p id="title-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.title || t.titleError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.titleHelper}</p>
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.description}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <textarea
                          id="description"
                          value={data.description}
                          onChange={(e) => setData('description', e.target.value)}
                          className={`w-full mt-1 rounded-lg border ${
    errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y`}
                          rows={4}
                          aria-describedby={errors.description ? 'description-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.descriptionPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.description && (
                    <p id="description-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.description || t.descriptionError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.descriptionHelper}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page_count" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.pageCount} <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="page_count"
                          type="number"
                          value={data.page_count}
                          onChange={(e) => setData('page_count', e.target.value)}
                          min="1"
                          className={`w-full mt-1 rounded-lg border ${
    errors.page_count ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          required
                          aria-describedby={errors.page_count ? 'page_count-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.pageCountPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.page_count && (
                    <p id="page_count-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.page_count || t.pageCountError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.pageCountHelper}</p>
                </div>
                <div>
                  <Label htmlFor="publisher" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.publisher} <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="publisher"
                          value={data.publisher}
                          onChange={(e) => setData('publisher', e.target.value)}
                          className={`w-full mt-1 rounded-lg border ${
    errors.publisher ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          required
                          aria-describedby={errors.publisher ? 'publisher-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.publisherPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.publisher && (
                    <p id="publisher-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.publisher || t.publisherError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.publisherHelper}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.language} <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                            value={data.language || undefined}
                          onValueChange={(value) => setData('language', value)}
                          required
                        >
                          <SelectTrigger
                            className={`w-full mt-1 rounded-lg border ${
    errors.language ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                            aria-describedby={errors.language ? 'language-error' : undefined}
                          >
                            <SelectValue placeholder={t.languagePlaceholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="kh">ខ្មែរ</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.languagePlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.language && (
                    <p id="language-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.language || t.languageError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.languageHelper}</p>
                </div>
                <div>
                  <Label htmlFor="published_at" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.publishedAt}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="published_at"
                          type="number"
                          value={data.published_at ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (/^\d{1,4}$/.test(value))) {
                              setData('published_at', value);
                            }
                          }}
                          onBlur={(e) => {
                              const value = e.target.value;
                              if (value !== '' && (parseInt(value) < 1000 || parseInt(value) > 2025)) {
                                  setData('published_at_error', t.publishedAtError || 'ឆ្នាំត្រូវនៅចន្លោះ ១៦៦៦ និង ២៦២៥');
                              } else {
                                  setData('published_at_error', undefined);
                              }
                          }}
                          min="1901"
                          max="2025"
                          placeholder={t.publishedAtPlaceholder}
                          className={`w-full mt-1 rounded-lg border ${
                                        errors.published_at ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          aria-describedby={errors.published_at ? 'published_at-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.publishedAtPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.published_at && (
                    <p id="published_at-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.published_at}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.publishedAtHelper}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="author" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.author}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="author"
                          value={data.author}
                          onChange={(e) => setData('author', e.target.value)}
                          className={`w-full mt-1 rounded-lg border ${
    errors.author ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          aria-describedby={errors.author ? 'author-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.authorPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.author && (
                    <p id="author-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.author || t.authorError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.authorHelper}</p>
                </div>
                <div>
                  <Label htmlFor="flip_link" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.flipLink}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="flip_link"
                          value={data.flip_link}
                          onChange={(e) => setData('flip_link', e.target.value)}
                          type="url"
                          className={`w-full mt-1 rounded-lg border ${
    errors.flip_link ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          aria-describedby={errors.flip_link ? 'flip_link-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.flipLinkPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.flip_link && (
                    <p id="flip_link-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.flip_link || t.flipLinkError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.flipLinkHelper}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.code} <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="code"
                          value={data.code}
                          onChange={(e) => setData('code', e.target.value)}
                          maxLength={10}
                          className={`w-full mt-1 rounded-lg border ${
                                        errors.code ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          placeholder={t.codePlaceholder}
                          required
                          aria-describedby={errors.code ? 'code-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.codePlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.code && (
                    <p id="code-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.code || t.codeError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.codeHelper}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="isbn" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.isbn}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="isbn"
                          value={data.isbn}
                          onChange={(e) => setData('isbn', e.target.value)}
                          maxLength={13}
                          className={`w-full mt-1 rounded-lg border ${
    errors.isbn ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                          aria-describedby={errors.isbn ? 'isbn-error' : undefined}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.isbnPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.isbn && (
                    <p id="isbn-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.isbn || t.isbnError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.isbnHelper}</p>
                </div>
              </div>

              <div className="space-y-4 col-span-full">
                <div>
                  <Label htmlFor="program" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.program}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={data.program || undefined}
                          onValueChange={(value) => setData('program', value as 'Cambodia' | 'American')}
                        >
                          <SelectTrigger
                            className={`w-full mt-1 rounded-lg border ${
                                            errors.program ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                        } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                            aria-describedby={errors.program ? 'program-error' : undefined}
                          >
                            <SelectValue placeholder={t.programPlaceholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="Cambodia">កម្ពុជា</SelectItem>
                            <SelectItem value="American">អាមេរិក</SelectItem>
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.programPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.program && (
                    <p id="program-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.program || t.programError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.programHelper}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {isEbook ? t.downloadable : t.availability} <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-6 mt-1">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={isEbook ? 'downloadable-yes' : 'is_available-yes'}
                              name={isEbook ? 'downloadable' : 'is_available'}
                              checked={isEbook ? data.downloadable === true : data.is_available === true}
                              onChange={() => setData(isEbook ? 'downloadable' : 'is_available', true)}
                              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
                              required
                              aria-describedby={(errors.is_available || errors.downloadable) ? 'availability-error' : undefined}
                            />
                            <Label
                              htmlFor={isEbook ? 'downloadable-yes' : 'is_available-yes'}
                              className="ml-2 text-sm text-gray-700 dark:text-gray-200"
                            >
                              {t.yes}
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={isEbook ? 'downloadable-no' : 'is_available-no'}
                              name={isEbook ? 'downloadable' : 'is_available'}
                              checked={isEbook ? data.downloadable === false : data.is_available === false}
                              onChange={() => setData(isEbook ? 'downloadable' : 'is_available', false)}
                              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
                              aria-describedby={(errors.is_available || errors.downloadable) ? 'availability-error' : undefined}
                            />
                            <Label
                              htmlFor={isEbook ? 'downloadable-no' : 'is_available-no'}
                              className="ml-2 text-sm text-gray-700 dark:text-gray-200"
                            >
                              {t.no}
                            </Label>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {isEbook ? t.downloadableHelper : t.availabilityHelper}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {(errors.is_available || errors.downloadable) && (
                    <p id="availability-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.is_available || errors.downloadable || t.availabilityError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isEbook ? t.downloadableHelper : t.availabilityHelper}
                  </p>
                </div>
              </div>

              {/* Classification */}
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0">{t.classification}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.category} <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={data.category_id || undefined}
                          onValueChange={(value) => setData('category_id', value)}
                          required
                        >
                          <SelectTrigger
                            className={`w-full mt-1 rounded-lg border ${
    errors.category_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                            aria-describedby={errors.category_id ? 'category-error' : undefined}
                          >
                            <SelectValue placeholder={t.categoryPlaceholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.categoryPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Link
                    href={route('categories.create')}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-1 inline-block"
                    preserveState
                    preserveScroll
                  >
                    {t.category} មិនមានទេ? ចុចទីនេះ
                  </Link>
                  {errors.category_id && (
                    <p id="category-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.category_id || t.categoryError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.categoryHelper}</p>
                </div>
                <div>
                  <Label htmlFor="grade" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.grade}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={data.grade_id || undefined}
                           value={data.grade_id || undefined}
                          onValueChange={(value) => setData('grade_id', value || '')}
                        >
                          <SelectTrigger
                            className={`w-full mt-1 rounded-lg border ${
                                        errors.grade_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                      } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                            aria-describedby={errors.grade_id ? 'grade-error' : undefined}
                          >
                            <SelectValue placeholder={t.gradePlaceholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            {grades.map((grade) => (
                              <SelectItem key={grade.id} value={grade.id.toString()}>
                                {grade.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.gradePlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.grade_id && (
                    <p id="grade-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.grade_id || t.gradeError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.gradeHelper}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.subcategory}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={data.subcategory_id || undefined}
                          onValueChange={(value) => setData('subcategory_id', value || '')}
                        >
                          <SelectTrigger
                            className={`w-full mt-1 rounded-lg border ${
                                          errors.subcategory_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                      } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                            aria-describedby={errors.subcategory_id ? 'subcategory-error' : undefined}
                          >
                            <SelectValue placeholder={t.subcategoryPlaceholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            {subcategories
                              .filter((subcat) => Number(data.category_id) === subcat.category_id)
                              .map((subcat) => (
                                <SelectItem key={subcat.id} value={subcat.id.toString()}>
                                  {subcat.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.subcategoryPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Link
                    href={route('subcategories.create')}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-1 inline-block"
                    preserveState
                    preserveScroll
                  >
                    {t.subcategory} មិនមានទេ? ចុចទីនេះ
                  </Link>
                  {errors.subcategory_id && (
                    <p id="subcategory-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.subcategory_id || t.subcategoryError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.subcategoryHelper}</p>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.subject}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={data.subject_id || undefined}
                          onValueChange={(value) => setData('subject_id', value === '' ? null : value)}
                        >
                          <SelectTrigger
                            className={`w-full mt-1 rounded-lg border ${
                                            errors.subject_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                        } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                            aria-describedby={errors.subject_id ? 'subject-error' : undefined}
                          >
                            <SelectValue placeholder={t.subjectPlaceholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id.toString()}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                        {t.subjectPlaceholder}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.subject_id && (
                    <p id="subject-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.subject_id || t.subjectError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.subjectHelper}</p>
                </div>
              </div>

              {/* Location (Physical Books Only) */}
              {!isEbook && (
                <>
                  <div className="col-span-full">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0">{t.location}</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bookcase" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {t.bookcase} <span className="text-red-500">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Select
                              value={data.bookcase_id || undefined}
                              onValueChange={(value) => setData('bookcase_id', value || '')}
                              required
                            >
                              <SelectTrigger
                                className={`w-full mt-1 rounded-lg border ${
                                                errors.bookcase_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                            } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                aria-describedby={errors.bookcase_id ? 'bookcase-error' : undefined}
                              >
                                <SelectValue placeholder={t.bookcasePlaceholder} />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                {bookcases.map((bookcase) => (
                                  <SelectItem key={bookcase.id} value={bookcase.id.toString()}>
                                    {bookcase.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TooltipTrigger>
                          <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                            {t.bookcasePlaceholder}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Link
                        href={route('bookcases.create')}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-1 inline-block"
                        preserveState
                        preserveScroll
                      >
                        {t.bookcase} មិនមានទេ? ចុចទីនេះ
                      </Link>
                      {errors.bookcase_id && (
                        <p id="bookcase-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                          {errors.bookcase_id || t.bookcaseError}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.bookcaseHelper}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shelf" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {t.shelf} <span className="text-red-500">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Select
                              value={data.shelf_id || undefined}
                              onValueChange={(value) => setData('shelf_id', value || '')}
                              required
                            >
                              <SelectTrigger
                                className={`w-full mt-1 rounded-lg border ${
    errors.shelf_id ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                aria-describedby={errors.shelf_id ? 'shelf-error' : undefined}
                              >
                                <SelectValue placeholder={t.shelfPlaceholder} />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                {shelves.map((shelf) => (
                                  <SelectItem key={shelf.id} value={shelf.id.toString()}>
                                    {shelf.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TooltipTrigger>
                          <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                            {t.shelfPlaceholder}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Link
                        href={route('shelves.create')}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-1 inline-block"
                        preserveState
                        preserveScroll
                      >
                        {t.shelf} មិនមានទេ? ចុចទីនេះ
                      </Link>
                      {errors.shelf_id && (
                        <p id="shelf-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                          {errors.shelf_id || t.shelfError}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.shelfHelper}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Files */}
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0">{t.files}</h2>
              </div>
              <div className="space-y-4">
                <FileField
                  label={t.cover}
                  id="cover"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e, 'cover')}
                  previewUrl={coverPreviewUrl}
                  onPreviewClick={() => setIsCoverModalOpen(true)}
                  error={errors.cover}
                  helperText={t.coverHelper}
                  onRemove={() => {
                    setData('cover', null);
                    setCoverPreviewUrl(null);
                  }}
                  selectedFileName={data.cover?.name}
                  fileError={pdfFileError}
                />
              </div>
              {isEbook && (
                <div className="space-y-4">
                  <FileField
                    label={t.pdfFile}
                    id="pdf_url"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'pdf_url')}
                    previewUrl={pdfPreviewUrl}
                    onPreviewClick={() => setIsPdfModalOpen(true)}
                    error={errors.pdf_url}
                    helperText={t.pdfFileHelper}
                    isDragDrop
                    dragActive={dragActive}
                    onDrag={handleDrag}
                    onDrop={handleDrop}
                    selectedFileName={data.pdf_url?.name}
                    onRemove={() => {
                      setData('pdf_url', null);
                      setPdfPreviewUrl(null);
                      setPdfFileError(null);
                    }}
                    fileError={pdfFileError}
                    required
                  />
                </div>
              )}

              {/* Action Buttons and Checkbox */}
              <div className="col-span-full flex justify-between items-center space-x-4 mt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_continue"
                    checked={data.is_continue}
                    onChange={(e) => setData('is_continue', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
                    aria-label={t.isContinue}
                  />
                  <Label
                    htmlFor="is_continue"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t.isContinue}
                  </Label>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 rounded-lg disabled:opacity-50"
                    aria-label={t.saveBook}
                  >
                    {processing ? t.creating : t.createButton}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.get(route('books.index'))}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
                    aria-label={t.returnToBooks}
                  >
                    {t.cancel}
                  </Button>
                </div>
              </div>
            </form>

            {/* Cover Preview Modal */}
            <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
              <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">{t.coverPreview}</DialogTitle>
                </DialogHeader>
                {coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
                    alt={t.coverPreview}
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">{t.noCoverAvailable}</p>
                )}
              </DialogContent>
            </Dialog>

            {/* PDF Preview Modal */}
            {isEbook && (
              <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-100">{t.pdfPreview}</DialogTitle>
                  </DialogHeader>
                  {pdfPreviewUrl ? (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <div className="max-h-[70vh] overflow-auto">
                        <Viewer fileUrl={pdfPreviewUrl} plugins={[defaultLayoutPluginInstance]} />
                      </div>
                    </Worker>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">{t.noPdfAvailable}</p>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </AppLayout>
    </ErrorBoundary>
  );
}
