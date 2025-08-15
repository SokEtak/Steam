<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .file-preview { margin-bottom: 10px; }
    </style>
</head>
<body>
<div class="container mt-5">
    <h1>Upload a File</h1>
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    <form action="{{ route('files.upload') }}" method="POST" enctype="multipart/form-data" class="mb-5">
        @csrf
        <div class="form-group">
            <label for="file">Select File (JPG, PNG, PDF)</label>
            <input type="file" name="file" id="file" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary mt-2">Upload</button>
    </form>

    <h2>Uploaded Files</h2>
    <div class="row">
        @foreach($files as $file)
            <div class="col-md-4 mb-3">
                @if(in_array(strtolower(pathinfo($file->path, PATHINFO_EXTENSION)), ['jpg', 'png']))
                    <img src="{{ Storage::disk('r2')->url($file->path) }}" alt="{{ $file->original_name }}" class="img-fluid file-preview" onerror="this.src='/images/placeholder.jpg';">
                @elseif(strtolower(pathinfo($file->path, PATHINFO_EXTENSION)) === 'pdf')
                    <iframe src="{{ Storage::disk('r2')->url($file->path) }}" width="100%" height="300" class="file-preview"></iframe>
                    <a href="{{ route('files.show', $file->id) }}" class="btn btn-secondary btn-sm">Download</a>
                @else
                    @php
                        $fileTypes = ['pdf' => 'fa-file-pdf', 'doc' => 'fa-file-word', 'xls' => 'fa-file-excel'];
                        $extension = strtolower(pathinfo($file->path, PATHINFO_EXTENSION));
                        $iconClass = $fileTypes[$extension] ?? 'fa-file';
                    @endphp
                    <i class="fas {{ $iconClass }}" style="font-size: 48px; color: #6c757d;"></i>
                    <a href="{{ route('files.show', $file->id) }}" class="btn btn-secondary btn-sm">Download</a>
                @endif
                <p class="text-muted">{{ $file->original_name }}</p>
            </div>
        @endforeach
    </div>
</div>
</body>
</html>
