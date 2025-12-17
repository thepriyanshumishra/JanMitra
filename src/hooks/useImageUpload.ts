import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseImageUploadReturn {
    image: File | null;
    previewUrl: string | null;
    base64: string | null;
    handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearImage: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | null>(null);

    const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const clearImage = useCallback(() => {
        setImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setBase64(null);
    }, [previewUrl]);

    return {
        image,
        previewUrl,
        base64,
        handleImageSelect,
        clearImage,
    };
}
