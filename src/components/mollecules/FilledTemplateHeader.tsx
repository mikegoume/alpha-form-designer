interface IFilledTemplateHeaderProps {
  showDownloadButton?: boolean;
}

function FilledTemplateHeader({
  showDownloadButton,
}: IFilledTemplateHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container px-8 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Fill Template</h1>
        {showDownloadButton && (
          <button className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors">
            Download
          </button>
        )}
      </div>
    </div>
  );
}

export default FilledTemplateHeader;
