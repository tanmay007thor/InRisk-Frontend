import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { Box } from "@mui/material";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  console.log("Navbar component loaded");

  const menuItems = ["Home", "About", "Services", "Contact"];

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          WeatherApp
        </Typography>

        {/* Desktop Menu */}

        {/* Mobile Menu Icon */}

        {/* Mobile Menu */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
