import { useState, useRef } from "react";
import { validateImageFile, resizeImage } from "../lib/imageUtils";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview: string | null;
}

export function ImageUpload({ onImageSelect, preview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      // Resize image to 512x512
      const resizedBlob = await resizeImage(file);
      const resizedFile = new File([resizedBlob], file.name, {
        type: file.type,
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(resizedFile, e.target?.result as string);
      };
      reader.readAsDataURL(resizedFile);

      toast.success("Image resized to 512x512px");
    } catch {
      toast.error("Failed to process image");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div>
      <label
        htmlFor="image-upload"
        className="block text-sm font-semibold text-black dark:text-white mb-2"
      >
        Upload Image (Optional)
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
              : "border-zinc-300 dark:border-zinc-600 hover:border-green-500 dark:hover:border-green-400"
          }
          ${preview ? "bg-zinc-50 dark:bg-zinc-800/50" : "bg-white dark:bg-zinc-800"}
        `}
      >
        <input
          ref={fileInputRef}
          id="image-upload"
          name="image-upload"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          className="hidden"
          aria-label="Upload image file"
        />

        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto border-2 border-black dark:border-zinc-600"
            />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              Click or drag to change image
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <svg
              className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
              <span className="font-semibold text-green-500 dark:text-green-400">
                Click to upload
              </span>{" "}
              or drag and drop
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              PNG or JPEG up to 10MB (will be resized to 512x512)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
