import React from "react";
import { Grid, Typography, Divider, Box } from "@mui/material";
import { ProfileCard } from "./ProfileCard";
import { User } from "../../types/user";

export const PersonalInfoSection: React.FC<any> = ({
  firstName,
  lastName,
  email,
  phone,
  dob,
  sex,
  address,
  avatar,
}) => {
  const fullName = `${firstName} ${lastName}`;
  const fullAddress = `${address.number} ${address.street}, ${address.ward}, ${address.district}, ${address.city}, ${address.country}`;

  return (
    <ProfileCard title="Personal Information" avatar={avatar} name={fullName}>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <InfoItem label="Email" value={email} />
          <InfoItem label="Phone" value={phone} />
          <InfoItem label="Date of Birth" value={dob} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoItem label="Gender" value={sex === true ? "Male" : "Female"} />
          <InfoItem label="Address" value={fullAddress} />
        </Grid>
      </Grid>
    </ProfileCard>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Box mb={1}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);
