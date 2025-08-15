import React from "react";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";

import "react-quill/dist/quill.snow.css";
import "./documentEditor.css";

interface DocumentEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  content,
  setContent,
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ReactQuill
        className="min-h-[500px] rounded-lg shadow-apple bg-white"
        theme="snow"
        value={content}
        onChange={(value) => setContent(value || "")}
      />
    </motion.div>
  );
};

export default DocumentEditor;
