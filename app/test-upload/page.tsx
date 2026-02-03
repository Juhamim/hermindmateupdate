"use client";

import { ImageUpload } from "@/app/components/ui/ImageUpload";
import { useState } from "react";

export default function TestUploadPage() {
    const [imageUrl, setImageUrl] = useState("");

    return (
        <div className="p-10">
            <h1 className="text-2xl mb-4">Test Upload</h1>
            <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
            />
        </div>
    );
}
