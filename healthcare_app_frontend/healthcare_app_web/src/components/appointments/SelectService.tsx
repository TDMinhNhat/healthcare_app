import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
// import { getSpecialties } from "../../services/specialty_service";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { getAllTypeDiseases } from "../../services/authenticate/typeDisease_service.ts";

interface SelectSpecialtyProps {
  onSelect: (specialty: any) => void;
}

const SelectService: React.FC<SelectSpecialtyProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with setTimeout
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate network delay
        const result: any = await getAllTypeDiseases()
          .then((response) => response.data.data)
          .catch((error) => {
            console.log(error);
            return [];
          });

        // lọc các dịch vụ đang hoạt động
        const activeServices = result.filter(
          (service: any) => service.status === true
        );

        // Use mock data instead of API call
        // const response = await getSpecialties();
        // setServices(response.data.data || []);
        setServices(activeServices);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Failed to load services. Please try again.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.select_service")}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", my: 4 }}>
          {error}
        </Typography>
      ) : (
        <>
          {services.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                my: 4,
                p: 3,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              }}
            >
              <MedicalServicesIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                {t("patient.appointments.no_services")}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item xs={6} sm={4} md={3} key={service.id}>
                  <Card
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 4,
                      },
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={() => onSelect(service)}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: 2, // Added padding to improve appearance without image
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {service.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default SelectService;
