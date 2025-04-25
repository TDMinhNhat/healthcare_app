import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router";
import { ROUTING } from "../../constants/routing";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => navigate(ROUTING.HOME)}
    >
      <Box
        component="img"
        src={"/logo2.png"}
        alt="Medicare Logo"
        sx={{
          height: 40, // Increased from 24 to 40 for a larger logo
          mr: 1,
        }}
      />
      <Typography variant="h6" color="primary.main" sx={{ fontWeight: "bold" }}>
        SolarHealth
      </Typography>
    </Box>
  );
}
