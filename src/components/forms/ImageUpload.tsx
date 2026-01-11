import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label?: string;
  error?: string;
  value?: string[];
  onChange: (images: string[]) => void;
  className?: string;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  error,
  value,
  onChange,
  className,
  maxImages
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviews(value || []);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = previews.length;
    const maxToAdd = maxImages ? Math.max(0, maxImages - currentCount) : files.length;
    const filesToProcess = files.slice(0, maxToAdd);

    if (filesToProcess.length === 0) return;

    const newPreviews: string[] = [];
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === filesToProcess.length) {
          setPreviews(prev => [...prev, ...newPreviews]);
          onChange([...(value || []), ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = (value || []).filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="label-hotel">{label}</label>}

      <div className="flex flex-wrap gap-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {(!maxImages || previews.length < maxImages) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              'w-32 h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-gold hover:bg-gold/5 transition-colors',
              error && 'border-destructive'
            )}
          >
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload Images</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
