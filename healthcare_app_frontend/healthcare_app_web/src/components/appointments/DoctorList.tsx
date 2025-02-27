import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Avatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface DoctorListProps {
  selectedDate: Date;
  selectedTime: string;
  onSelect: (doctor: any) => void;
  onBack: () => void;
}

// Mock doctor data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Nguyen Van A",
    specialty: "Cardiology",
    experience: 10,
    rating: 4.8,
    reviews: 120,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Dr. Tran Thi B",
    specialty: "Neurology",
    experience: 8,
    rating: 4.6,
    reviews: 95,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Dr. Le Van C",
    specialty: "Dermatology",
    experience: 12,
    rating: 4.9,
    reviews: 150,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Dr. Pham Thi D",
    specialty: "Pediatrics",
    experience: 15,
    rating: 4.7,
    reviews: 200,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

const DoctorList: React.FC<DoctorListProps> = ({
  selectedDate,
  selectedTime,
  onSelect,
  onBack,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call to fetch available doctors
    const fetchDoctors = async () => {
      setLoading(true);
      // In a real app, you would fetch this data from your API
      // const response = await api.getAvailableDoctors(selectedDate, selectedTime);
      setTimeout(() => {
        setDoctors(mockDoctors);
        setLoading(false);
      }, 1000);
    };

    fetchDoctors();
  }, [selectedDate, selectedTime]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.available_doctors")}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {doctors.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ my: 4, textAlign: "center" }}
            >
              {t("patient.appointments.no_doctors_available")}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {doctors.map((doctor) => (
                <Grid item xs={12} md={6} key={doctor.id}>
                  <Card sx={{ display: "flex", height: "100%" }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, objectFit: "cover" }}
                      image={doctor.image}
                      alt={doctor.name}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography component="div" variant="h6">
                          {doctor.name}
                        </Typography>
                        <Chip
                          label={doctor.specialty}
                          size="small"
                          color="primary"
                          sx={{ mt: 1, mb: 1 }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          component="div"
                        >
                          {t("doctor.profile.experience")}: {doctor.experience}{" "}
                          {t("doctor.profile.years")}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Rating
                            value={doctor.rating}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            ({doctor.reviews} {t("doctor.profile.reviews")})
                          </Typography>
                        </Box>
                      </CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          pl: 1,
                          pb: 1,
                          justifyContent: "flex-end",
                          pr: 2,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => onSelect(doctor)}
                          variant="contained"
                        >
                          {t("patient.appointments.select")}
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={onBack}>{t("common.back")}</Button>
      </Box>
    </Box>
  );
};

export default DoctorList;
