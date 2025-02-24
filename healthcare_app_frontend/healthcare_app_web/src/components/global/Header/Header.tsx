import React from "react";
import { View, Image } from "react-native";
import { AppBar, Toolbar, Typography, Button, styled } from "@mui/material";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "white",
  boxShadow: "none",
});

const Header = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 40, height: 40 }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ marginLeft: 1, color: "primary.main" }}
          >
            Medicare
          </Typography>
        </View>
        <View style={{ flexGrow: 1 }} />
        <Button color="primary">Home</Button>
        <Button color="primary">Our Services</Button>
        <Button color="primary">Find Doctor</Button>
        <Button color="primary">About</Button>
        <Button color="primary">Contact</Button>
        <Button variant="contained" color="primary" sx={{ marginLeft: 2 }}>
          Book Appointment
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
