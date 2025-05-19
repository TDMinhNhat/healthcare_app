import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Logo from "./Logo";
import { useNavigate } from "react-router";
import { ROUTING } from "../../constants/routing";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "none",
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(2),
}));

export default function Navbar() {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => {
    switch (route) {
      case ROUTING.HOME:
        navigate(ROUTING.HOME);
        break;
      case ROUTING.DASHBOARD:
        navigate(ROUTING.DASHBOARD);
        break;
      case ROUTING.PROFILE:
        navigate(ROUTING.PROFILE);
        break;
      case ROUTING.ADMIN:
        navigate(ROUTING.ADMIN);
        break;
      case ROUTING.REGISTER:
        navigate(ROUTING.REGISTER);
        break;
      case ROUTING.LOGIN:
        navigate(ROUTING.LOGIN);
        break;
      default:
        navigate(ROUTING.HOME);
        break;
    }
  };

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          color="primary"
          sx={{ ml: 2 }}
          onClick={() => handleNavigate(ROUTING.LOGIN)}
        >
          Đăng nhập
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={() => handleNavigate(ROUTING.REGISTER)}
        >
          Đăng kí
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
}
