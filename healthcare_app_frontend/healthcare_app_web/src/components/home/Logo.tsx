import { Typography, Box } from "@mui/material";
import { LocalHospital } from "@mui/icons-material";
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
      <LocalHospital sx={{ color: "primary.main", mr: 1 }} />
      <Typography variant="h6" color="primary.main" sx={{ fontWeight: "bold" }}>
        Medicare
      </Typography>
    </Box>
  );
}
