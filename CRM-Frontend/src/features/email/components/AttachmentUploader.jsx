// email\components\AttachmentUploader.jsx
import { useDispatch, useSelector } from "react-redux";
import {
  uploadAttachments,
  removeAttachment,
} from "../emailSlice";

import {
  PaperClipIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/* ───────── HELPERS ───────── */

const getIcon = (type) => {
  if (type?.includes("image")) return PhotoIcon;
  return DocumentIcon;
};

const formatSize = (size) => {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

/* ───────── COMPONENT ───────── */

export default function AttachmentUploader() {
  const dispatch = useDispatch();
  const { attachments, uploadingAttachments } = useSelector(
    (state) => state.email,
  );

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    dispatch(uploadAttachments(fileArray));
  };

  return (
    <div className="space-y-3">
      {/* DROP ZONE */}
      <label
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-5 cursor-pointer
        hover:border-blue-400 hover:bg-blue-50/40 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <PaperClipIcon className="w-5 h-5 text-gray-400" />

        <p className="text-sm text-gray-600">
          Drag & drop or{" "}
          <span className="text-blue-600 font-medium">browse files</span>
        </p>

        <input
          type="file"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* LOADING */}
      {uploadingAttachments && (
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          Uploading...
        </div>
      )}

      {/* FILE LIST */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((file) => {
            const Icon = getIcon(file.fileType);

            return (
              <div
                key={file.fileUrl}
                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* ICON */}
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatSize(file.fileSize)}
                  </p>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => dispatch(removeAttachment(file.fileUrl))}
                  className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-500 transition"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
