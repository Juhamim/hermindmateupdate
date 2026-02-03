"use client";

import { Button } from "@/app/components/ui/Button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

declare global {
    interface Window {
        cloudinary: any;
    }
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if cloudinary is already loaded (e.g. from previous navigation)
        if (window.cloudinary) {
            setIsScriptLoaded(true);
        }
    }, []);

    const onUpload = useCallback((result: any) => {
        onChange(result.info.secure_url);
    }, [onChange]);

    if (!isMounted) return null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Fallback if credentials are minimal
    if (!cloudName || !uploadPreset) {
        return (
            <div className="space-y-2 border p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    Cloudinary not configured.
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Or enter image URL manualy..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={disabled}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4">
            <Script
                src="https://upload-widget.cloudinary.com/global/all.js"
                onLoad={() => setIsScriptLoaded(true)}
            />

            {value ? (
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-muted group shadow-sm transition-all hover:shadow-md">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            type="button"
                            onClick={() => onChange("")}
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-md"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <Image
                        fill
                        className="object-cover"
                        alt="Image"
                        src={value}
                    />
                </div>
            ) : (
                <div
                    onClick={() => {
                        console.log("Upload click:", { isScriptLoaded, hasCloudinary: !!window.cloudinary, disabled });
                        if ((window.cloudinary || isScriptLoaded) && !disabled) {
                            // Fallback to ensure we try if window.cloudinary exists even if isScriptLoaded state lagged
                            const cloudinary = window.cloudinary;
                            if (cloudinary) {
                                cloudinary.openUploadWidget({
                                    cloudName: cloudName,
                                    uploadPreset: uploadPreset,
                                    sources: ['local', 'url'],
                                    multiple: false,
                                    cropping: true,
                                    croppingAspectRatio: 1,
                                    showSkipCropButton: false,
                                }, (error: any, result: any) => {
                                    if (!error && result && result.event === "success") {
                                        onUpload(result);
                                    }
                                });
                            }
                        }
                    }}
                    className={`
                        w-full max-w-sm h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3
                        transition-all cursor-pointer bg-muted/10 
                        ${(disabled || !isScriptLoaded)
                            ? 'opacity-50 cursor-not-allowed border-muted-foreground/20'
                            : 'hover:bg-primary/5 hover:border-primary/50 border-muted-foreground/30'
                        }
                    `}
                >
                    <div className="p-3 rounded-full bg-background shadow-sm ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 group-hover:scale-110 transition-transform">
                        <ImagePlus className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-medium text-sm text-foreground/80">Click to upload</p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                    </div>
                </div>
            )}
        </div>
    );
}
