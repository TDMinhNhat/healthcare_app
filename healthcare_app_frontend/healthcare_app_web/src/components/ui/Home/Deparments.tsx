import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  LocalHospital,
  Healing,
  Science,
  Biotech,
  Medication,
  Psychology,
  AccessibilityNew,
  MedicalServices,
} from "@mui/icons-material";

const departments = [
  {
    icon: <LocalHospital />,
    title: "Neurology",
    description: "Specialized care for neurological conditions",
  },
  {
    icon: <Healing />,
    title: "Cardiology",
    description: "Expert heart care and treatment",
  },
  {
    icon: <Science />,
    title: "Surgery",
    description: "Advanced surgical procedures",
  },
  {
    icon: <Biotech />,
    title: "Ophthalmology",
    description: "Complete eye care services",
  },
  {
    icon: <Medication />,
    title: "Dental",
    description: "Comprehensive dental care",
  },
  {
    icon: <Psychology />,
    title: "Ophthalmology",
    description: "Mental health services",
  },
  {
    icon: <AccessibilityNew />,
    title: "Podiatry",
    description: "Foot and ankle treatment",
  },
  {
    icon: <MedicalServices />,
    title: "Orthopedics",
    description: "Bone and joint care",
  },
];

export default function Departments() {
  return (
    <Box sx={{ py: 8, backgroundColor: "primary.main", color: "white" }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Our Departments
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {departments.map((dept) => (
            <Grid item xs={12} sm={6} md={3} key={dept.title}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{dept.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {dept.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {dept.description}
                  </Typography>
                  <Button variant="outlined" color="inherit" size="small">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
