import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { generationsApi } from "../lib/api";

interface ImageKitUploadSuccessResult {
  url: string;
  thumbnailUrl: string;
  fileId: string;
  name: string;
  size: number;
  filePath: string;
}

interface ImageKitAuthResponse {
  signature: string;
  expire: number;
  token: string;
}

interface UseImageUploadReturn {
  imageUrl: string | null;
  imagePreview: string | null;
  upload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadInputRef: React.RefObject<HTMLInputElement | null>;
  authenticator: () => Promise<ImageKitAuthResponse>;
  handleUploadSuccess: (res: ImageKitUploadSuccessResult) => void;
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

  const authenticator = async () => {
    try {
      const response = await generationsApi.getImagekitAuth();
      return response.data;
    } catch (error) {
      console.error("ImageKit auth error:", error);
      throw new Error("Failed to authenticate with ImageKit");
    }
  };

  const upload = async (file: File) => {
    setIsUploading(true);
    toast.loading("Uploading image...");

    try {
      const authData = await authenticator();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append(
        "publicKey",
        import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY as string
      );
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);

      const response = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `ImageKit upload failed: ${errorData.message || "Unknown error"}`
        );
      }

      const result: ImageKitUploadSuccessResult = await response.json();
      handleUploadSuccess(result);
    } catch (error) {
      handleUploadError(error as Error);
    } finally {
      setIsUploading(false);
      toast.dismiss();
    }
  };

  const handleUploadSuccess = (res: ImageKitUploadSuccessResult) => {
    setImageUrl(res.url);
    setImagePreview(res.url);
    toast.success("Image uploaded successfully!");
  };

  const handleUploadError = (err: Error) => {
    console.error("ImageKit upload error:", err);
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
    authenticator,
    handleUploadSuccess,
    handleUploadError,
    setImagePreview,
    clearImage,
    setImageUrl,
  };
}
