'use client';

import { useRef } from 'react';
import { Camera, Shirt, X } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  type: 'user' | 'clothing';
  image: string | null;
  onImageSelect: (base64: string | null) => void;
  icon?: React.ReactNode;
}

export function ImageUploader({ label, type, image, onImageSelect, icon }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
        {label}
      </span>
      <div
        className="relative w-full rounded-2xl bg-white border-2 border-dashed border-slate-200 overflow-hidden shadow-sm"
        style={{ aspectRatio: '3 / 4' }}
      >
        {image ? (
          <div className="w-full h-full relative">
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt={label}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onImageSelect(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-full p-4 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="p-3 bg-slate-50 rounded-full mb-3">
              {icon || (type === 'user' ? (
                <Camera size={20} className="text-slate-400" />
              ) : (
                <Shirt size={20} className="text-slate-400" />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">
              {type === 'user' ? 'Subir Foto' : 'Subir Prenda'}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
