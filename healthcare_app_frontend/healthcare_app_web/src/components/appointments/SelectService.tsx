import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
// import { getSpecialties } from "../../services/specialty_service";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { getAllTypeDiseases } from "../../services/typeDisease_service.ts";

interface SelectSpecialtyProps {
  onSelect: (specialty: any) => void;
}

// Mock data for services
const mockServices = [
  {
    id: "1",
    name: "Khám Tim Mạch",
    imageUrl:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Khám Da Liễu",
    imageUrl:
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Khám Thần Kinh",
    imageUrl:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1529&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Khám Chỉnh Hình",
    imageUrl:
      "https://images.unsplash.com/photo-1614308457932-e16d90fb8b5f?q=80&w=1373&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Khám Nhi",
    imageUrl:
      "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?q=80&w=1471&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Tâm Lý Trị Liệu",
    imageUrl:
      "https://images.unsplash.com/photo-1566669437687-7040a6926753?q=80&w=1374&auto=format&fit=crop",
  },
  {
    id: "7",
    name: "Khám Mắt",
    imageUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1480&auto=format&fit=crop",
  },
  {
    id: "8",
    name: "Khám Tai Mũi Họng",
    imageUrl:
      "https://images.unsplash.com/photo-1589279003513-467d320f47eb?q=80&w=1470&auto=format&fit=crop",
  },
];

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
        const result: object = await getAllTypeDiseases().then(response => response.data.data).catch(error => {
          console.log(error);
          return null;
        })

        // Use mock data instead of API call
        // const response = await getSpecialties();
        // setServices(response.data.data || []);
        setServices(result);
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
                    <CardMedia
                      component="img"
                      sx={{ height: 140, objectFit: "cover" }}
                      image={
                        service.imageUrl ||
                        `https://picsum.photos/200/140?random=${service.id}`
                      }
                      alt={service.name}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
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
