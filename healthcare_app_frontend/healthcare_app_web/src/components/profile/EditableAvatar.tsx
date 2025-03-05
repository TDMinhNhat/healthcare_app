import React, { useState } from "react";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useTranslation } from "react-i18next";

interface EditableAvatarProps {
  src: string;
  alt: string;
  size?: number;
  onEditAvatar: () => void;
}

const EditableAvatar: React.FC<EditableAvatarProps> = ({
  src,
  alt,
  size = 100,
  onEditAvatar,
}) => {
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        margin: "0 auto",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar
        src={src}
        alt={alt}
        sx={{
          width: size,
          height: size,
          border: "3px solid #fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      />

      {isHovering && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
          }}
        >
          <Tooltip title={t("profile.changeAvatar")}>
            <IconButton
              onClick={onEditAvatar}
              size="small"
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default EditableAvatar;
