# Uploads Directory

This directory stores uploaded and processed images from user generations.

Images are:

- Automatically resized to 512x512 pixels using Sharp
- Named with UUIDs to prevent conflicts
- Served statically at `/uploads/<filename>`

## File Structure

```
uploads/
  ├── <uuid>.jpg
  ├── <uuid>.png
  └── ...
```

## Notes

- This directory should be excluded from version control (.gitignore)
- In production, consider using cloud storage (S3, Cloudinary, etc.)
