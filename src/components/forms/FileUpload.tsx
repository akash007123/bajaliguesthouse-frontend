import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label?: string;
  error?: string;
  value?: File[];
  onChange: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  error,
  value,
  onChange,
  className,
  maxFiles,
  accept = "image/*,application/pdf"
}) => {
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value.length > 0) {
      const newPreviews: { url: string; type: string }[] = [];
      value.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const type = file.type.startsWith('image/') ? 'image' : 'pdf';
          newPreviews.push({ url: reader.result as string, type });
          if (newPreviews.length === value.length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setPreviews([]);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = (value || []).length;
    const maxToAdd = maxFiles ? Math.max(0, maxFiles - currentCount) : files.length;
    const filesToAdd = files.slice(0, maxToAdd);

    if (filesToAdd.length === 0) return;

    const newFiles = [...(value || []), ...filesToAdd];
    onChange(newFiles);
  };

  const handleRemove = (index: number) => {
    const newFiles = (value || []).filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="label-hotel">{label}</label>}

      <div className="flex flex-wrap gap-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border border-border flex items-center justify-center">
            {preview.type === 'image' ? (
              <img src={preview.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              <FileText className="w-12 h-12 text-muted-foreground" />
            )}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {(!maxFiles || previews.length < maxFiles) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              'w-32 h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-gold hover:bg-gold/5 transition-colors',
              error && 'border-destructive'
            )}
          >
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload Files</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};