interface ITemplatesHeaderProps {
  title: string;
  actionButtons?: React.ReactNode;
}

function TemplatesBuilderHeader({
  title,
  actionButtons,
}: ITemplatesHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 pt-4">
      <div className="px-8 mb-8 flex items-center justify-between">
        <p className="text-2xl font-semibold tracking-tight leading-8">
          {title}
        </p>
        {actionButtons}
      </div>
    </div>
  );
}

export default TemplatesBuilderHeader;
