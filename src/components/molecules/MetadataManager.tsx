import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { MuiChipsInput } from "mui-chips-input";

export type MetadataForm = {
  fileName: string;
  description: string;
  tags: string[];
};

interface IMetaDataProps {
  metadata?: MetadataForm;
  showUpdateMetadataButton: boolean;
  onSubmit: (metadata: MetadataForm) => void;
}

function MetadataManager({
  metadata,
  showUpdateMetadataButton,
  onSubmit,
}: IMetaDataProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MetadataForm>({
    defaultValues: metadata,
  });

  const fileName = watch("fileName");
  const description = watch("description");

  useEffect(() => {
    reset(metadata);
  }, [metadata, reset]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg shadow-apple p-4"
    >
      <h2 className="text-lg font-medium text-neutral-800 mb-4">
        Template Metadata
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-2 flex flex-col">
        <Controller
          name="fileName"
          control={control}
          disabled={!showUpdateMetadataButton}
          render={({ field }) => (
            <TextField
              {...field}
              label="File Name"
              variant="outlined"
              fullWidth
              error={errors.fileName ? true : false}
              helperText={errors.fileName?.message}
              required
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          disabled={!showUpdateMetadataButton}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              error={errors.description ? true : false}
              helperText={errors.description?.message}
              required
            />
          )}
        />
        <Controller
          name="tags"
          control={control}
          disabled={!showUpdateMetadataButton}
          render={({ field }) => <MuiChipsInput {...field} />}
        />
        {showUpdateMetadataButton && (
          <Button
            variant="contained"
            disabled={!fileName || !description}
            type="submit"
          >
            Update
          </Button>
        )}
      </form>
    </motion.div>
  );
}

export default MetadataManager;
