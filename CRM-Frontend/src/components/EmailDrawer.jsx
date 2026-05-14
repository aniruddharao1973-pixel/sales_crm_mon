import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const EmailDrawer = ({ open, onClose, toEmail = "" }) => {
  const [form, setForm] = useState({
    to: toEmail,
    subject: "",
  });

  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const handleSend = async () => {
    try {
      setLoading(true);

      await API.post("/email/send", {
        ...form,
        html: editor.getHTML(),
      });

      toast.success("Email sent ✅");
      onClose();
    } catch {
      toast.error("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Send Email</h2>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
          <input
            className="input"
            placeholder="To"
            value={form.to}
            onChange={(e) =>
              setForm({ ...form, to: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
          />

          {/* TOOLBAR */}
          <div className="flex gap-2 border p-2 rounded">
            <button onClick={() => editor.chain().focus().toggleBold().run()}>
              <b>B</b>
            </button>

            <button onClick={() => editor.chain().focus().toggleItalic().run()}>
              <i>I</i>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </button>
          </div>

          {/* EDITOR */}
          <EditorContent editor={editor} className="border p-3 rounded min-h-[200px]" />
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          <button onClick={handleSend} className="btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDrawer;