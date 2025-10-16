import { forwardRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  MoreVertical,
  Pause,
  Play,
  Save,
  Trash2,
} from "lucide-react";

import { deleteForm } from "../../api/forms";
import { ButtonElement, FormConfig } from "../../types/form";

// Slide transition for dialog
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IFormBuilderHeaderProps {
  formConfig: FormConfig;
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig>>;
  handleSaveConfig: () => void;
  handleDeleteForm?: () => void;
  previewMode: boolean;
  togglePreviewMode: () => void;
}

function FormBuilderHeader({
  formConfig,
  setFormConfig,
  handleSaveConfig,
  previewMode,
  togglePreviewMode,
}: IFormBuilderHeaderProps) {
  const client = useQueryClient();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const openMenu = Boolean(anchorEl);

  const deleteFromMutation = useMutation({
    mutationKey: ["delete-form", formConfig.id],
    mutationFn: (id: number) => deleteForm(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [formConfig.id, "forms"] });
      navigate(-1);
    },
  });

  const isSaveDisabled =
    formConfig.formVariables.filter(
      (element) => (element as ButtonElement).actionType === "submit",
    ).length === 0;

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    if (formConfig.id) {
      deleteFromMutation.mutate(formConfig.id);
      handleCloseDeleteDialog();
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 pt-4 flex-col gap-4">
        <div className="px-8 mb-8 flex items-start justify-between gap-12">
          <div className="gap-4 flex flex-col w-1/2">
            <h1 className="text-2xl font-bold text-neutral-800 inline">
              Dynamic Form Designer
            </h1>
            <TextField
              label="Form Name"
              value={formConfig.name}
              fullWidth
              id="input-with-icon-textfield"
              onChange={(e) =>
                setFormConfig((prevFormConfig: FormConfig) => ({
                  ...prevFormConfig,
                  name: e.target.value,
                }))
              }
              placeholder="Form Name"
            />
          </div>
          <div className="flex flex-row gap-6 items-center">
            <>
              <IconButton
                onClick={handleClickMenu}
                aria-label="more options"
                aria-controls={openMenu ? "template-actions-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
              >
                <MoreVertical size={24} />
              </IconButton>
              <Menu
                id="template-actions-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                MenuListProps={{
                  "aria-labelledby": "template-actions-button",
                }}
              >
                <MenuItem
                  onClick={togglePreviewMode}
                  disabled={formConfig.formVariables.length === 0}
                >
                  <ListItemIcon>
                    {previewMode ? <Pause size={18} /> : <Play size={18} />}
                  </ListItemIcon>
                  <ListItemText>
                    {previewMode ? "Exit Preview" : "Preview Form"}
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSaveConfig} disabled={isSaveDisabled}>
                  <ListItemIcon>
                    <Save size={18} />
                  </ListItemIcon>
                  <ListItemText>Save Form</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpenDeleteDialog}>
                  <ListItemIcon>
                    <Trash2 size={18} color="#dc2626" />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "#dc2626" }}>
                    Delete Form
                  </ListItemText>
                </MenuItem>
              </Menu>
            </>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-bold text-xl">Delete Form</DialogTitle>
        <DialogContent>
          <p className="mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{formConfig.name}</span>?
          </p>

          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
            <AlertTriangle size={25} className="text-red-600" />
            <div>
              <p className="font-semibold text-red-700">Warning</p>
              <p className="text-sm text-red-600">
                This action cannot be undone. All form data and configuration
                will be permanently deleted.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            className=" px-4 py-2 rounded-md hover:bg-primary-100"
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            className="border border-red-600 bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:shadow-sm"
          >
            <Trash2 size={18} className="mr-2" />
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FormBuilderHeader;
