import { useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";
import { motion } from "framer-motion";

import { DocumentData } from "../../types/doc";

interface DocumentPreviewProps {
  document: DocumentData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.file && contentRef.current) {
      const arrayBuffer = document.file.arrayBuffer();
      renderAsync(arrayBuffer, contentRef.current);
    }
  }, [document.file]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-apple overflow-hidden flex flex-col h-full"
    >
      <div ref={contentRef} />
    </motion.div>
  );
};

export default DocumentPreview;
