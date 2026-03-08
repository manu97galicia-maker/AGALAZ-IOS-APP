'use client';

import { useRef, useState } from 'react';
import { Camera, Shirt, X, ImagePlus, Check } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  type: 'user' | 'clothing';
  image: string | null;
  onImageSelect: (base64: string | null) => void;
  icon?: React.ReactNode;
}

export function ImageUploader({ label, type, image, onImageSelect, icon }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-[9px] font-black text-white/25 uppercase tracking-widest px-1">
        {label}
      </span>
      <div
        className={`relative w-full rounded-2xl overflow-hidden transition-all ${
          image
            ? 'ring-2 ring-indigo-500/30'
            : isDragging
            ? 'ring-2 ring-indigo-500/50 bg-indigo-500/5'
            : 'glass'
        }`}
        style={{ aspectRatio: '3 / 4' }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {image ? (
          <div className="w-full h-full relative group">
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* Success indicator */}
            <div className="absolute top-2 left-2 bg-emerald-500/90 rounded-full p-1">
              <Check size={12} className="text-white" />
            </div>
            {/* Remove button */}
            <button
              onClick={() => onImageSelect(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors press-scale"
            >
              <X size={14} className="text-white" />
            </button>
            {/* Tap to change overlay */}
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100"
            >
              <div className="glass-dark px-3 py-2 rounded-full">
                <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">Change</span>
              </div>
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-full p-4 hover:bg-white/[0.03] transition-all press-scale"
          >
            <div className="p-3 glass rounded-2xl mb-3">
              {icon || (type === 'user' ? (
                <Camera size={20} className="text-white/30" />
              ) : (
                <Shirt size={20} className="text-white/30" />
              ))}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
              {type === 'user' ? 'Upload' : 'Upload'}
            </span>
            <ImagePlus size={12} className="text-white/10 mt-2" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={type === 'user' ? 'user' : undefined}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
