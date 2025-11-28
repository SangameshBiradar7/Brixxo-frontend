'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

export default function DragDropUpload({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  maxSizeMB = 10,
  className = ''
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file, index) => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only images are allowed.`);
        return;
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds ${maxSizeMB}MB limit.`);
        return;
      }

      // Check if we're exceeding max files
      if (selectedFiles.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors[0]); // Show first error
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    }

    return validFiles;
  }, [acceptedTypes, maxSizeMB, maxFiles, selectedFiles.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [validateFiles, onFilesSelected]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [validateFiles, onFilesSelected]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver
            ? 'border-teal-500 bg-teal-50'
            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
          }
          ${selectedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={selectedFiles.length >= maxFiles}
        />

        <div className="flex flex-col items-center">
          <Upload className={`w-12 h-12 mb-4 ${isDragOver ? 'text-teal-500' : 'text-gray-400'}`} />
          <div className="text-lg font-medium text-gray-900 mb-2">
            {selectedFiles.length >= maxFiles
              ? `Maximum ${maxFiles} files reached`
              : 'Drop files here or click to browse'
            }
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Supports: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
          </p>
          <p className="text-xs text-gray-400">
            Maximum {maxFiles} files, {maxSizeMB}MB each
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length}/{maxFiles})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* File preview */}
                <div className="flex items-center space-x-3">
                  {isImageFile(file) ? (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onLoad={(e) => {
                          // Clean up object URL after image loads
                          setTimeout(() => URL.revokeObjectURL(e.currentTarget.src), 1000);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}