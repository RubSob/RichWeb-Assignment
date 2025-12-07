"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Tell React we are on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load cart count after mount
  useEffect(() => {
    if (!mounted) return;

    const loadCart = async () => {
      const email = sessionStorage.getItem("email");
      if (!email) return;

      const res = await fetch("/api/getCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const out = await res.json();
      if (out.success) setCartCount(out.items.length);
    };

    loadCart(); // ← IMPORTANT: load once on mount

    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);

  }, [mounted]);

  // Prevent hydration mismatch
  if (!mounted) return <div style={{ height: 64 }} />;

  const goHome = () => {
    const role = sessionStorage.getItem("role");
    window.location.href = role === "manager" ? "/manager" : "/customer";
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#d32f2f" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={goHome}>
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
