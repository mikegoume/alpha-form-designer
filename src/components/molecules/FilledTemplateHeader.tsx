interface IFilledTemplateHeaderProps {
  showDownloadButton?: boolean;
}

function FilledTemplateHeader({
  showDownloadButton,
}: IFilledTemplateHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 py-4 flex-col gap-4">
      <div className="px-8 flex flex-col justify-between">
        <p className="text-2xl font-semibold tracking-tight leading-8">
          Fill Template
        </p>
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
