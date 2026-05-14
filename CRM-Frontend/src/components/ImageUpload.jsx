import { useRef, useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { validateImageFile, fileToBase64 } from "../constants";
import toast from "react-hot-toast";

const ImageUpload = ({ 
  value, 
  onChange, 
  label = "Image", 
  className = "",
  shape = "square" // "square" or "circle"
}) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setLoading(false);
    }

    // Reset input
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange("");
  };

  const shapeClasses = shape === "circle" 
    ? "rounded-full" 
    : "rounded-xl";

  return (
    <div className={className}>
      <label className="label">{label}</label>
      
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div 
          className={`relative w-24 h-24 ${shapeClasses} border-2 border-dashed border-gray-300 
            flex items-center justify-center bg-gray-50 overflow-hidden group`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600" />
          ) : value ? (
            <>
              <img 
                src={value} 
                alt="Preview" 
                className={`w-full h-full object-cover ${shapeClasses}`}
              />
              {/* Remove button overlay */}
              <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                transition-opacity flex items-center justify-center ${shapeClasses}`}>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <PhotoIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Upload button and info */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            {value ? "Change Image" : "Upload Image"}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            JPEG, PNG, GIF, WebP (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;