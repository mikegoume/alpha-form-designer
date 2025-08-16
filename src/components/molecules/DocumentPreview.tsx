import { useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";
import { motion } from "framer-motion";

import { Template } from "../../types/templates";

interface DocumentPreviewProps {
  document: Template;
}

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.data && contentRef.current) {
      let arrayBuffer: ArrayBuffer;

      // If your data is already an ArrayBuffer, use it directly
      if (document.data instanceof ArrayBuffer) {
        arrayBuffer = document.data;
      } else if (typeof document.data === "string") {
        // Otherwise decode base64
        arrayBuffer = base64ToArrayBuffer(document.data);
      } else {
        console.error("Unsupported document.data type", typeof document.data);
        return;
      }

      renderAsync(arrayBuffer, contentRef.current);
    }
  }, [document.data]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-apple overflow-hidden flex flex-col h-full"
    >
      <div ref={contentRef} className="overflow-auto" />
    </motion.div>
  );
};

export default DocumentPreview;
