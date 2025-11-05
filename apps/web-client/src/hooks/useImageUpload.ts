import { useState, useRef } from "react";
import { toast } from "react-hot-toast";

interface CloudinaryUploadSuccessResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

interface UseImageUploadReturn {
  imageUrl: string | null;
  imagePreview: string | null;
  upload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadInputRef: React.RefObject<HTMLInputElement | null>;
  handleUploadSuccess: (res: CloudinaryUploadSuccessResult) => void;
  handleUploadError: (err: Error) => void;
  setImagePreview: (preview: string | null) => void;
  clearImage: () => void;
  setImageUrl: (url: string | null) => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    toast.loading("Uploading image...");

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
      const uploadPreset = import.meta.env
        .VITE_CLOUDINARY_UPLOAD_PRESET as string;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Cloudinary upload failed: ${errorData.error?.message || "Unknown error"}`
        );
      }

      const result: CloudinaryUploadSuccessResult = await response.json();
      handleUploadSuccess(result);
    } catch (error) {
      handleUploadError(error as Error);
    } finally {
      setIsUploading(false);
      toast.dismiss();
    }
  };

  const handleUploadSuccess = (res: CloudinaryUploadSuccessResult) => {
    setImageUrl(res.secure_url);
    setImagePreview(res.secure_url);
    toast.success("Image uploaded successfully!");
  };

  const handleUploadError = (err: Error) => {
    console.error("Cloudinary upload error:", err);
    toast.error(err.message || "Image upload failed. Please try again.");
  };

  const clearImage = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  return {
    imageUrl,
    imagePreview,
    upload,
    isUploading,
    uploadInputRef,
    handleUploadSuccess,
    handleUploadError,
    setImagePreview,
    clearImage,
    setImageUrl,
  };
}
