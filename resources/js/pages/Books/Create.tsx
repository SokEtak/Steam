"use client";

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
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
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

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
    publishedAt: 'Published Date',
    publishedAtPlaceholder: 'Select date',
    publishedAtError: 'Please select a valid publication date.',
    publishedAtHelper: 'Optional publication date.',
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
    coverHelper: 'Optional: JPEG or PNG, max 2MB.',
    pdfFile: 'PDF File (10MB max)',
    pdfFilePlaceholder: 'Upload a PDF file',
    pdfFileError: 'Please upload a valid PDF file (max 10MB).',
    pdfFileHelper: 'Required: PDF, max 10MB.',
    browse: 'Browse',
    remove: 'Remove',
    preview: 'Preview',
    createButton: 'Create Book',
    creating: 'Creating...',
    cancel: 'Cancel,Go Back to Books List',
    coverPreview: 'Cover Preview',
    pdfPreview: 'PDF Preview',
    noCoverAvailable: 'No cover image available.',
    noPdfAvailable: 'No PDF file available.',
    saveBook: 'Save the new book',
    returnToBooks: 'Return to the books list',
    physical: 'Physical',
    ebook: 'E-Book',
    audio: 'Audio',
    comingSoon: '(Coming Soon)',
  },
  kh: {
      go_back: "បញ្ជីសៀវភៅ",
    createBook: 'បង្កើតសៀវភៅថ្មី',
    createEBook: 'បង្កើតសៀវភៅអេឡិចត្រូនិក',
    createPhysicalBook: 'បង្កើតសៀវភៅក្រដាស',
    error: 'កំហុស',
    tryAgain: 'សាកល្បងម្តងទៀត',
    somethingWentWrong: 'មានកំហុសកើតឡើង',
    errorDescription: 'មានកំហុសកើតឡើងនៅពេលបង្កើតសៀវភៅ។ សូមសាកល្បងម្តងទៀត ឬទាក់ទងផ្នែកជំនួយ។',
    basicInformation: 'ព័ត៌មានមូលដ្ឋាន',
    title: 'ចំណងជើង',
    titlePlaceholder: 'បញ្ចូលចំណងជើងសៀវភៅ',
    titleError: 'សូមបញ្ចូលចំណងជើងត្រឹមត្រូវ (អតិបរមា ២៥៥ តួអក្សរ)។',
    titleHelper: 'អតិបរមា ២៥៥ តួអក្សរ។',
    description: 'ការពិពណ៌នា',
    descriptionPlaceholder: 'បញ្ចូលការពិពណ៌នាសៀវភៅ',
    descriptionError: 'សូមបញ្ចូលការពិពណ៌នាត្រឹមត្រូវ។',
    descriptionHelper: 'ការពិពណ៌នាសង្ខេបនៃសៀវភៅ។',
    pageCount: 'ចំនួនទំព័រ',
    pageCountPlaceholder: 'បញ្ចូលចំនួនទំព័រ',
    pageCountError: 'សូមបញ្ចូលចំនួនទំព័រត្រឹមត្រូវ (អប្បបរមា ១)។',
    pageCountHelper: 'ចំនួនទំព័រសរុប។',
    publisher: 'អ្នកបោះពុម្ព',
    publisherPlaceholder: 'បញ្ចូលឈ្មោះអ្នកបោះពុម្ព',
    publisherError: 'សូមបញ្ចូលឈ្មោះអ្នកបោះពុម្ពត្រឹមត្រូវ (អតិបរមា ២៥៥ តួអក្សរ)។',
    publisherHelper: 'អតិបរមា ២៥៥ តួអក្សរ។',
    language: 'ភាសា',
    languagePlaceholder: 'ជ្រើសរើសភាសា',
    languageError: 'សូមជ្រើសរើសភាសាត្រឹមត្រូវ។',
    languageHelper: 'ភាសាចម្បងនៃសៀវភៅ។',
    publishedAt: 'កាលបរិច្ឆេទបោះពុម្ព',
    publishedAtPlaceholder: 'ជ្រើសរើសកាលបរិច្ឆេទ',
    publishedAtError: 'សូមជ្រើសរើសកាលបរិច្ឆេទបោះពុម្ពត្រឹមត្រូវ។',
    publishedAtHelper: 'កាលបរិច្ឆេទបោះពុម្ព (ស្រេចចិត្ត)។',
    author: 'អ្នកនិពន្ធ',
    authorPlaceholder: 'បញ្ចូលឈ្មោះអ្នកនិពន្ធ',
    authorError: 'សូមបញ្ចូលឈ្មោះអ្នកនិពន្ធត្រឹមត្រូវ (អតិបរមា ២៥៥ តួអក្សរ)។',
    authorHelper: 'ស្រេចចិត្ត អតិបរមា ២៥៥ តួអក្សរ។',
    flipLink: 'តំណភ្ជាប់ឌីជីថល',
    flipLinkPlaceholder: 'បញ្ចូល URL នៃការមើលជាមុនឌីជីថល',
    flipLinkError: 'សូមបញ្ចូល URL ត្រឹមត្រូវសម្រាប់ការមើលជាមុនឌីជីថល។',
    flipLinkHelper: 'តំណភ្ជាប់ឌីជីថលសម្រាប់មើលជាមុន (ស្រេចចិត្ត)។',
    code: 'កូដ',
    codePlaceholder: 'បង្កើតដោយស្វ័យប្រវត្តិបន្ទាប់ពីជ្រើសរើសប្រភេទ',
    codeError: 'សូមបញ្ចូលកូដសៀវភៅត្រឹមត្រូវ (អតិបរមា ១០ តួអក្សរ)។',
    codeHelper: 'អតិបរមា ១០ តួអក្សរ បង្កើតដោយស្វ័យប្រវត្តិ។',
    isbn: 'ISBN',
    isbnPlaceholder: 'បញ្ចូល ISBN',
    isbnError: 'សូមបញ្ចូល ISBN ត្រឹមត្រូវ (អតិបរមា ១៣ តួអក្សរ)។',
    isbnHelper: 'ស្រេចចិត្ត ១៣ តួអក្សរ។',
    availability: 'ភាពអាចរកបាន',
    downloadable: 'អាចទាញយកបាន',
    availabilityError: 'សូមជ្រើសរើសជម្រើសភាពអាចរកបាន។',
    availabilityHelper: 'បញ្ជាក់ថាតើសៀវភៅនេះអាចរកបានឬអត់។',
    downloadableHelper: 'អនុញ្ញាតឱ្យអ្នកប្រើទាញយកសៀវភៅអេឡិចត្រូនិក។',
    yes: 'បាទ/ចាស',
    no: 'ទេ',
    classification: 'ការចាត់ថ្នាក់',
    category: 'ប្រភេទ',
    categoryPlaceholder: 'ជ្រើសរើសប្រភេទ',
    categoryError: 'សូមជ្រើសរើសប្រភេទត្រឹមត្រូវ។',
    categoryHelper: 'ជ្រើសរើសប្រភេទសម្រាប់សៀវភៅ។',
    subcategory: 'ប្រភេទរង',
    subcategoryPlaceholder: 'ជ្រើសរើសប្រភេទរង',
    subcategoryError: 'សូមជ្រើសរើសប្រភេទរងត្រឹមត្រូវ។',
    subcategoryHelper: 'ប្រភេទរងសម្រាប់សៀវភៅ (ស្រេចចិត្ត)។',
    grade: 'កម្រិត',
    gradePlaceholder: 'ជ្រើសរើសកម្រិត',
    gradeError: 'សូមជ្រើសរើសកម្រិតត្រឹមត្រូវ។',
    gradeHelper: 'កម្រិតសម្រាប់សៀវភៅ (ស្រេចចិត្ត)។',
    subject: 'មុខវិជ្ជា',
    subjectPlaceholder: 'ជ្រើសរើសមុខវិជ្ជា',
    subjectError: 'សូមជ្រើសរើសមុខវិជ្ជាត្រឹមត្រូវ។',
    subjectHelper: 'មុខវិជ្ជាសម្រាប់សៀវភៅ (ស្រេចចិត្ត)។',
    location: 'ទីតាំង',
    bookcase: 'ទូសៀវភៅ',
    bookcasePlaceholder: 'ជ្រើសរើសទូសៀវភៅ',
    bookcaseError: 'សូមជ្រើសរើសទូសៀវភៅត្រឹមត្រូវ។',
    bookcaseHelper: 'ជ្រើសរើសទូសៀវភៅសម្រាប់សៀវភៅក្រដាស។',
    shelf: 'ធ្នើរ',
    shelfPlaceholder: 'ជ្រើសរើសធ្នើរ',
    shelfError: 'សូមជ្រើសរើសធ្នើរត្រឹមត្រូវ។',
    shelfHelper: 'ជ្រើសរើសធ្នើរសម្រាប់សៀវភៅក្រដាស។',
    files: 'ឯកសារ',
    cover: 'គម្រប (ណែនាំជាទម្រង់បញ្ឈរ)',
    coverPlaceholder: 'បញ្ចូលរូបភាពគម្រប',
    coverError: 'សូមបញ្ចូលរូបភាពគម្របត្រឹមត្រូវ (JPEG/PNG, អតិបរមា ២MB)។',
    coverHelper: 'ស្រេចចិត្ត៖ JPEG ឬ PNG, អតិបរមា ២MB។',
    pdfFile: 'ឯកសារ PDF (អតិបរមា ១០MB)',
    pdfFilePlaceholder: 'បញ្ចូលឯកសារ PDF',
    pdfFileError: 'សូមបញ្ចូលឯកសារ PDF ត្រឹមត្រូវ (អតិបរមា ១០MB)។',
    pdfFileHelper: 'តម្រូវ៖ PDF, អតិបរមា ១០MB។',
    browse: 'រកមើល',
    remove: 'លុប',
    preview: 'មើលជាមុន',
    createButton: 'បង្កើតសៀវភៅ',
    creating: 'កំពុងបង្កើត...',
    cancel: 'បោះបង់ រួចត្រឡប់ទៅកាន់បញ្ជីសៀវភៅ',
    coverPreview: 'មើលគម្របជាមុន',
    pdfPreview: 'មើល PDF ជាមុន',
    noCoverAvailable: 'គ្មានរូបភាពគម្រប។',
    noPdfAvailable: 'គ្មានឯកសារ PDF។',
    saveBook: 'រក្សាទុកសៀវភៅថ្មី',
    returnToBooks: 'ត្រឡប់ទៅបញ្ជីសៀវភៅ',
    physical: 'សៀវភៅក្រដាស',
    ebook: 'សៀវភៅអេឡិចត្រូនិក',
    audio: 'សៀវភៅសំឡេង',
    comingSoon: '(នឹងមកដល់ឆាប់ៗនេះ)',
  },
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Books', href: route('books.index') },
  { title: 'Create', href: '' },
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
      const { lang } = (this.props as any).pageProps || { lang: 'en' }; // Access lang from page props
      const t = translations[lang === 'kh' ? 'kh' : 'en'];
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
  lang: 'en' | 'kh';
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
  lang,
}) => {
  const t = translations[lang];
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label} {isDragDrop && <span className="text-red-500">*</span>}
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
                  required={isDragDrop}
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
                    <span className="text-gray-500 dark:text-gray-400">{t.coverPlaceholder}</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                {t.coverPlaceholder}
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
  const { props } = usePage<{ lang?: string }>();
  const lang = props.lang === 'kh' ? 'kh' : 'en';
  const t = translations[lang];

  const [type, setType] = useState<'physical' | 'ebook'>(initialType);
  const isEbook = type === 'ebook';
  const [categories, setCategories] = useState(initialCategories);
  const [subcategories, setSubcategories] = useState(initialSubcategories);
  const [shelves, setShelves] = useState(initialShelves);
  const [bookcases, setBookcases] = useState(initialBookcases);
  const [grades, setGrades] = useState(initialGrades);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [pdfFileError, setPdfFileError] = useState<string | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(!!flash?.error);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    page_count: '',
    publisher: '',
    language: 'kh',
    published_at: '',
    author: '',
    flip_link: '',
    cover: null as File | null,
    code: '',
    isbn: '',
    view: '0',
    is_available: !isEbook,
    pdf_url: null as File | null,
    category_id: null as string | null,
    subcategory_id: null as string | null,
    shelf_id: isEbook ? null : (null as string | null),
    bookcase_id: isEbook ? null : (null as string | null),
    grade_id: null as string | null,
    subject_id: null as string | null,
    downloadable: isEbook,
    type,
  });

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    setShowErrorAlert(!!Object.keys(errors).length || !!flash?.error);
  }, [errors, flash?.error]);

  const generateCode = useCallback(() => {
    const category = data.category_id
      ? categories.find((cat) => cat.id.toString() === data.category_id)
      : null;
    const categoryPrefix = category ? category.name.slice(0, 3).toUpperCase() : 'UNK';
    const typePrefix = isEbook ? 'EBK' : 'PHY';
    const randomSuffix = generateRandomString(4);
    return `${categoryPrefix}-${typePrefix}-${randomSuffix}`.slice(0, 10);
  }, [data.category_id, isEbook, categories]);

  useEffect(() => {
    if (data.category_id) {
      setData('code', generateCode());
    }
  }, [data.category_id, generateCode]);

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
        setPdfFileError('Cover image exceeds 2MB limit. Please upload a smaller file.');
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
        if (file.size > 200 * 1024 * 1024) { // Changed to 200 MB
        setData(field, null);
        e.target.value = '';
        setPdfFileError('PDF file exceeds 10MB limit. Please upload a smaller file.');
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
      setPdfFileError('No file was dropped. Please try again.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setPdfFileError(t.pdfFileError);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPdfFileError('PDF file exceeds 10MB limit. Please drop a smaller file.');
      return;
    }
    setPdfFileError(null);
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setData('pdf_url', file);
    setPdfPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('books.store'), {
      forceFormData: true,
      onSuccess: () => {
        setShowErrorAlert(false);
        reset();
        setCoverPreviewUrl(null);
        setPdfPreviewUrl(null);
        setPdfFileError(null);
        setSelectedDate(undefined);
      },
      onError: () => setShowErrorAlert(true),
    });
  };

  const handleTypeChange = (newType: 'physical' | 'ebook') => {
    setType(newType);
    setData('type', newType);
    router.get(
      route('books.create'),
      { type: newType, lang }, // Include lang in navigation
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  };

  return (
    <ErrorBoundary pageProps={{ lang }}>
      <AppLayout breadcrumbs={[
          { title: t.go_back, href: route('books.index') },
          { title: t.createBook, href: '' }
      ]}>
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
              <Select
                  value={lang}
                  onValueChange={(value) => {
                      router.get(
                          route('books.create'),
                          { lang: value, type },
                          { preserveState: true, preserveScroll: true, replace: true }
                      );
                  }}
              >
                  {/*language switcher to continue later*/}
                  <SelectTrigger>
                      <SelectValue placeholder={t.languagePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="en">{t.language === 'ភាសា' ? 'អង់គ្លេស' : 'English'}</SelectItem>
                      <SelectItem value="kh">{t.language === 'ភាសា' ? 'ខ្មែរ' : 'Khmer'}</SelectItem>
                  </SelectContent>
              </Select>

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
                        {/*  without (coming soon)*/}
                        {t[tab as keyof typeof t]} {tab === 'audio'}
                        {/*{t[tab as keyof typeof t]} {tab === 'audio' && t.comingSoon}*/}
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
                          value={data.language}
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
                            <SelectItem value="kh">{t.language === 'ភាសា' ? 'ខ្មែរ' : 'Khmer'}</SelectItem>
                            <SelectItem value="en">{t.language === 'ភាសា' ? 'អង់គ្លេស' : 'English'}</SelectItem>
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
                                      value={data.published_at ?? ''} // Ensure empty string for undefined/null
                                      onChange={(e) => {
                                          const value = e.target.value;
                                          // Allow empty input or up to 4 digits for partial typing
                                          if (value === '' || (/^\d{1,4}$/.test(value))) {
                                              setData('published_at', value);
                                          }
                                      }}
                                      onBlur={(e) => {
                                          const value = e.target.value;
                                          // Validate on blur to ensure final value is between 1000 and 2025
                                          if (value !== '' && (parseInt(value) < 1000 || parseInt(value) > 2025)) {
                                              setErrors((prev) => ({
                                                  ...prev,
                                                  published_at: t.publishedAtError || 'Year must be between 1000 and 2025',
                                              }));
                                          } else {
                                              setErrors((prev) => ({ ...prev, published_at: undefined }));
                                          }
                                      }}
                                      min="1000"
                                      max="2025"
                                      placeholder={t.publishedAtPlaceholder || 'Enter year (1000–2025)'}
                                      className={`w-full mt-1 rounded-lg border ${
                                          errors.published_at ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                      } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                                      aria-describedby={errors.published_at ? 'published_at-error' : undefined}
                                  />
                              </TooltipTrigger>
                              <TooltipContent className="bg-indigo-600 text-white rounded-lg">
                                  {t.publishedAtPlaceholder || 'Enter the publication year (1000–2025)'}
                              </TooltipContent>
                          </Tooltip>
                      </TooltipProvider>
                      {errors.published_at && (
                          <p id="published_at-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                              {errors.published_at}
                          </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {t.publishedAtHelper || 'Enter the year the book was published (optional, 1000–2025).'}
                      </p>
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
                          onValueChange={(value) => setData('grade_id', value === 'none' ? null : value)}
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
                            <SelectItem value="none">{t.no}</SelectItem>
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
                          onValueChange={(value) => setData('subcategory_id', value === 'none' ? null : value)}
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
                            <SelectItem value="none">{t.no}</SelectItem>
                            {subcategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id.toString()}>
                                {sub.name}
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
                          onValueChange={(value) => setData('subject_id', value === 'none' ? null : value)}
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
                            <SelectItem value="none">{t.no}</SelectItem>
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
                              onValueChange={(value) => setData('bookcase_id', value)}
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
                              onValueChange={(value) => setData('shelf_id', value)}
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
                    setPdfFileError(null);
                  }}
                  lang={lang}
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
                    error={errors.pdf_url}
                    fileError={pdfFileError}
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
                    onPreviewClick={() => setIsPdfModalOpen(true)}
                    lang={lang}
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="col-span-full flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.get(route('books.index'))}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-4 py-2"
                  disabled={processing}
                >
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg px-4 py-2"
                  disabled={processing}
                >
                  {processing ? t.creating : t.createButton}
                </Button>
              </div>
            </form>
          </div>

          {/* Cover Preview Modal */}
          <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
            <DialogContent className="max-w-3xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">{t.coverPreview}</DialogTitle>
              </DialogHeader>
              {coverPreviewUrl ? (
                <img
                  src={coverPreviewUrl}
                  alt={t.coverPreview}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">{t.noCoverAvailable}</p>
              )}
            </DialogContent>
          </Dialog>

          {/* PDF Preview Modal */}
          <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
            <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">{t.pdfPreview}</DialogTitle>
              </DialogHeader>
              {pdfPreviewUrl ? (
                <div className="w-full h-[70vh] overflow-auto">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer fileUrl={pdfPreviewUrl} plugins={[defaultLayoutPluginInstance]} />
                  </Worker>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">{t.noPdfAvailable}</p>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </ErrorBoundary>
  );
}
