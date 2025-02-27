import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";

interface DoctorDetailsProps {
  doctor: any;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  const { t } = useTranslation();

  // Mock additional data
  const education = [
    {
      id: 1,
      degree: "MD",
      institution: "Hanoi Medical University",
      year: "2005-2011",
    },
    {
      id: 2,
      degree: "Residency",
      institution: "Cho Ray Hospital",
      year: "2011-2014",
    },
  ];

  const experience = [
    {
      id: 1,
      position: "Specialist",
      hospital: "Bach Mai Hospital",
      year: "2014-2018",
    },
    {
      id: 2,
      position: "Senior Specialist",
      hospital: "Vinmec Hospital",
      year: "2018-Present",
    },
  ];

  const certifications = [
    "Board Certified in Internal Medicine",
    "Advanced Cardiac Life Support",
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.doctor_details")}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CardMedia
              component="img"
              sx={{ width: "100%", borderRadius: 1 }}
              image={doctor.image}
              alt={doctor.name}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h5" component="div">
              {doctor.name}
            </Typography>
            <Chip
              label={doctor.specialty}
              color="primary"
              sx={{ mt: 1, mb: 1 }}
            />
            <Typography variant="body1" color="text.secondary">
              {t("doctor.profile.experience")}: {doctor.experience}{" "}
              {t("doctor.profile.years")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Rating value={doctor.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({doctor.reviews} {t("doctor.profile.reviews")})
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t("doctor.profile.education")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {education.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.degree}
                    secondary={`${item.institution} (${item.year})`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <WorkIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t("doctor.profile.experience")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {experience.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.position}
                    secondary={`${item.hospital} (${item.year})`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <StarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t("doctor.profile.certificates")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {certifications.map((cert, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText primary={cert} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDetails;
