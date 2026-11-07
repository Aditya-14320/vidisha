/**
 * Cloudinary Photo & Image Upload Service
 * Integrates with Cloudinary Cloud: 'dmqyfhjbt' & Unsigned Preset: 'vidishacity'
 */

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmqyfhjbt',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'vidishacity',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '353561552421922',
};

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload an image file (PNG, JPG, WebP) directly to Cloudinary
 * Returns the secure HTTPS URL
 */
export async function uploadToCloudinary(
  file: File | Blob,
  folder: string = 'vidisha-businesses'
): Promise<string> {
  if (!file) {
    throw new Error('Please select an image file to upload.');
  }

  // Basic client-side check
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image. Please choose a JPEG, PNG, or WebP photo.');
  }

  // 10MB size limit
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size is too large (max 10MB allowed).');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetails = `Upload failed (Status ${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorDetails = errJson.error.message;
      }
    } catch (_) {
      // ignore json parse error
    }
    throw new Error(`Cloudinary Error: ${errorDetails}`);
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error('Cloudinary did not return a valid image URL.');
  }

  return data.secure_url;
}
