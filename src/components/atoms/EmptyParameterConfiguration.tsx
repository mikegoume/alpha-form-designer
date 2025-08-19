import { Settings } from "lucide-react";

function EmptyParameterConfiguration() {
  return (
    <div className="flex flex-col items-center">
      <Settings />
      <p>No Parameters configures</p>
      <p>Add parameters to send data with API call</p>
    </div>
  );
}

export default EmptyParameterConfiguration;
