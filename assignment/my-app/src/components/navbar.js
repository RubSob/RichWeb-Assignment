"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

export default function Navbar() {
  const [ready, setReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Mark component as client-ready
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    function loadCart() {
      const email = sessionStorage.getItem("email");
      if (email === null) return;

      fetch("/api/getCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
        .then((res) => res.json())
        .then((out) => {
          if (out.success) {
            setCartCount(out.items.length);
          }
        });
    }

    loadCart();

    window.addEventListener("cartUpdated", loadCart);

    return () => window.removeEventListener("cartUpdated", loadCart);
  }, [ready]);

  if (!ready) {
    return <div style={{ height: 64 }} />;
  }

  function goHome() {
    const role = sessionStorage.getItem("role");
    if (role === "manager") {
      window.location.href = "/manager";
    } else {
      window.location.href = "/customer";
    }
  }

  function logout() {
    sessionStorage.clear();
    window.location.href = "/login";
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "grey" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={goHome}
        >
          McDonald's App
        </Typography>

        <div>
          <Button color="inherit" onClick={() => (window.location.href = "/view_cart")}>
            View Cart ({cartCount})
          </Button>

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </div>

      </Toolbar>
    </AppBar>
  );
}
