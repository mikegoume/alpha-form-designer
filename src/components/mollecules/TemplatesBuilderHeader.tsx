interface ITemplatesHeaderProps {
  title: string;
  actionButtons?: React.ReactNode;
}

function TemplatesBuilderHeader({
  title,
  actionButtons,
}: ITemplatesHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-8 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
        {actionButtons}
      </div>
    </div>
  );
}

export default TemplatesBuilderHeader;
