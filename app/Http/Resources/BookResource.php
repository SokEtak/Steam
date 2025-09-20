<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Define the structure of a single book resource
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'page_count' => $this->page_count,
            'publisher' => $this->publisher,
            'language' => $this->language,
            'published_at' => $this->published_at,
            'cover' => $this->cover,
            'pdf_url' => $this->pdf_url,
            'flip_link' => $this->flip_link,
            'view' => $this->view,
            'is_available' => $this->is_available,
            'author' => $this->author,
            'code' => $this->code,
            'isbn' => $this->isbn,
            'type' => $this->type,
            'downloadable' => $this->downloadable,
            'is_deleted' => $this->is_deleted,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Conditionally include relationships when they have been loaded
            'user' => new UserResource($this->whenLoaded('user')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'subcategory' => new SubCategoryResource($this->whenLoaded('subcategory')),
            'shelf' => new ShelfResource($this->whenLoaded('shelf')),
            'grade' => new GradeResource($this->whenLoaded('grade')),
            'subject' => new SubjectResource($this->whenLoaded('subject')),
            'bookcase' => new BookcaseResource($this->whenLoaded('bookcase')),
            'campus' => new CampusResource($this->whenLoaded('campus')),
        ];
    }
}
