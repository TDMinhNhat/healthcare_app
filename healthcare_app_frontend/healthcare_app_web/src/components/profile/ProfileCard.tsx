import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  styled,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
  avatar?: string;
  name?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: theme.shape.borderRadius,
}));

export const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  children,
  avatar,
  name,
}) => {
  const { t } = useTranslation();
  return (
    <StyledCard>
      <CardContent>
        {(avatar || name) && (
          <Box display="flex" alignItems="center" mb={2}>
            {avatar && (
              <Avatar
                src={avatar}
                alt={name || "Profile"}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
            )}
            {name && <Typography variant="h5">{name}</Typography>}
            <IconButton
              aria-label={t("common.edit")}
              sx={{ marginLeft: "auto" }}
            >
              <EditIcon />
            </IconButton>
          </Box>
        )}
        <Typography variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </StyledCard>
  );
};
