import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = <InboxIcon sx={{ fontSize: 60, color: "text.secondary" }} />,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        ...sx,
      }}
    >
      {icon}
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
