/**
 * Resize an image file to specified dimensions using Canvas API
 * @param file - The image file to resize
 * @param maxWidth - Maximum width (default: 512)
 * @param maxHeight - Maximum height (default: 512)
 * @returns Promise<Blob> - The resized image as a Blob
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 512,
  maxHeight: number = 512
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate dimensions
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas size
        canvas.width = maxWidth;
        canvas.height = maxHeight;

        // Fill with white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, maxWidth, maxHeight);

        // Center the image
        const x = (maxWidth - width) / 2;
        const y = (maxHeight - height) / 2;

        // Draw image
        ctx.drawImage(img, x, y, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not create blob"));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => reject(new Error("Could not load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @returns Error message or null if valid
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): string | null {
  const validTypes = ["image/jpeg", "image/png"];

  if (!validTypes.includes(file.type)) {
    return "Only JPEG and PNG images are allowed";
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  return null;
}
