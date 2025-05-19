import React, { useState } from "react";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface EditableAvatarProps {
  src: string;
  alt: string;
  size?: number;
  onEditAvatar: () => void;
}
/*
Chỉ hiển thị avatar hiện tại cùng với hiệu ứng hover để hiển thị nút chỉnh sửa (icon camera)
Khi người dùng nhấn vào nút chỉnh sửa, nó gọi hàm onEditAvatar để mở modal upload
Không thực hiện việc tải lên ảnh mới
*/
const EditableAvatar: React.FC<EditableAvatarProps> = ({
  src,
  alt,
  size = 100,
  onEditAvatar,
}) => {
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
          <Tooltip title="Thay đổi ảnh đại diện">
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
