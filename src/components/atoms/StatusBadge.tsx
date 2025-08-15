const StatusBadge = ({ status }: { status: string }) => {
  if (status === "staged") {
    return (
      <div className="absolute top-0 right-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 p-2 rounded-md">
        Staged
      </div>
    );
  }
  if (status === "published") {
    return (
      <div className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100 p-2 rounded-md">
        Published
      </div>
    );
  }
  return null;
};

export default StatusBadge;
