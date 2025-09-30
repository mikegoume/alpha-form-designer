import { forwardRef, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  DownloadIcon,
  Edit,
  FormInput,
  MoreVertical,
  Trash2,
} from "lucide-react";

import {
  deleteTemplate,
  fetchTemplate,
  updateTemplate,
  updateTemplateApiArgs,
} from "../../api/templates";
import DocumentPreview from "../../components/molecules/DocumentPreview";
import MetadataManager, {
  MetadataForm,
} from "../../components/molecules/MetadataManager";
import PlaceholderManager from "../../components/molecules/PlaceholderManager";
import TemplatesBuilderHeader from "../../components/molecules/TemplatesBuilderHeader";

// Slide transition for dialog
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TemplateManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const client = useQueryClient();

  const [documentMetadata, setDocumentMetadata] = useState<MetadataForm>();
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const { data: templateData, isLoading } = useQuery({
    queryKey: ["template", id],
    queryFn: () => fetchTemplate(id as string),
    enabled: !!id,
  });

  const updateTemplateMutation = useMutation({
    mutationKey: ["update-template", id],
    mutationFn: (dataToUpdate: updateTemplateApiArgs) =>
      updateTemplate(dataToUpdate),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [id, "templates"] });
      setIsEditing(false);
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationKey: ["delete-template", id],
    mutationFn: (id: number) => deleteTemplate(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [id, "templates"] });
      navigate(-1);
    },
  });

  const template = templateData?.data;

  useEffect(() => {
    if (template && !documentMetadata) {
      setDocumentMetadata(() => ({
        fileName: template?.name ?? "",
        description: template?.description ?? "",
        tags: [],
      }));
    }
  }, [documentMetadata, template]);

  const onMetadataUpdate = (metadata: MetadataForm) => {
    setDocumentMetadata(metadata);
  };

  const handleEditorSave = () => {
    const dataToUpdate = {
      id: parseInt(id as string, 10),
      name: documentMetadata?.fileName ?? "",
      description: documentMetadata?.description ?? "",
      version: template?.version ?? "",
      filename: template?.filename ?? "",
      data: template?.data ?? "",
      creationTs: template?.creationTs ?? "",
    };

    updateTemplateMutation.mutate(dataToUpdate);
  };

  const isUploading = useMemo(() => template?.name === undefined, [template]);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleConfirmDelete = () => {
    deleteTemplateMutation.mutate(parseInt(id as string, 10));
    handleCloseDeleteDialog();
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleCloseMenu();
  };

  const handleFill = () => {
    navigate("fill");
    handleCloseMenu();
  };

  const renderActionButtons = () => {
    if (isEditing) {
      return (
        <Button
          variant="contained"
          className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          onClick={handleEditorSave}
          disabled={
            documentMetadata?.fileName === "" ||
            documentMetadata?.description === ""
          }
        >
          Save
        </Button>
      );
    } else {
      return isUploading ? (
        <Button
          variant="contained"
          className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          disabled={isLoading}
        >
          <DownloadIcon className="h-4 w-4" />
          Save
        </Button>
      ) : (
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
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <Edit size={18} />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleFill}
              disabled={template?.forms.length === 0}
            >
              <ListItemIcon>
                <FormInput size={18} />
              </ListItemIcon>
              <ListItemText>Fill</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleOpenDeleteDialog}>
              <ListItemIcon>
                <Trash2 size={18} color="#dc2626" />
              </ListItemIcon>
              <ListItemText sx={{ color: "#dc2626" }}>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </>
      );
    }
  };

  return (
    template && (
      <div className="flex-1 flex flex-col bg-neutral-100">
        <TemplatesBuilderHeader
          title={isEditing ? "Edit Template" : "Template Preview"}
          actionButtons={renderActionButtons()}
        />
        <main className="flex-1 py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <DocumentPreview document={template} />
            </div>
            <div className="space-y-6">
              <MetadataManager
                metadata={documentMetadata}
                showUpdateMetadataButton={isEditing}
                onSubmit={onMetadataUpdate}
              />
              <PlaceholderManager placeholders={template.placeholders} />
            </div>
          </div>
        </main>

        {/* DELETE CONFIRMATION DIALOG */}
        <Dialog
          open={openDeleteDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDeleteDialog}
          maxWidth="xs"
          fullWidth
          slotProps={{
            paper: {},
          }}
        >
          <DialogTitle className="font-bold text-xl">
            Delete Template
          </DialogTitle>
          <DialogContent>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{template?.name}</span>? <br />
              All forms related to this template will be deleted too!
            </p>

            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertTriangle size={25} className="text-red-600" />
              <div>
                <p className="font-semibold text-red-700">Warning</p>
                <p className="text-sm text-red-600">
                  By deleting this template, you won&apos;t be able to recover
                  it or its related forms.
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="">
            <Button
              onClick={handleCloseDeleteDialog}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-primary-100"
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
              className="border border-red-600 bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:shadow-sm"
              disabled={deleteTemplateMutation.isLoading}
            >
              <Trash2 size={18} className="text-white mr-2" />
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  );
}

export default TemplateManagement;
