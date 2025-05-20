
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  onImageUrl: (url: string) => void;
  currentImageUrl?: string;
  folder?: string;
}

export default function ImageUploader({ onImageUrl, currentImageUrl, folder = "products" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("الرجاء اختيار ملف صورة فقط");
      return;
    }
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to storage
    setIsUploading(true);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      onImageUrl(publicUrl);
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={isUploading}
      />
      
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded-md" 
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-8 w-8"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-32 border-dashed flex flex-col items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="mt-2">جاري الرفع...</span>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <span>اضغط لرفع صورة</span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, GIF
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
