import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinaryService';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  recommendedSize?: string;
  darkTheme?: boolean;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  folder = 'vidisha-businesses',
  placeholder = 'https://...',
  recommendedSize,
  darkTheme = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const secureUrl = await uploadToCloudinary(file, folder);
      onChange(secureUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError(null);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className={`block font-bold text-xs ${darkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
            {label}
          </label>
          {recommendedSize && (
            <span className="text-[10px] text-slate-400 font-normal">
              {recommendedSize}
            </span>
          )}
        </div>
      )}

      {/* Upload Box / Preview Area */}
      <div
        className={`relative rounded-xl border transition-all ${
          darkTheme
            ? 'bg-[#181820] border-[#2e2e38]'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        {value ? (
          /* Preview state */
          <div className="p-2 flex items-center space-x-3">
            <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-900/10 shrink-0 border border-slate-200 dark:border-slate-700 relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${darkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                {value.includes('cloudinary.com') ? 'Uploaded to Cloudinary' : value}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`text-[11px] font-semibold flex items-center space-x-1 ${
                    darkTheme ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Change photo</span>
                </button>
                <span className="text-slate-400 text-xs">•</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] font-semibold text-red-500 hover:text-red-600 flex items-center space-x-0.5"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Upload trigger state */
          <div className="p-3 text-center">
            {isUploading ? (
              <div className="py-2 flex flex-col items-center justify-center space-y-1.5">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <span className={`text-xs font-medium ${darkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
                  Uploading photo to Cloudinary...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all ${
                      darkTheme
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo to Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold inline-flex items-center space-x-1 border transition-all ${
                      darkTheme
                        ? 'border-[#3a3a46] text-slate-300 hover:bg-[#252530]'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showUrlInput ? 'Hide URL' : 'Paste URL'}</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">
                  PNG, JPG, or WebP up to 10MB
                </span>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Manual URL input fallback */}
      {showUrlInput && !value && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-all ${
            darkTheme
              ? 'bg-[#141418] border-[#2e2e38] text-white focus:border-blue-500'
              : 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
          }`}
        />
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-[11px] font-medium text-red-500 flex items-center space-x-1 mt-1">
          <span>⚠️</span>
          <span>{uploadError}</span>
        </p>
      )}
    </div>
  );
};
