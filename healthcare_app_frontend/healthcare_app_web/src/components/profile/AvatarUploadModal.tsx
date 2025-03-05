import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Avatar,
  styled,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTranslation } from "react-i18next";

interface AvatarUploadModalProps {
  open: boolean;
  currentAvatar: string;
  onClose: () => void;
  onSave: (newAvatar: string) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  open,
  currentAvatar,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = () => {
    // In a real application, you would upload the file to a server here
    // For now, we'll just pass the preview URL
    onSave(previewUrl);
    onClose();
  };

  const handleClose = () => {
    setPreviewUrl(currentAvatar);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("profile.changeAvatar")}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            my: 2,
          }}
        >
          <Avatar
            src={previewUrl}
            alt="Avatar Preview"
            sx={{ width: 150, height: 150, mb: 2 }}
          />

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            {t("common.uploadImage")}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Typography variant="caption" sx={{ mt: 1 }}>
              {file.name}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarUploadModal;
