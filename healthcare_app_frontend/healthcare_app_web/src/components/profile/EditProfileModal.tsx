import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Address } from "../../types";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    sex: boolean | string;
    address: Address | null;
  };
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  onSave,
  userData,
}) => {
  const { t } = useTranslation();

  // Initialize formData with default values for any null fields
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    dob: userData.dob || "",
    sex: userData.sex !== undefined ? userData.sex : "",
    address: userData.address || {
      id: null,
      number: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name?.includes(".")) {
      // Handle nested address fields
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value,
        },
      });
    } else if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("profile.editPersonalInfo")}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.firstName")}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.lastName")}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.email")}
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.phone")}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.dob")}
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>{t("profile.sex")}</InputLabel>
                <Select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  label={t("profile.sex")}
                >
                  <MenuItem value={true}>{t("profile.male")}</MenuItem>
                  <MenuItem value={false}>{t("profile.female")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                {t("profile.address")}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.address.number")}
                name="address.number"
                value={formData.address?.number || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.address.street")}
                name="address.street"
                value={formData.address?.street || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.address.ward")}
                name="address.ward"
                value={formData.address?.ward || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("profile.address.district")}
                name="address.district"
                value={formData.address?.district || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label={t("profile.address.city")}
                name="address.city"
                value={formData.address?.city || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="submit" variant="contained" color="primary">
            {t("common.save")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
