"use client";

import { AppBar, Toolbar, IconButton, Typography, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCount(cart.length);
    };

    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => (window.location.href = "/customer")}
        >
          McDonald's App
        </Typography>

        <IconButton
          size="large"
          sx={{ color: "white" }}
          onClick={() => (window.location.href = "/view_cart")}
        >
          <Badge badgeContent={count} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
