import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button, TextField } from '@mui/material';
import { useEffect } from 'react';

export type MetadataForm = {
	fileName: string;
	description: string;
	tags: string[];
};

interface IMetaDataProps {
	metadata: MetadataForm;
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
	} = useForm<MetadataForm>({
		defaultValues: metadata,
	});

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
				Document Metadata
			</h2>
			{!showUpdateMetadataButton ? (
				<div className="flex flex-col gap-2">
					{Object.keys(metadata).map((key) => (
						<div key={key}>
							<p>{key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}:</p>
							<p>{metadata[key as keyof MetadataForm]}</p>
						</div>
					))}
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="gap-2 flex flex-col">
					<Controller
						name="fileName"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="File Name"
								variant="outlined"
								fullWidth
								error={errors.fileName ? true : false}
								helperText={errors.fileName?.message}
							/>
						)}
					/>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Description"
								variant="outlined"
								fullWidth
								multiline
								error={errors.description ? true : false}
								helperText={errors.description?.message}
							/>
						)}
					/>
					<Controller
						name="tags"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Tags"
								variant="outlined"
								fullWidth
								error={errors.tags ? true : false}
								helperText={errors.tags?.message}
							/>
						)}
					/>

					<Button type="submit" color="primary" variant="contained">
						Update
					</Button>
				</form>
			)}
		</motion.div>
	);
}

export default MetadataManager;
