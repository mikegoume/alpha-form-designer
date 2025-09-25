import { useNavigate } from "react-router";
import { Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

function FormsHeader() {
  const navigate = useNavigate();

  const {
    user: { isAdmin },
  } = useAuth();

  const handleCreatePress = () => {
    navigate("create");
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 py-4 flex-col gap-4">
      <div className="flex flex-row items-center justify-between px-8">
        <div className=" flex flex-col justify-between">
          <p className="text-2xl font-semibold tracking-tight leading-8">
            Forms
          </p>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Manage your forms
          </Typography>
        </div>
        {isAdmin && (
          <Button
            variant="contained"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
            onClick={handleCreatePress}
          >
            <Plus className="h-4 w-4" />
            Create Form
          </Button>
        )}
      </div>
    </div>
  );
}

export default FormsHeader;
