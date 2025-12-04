"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function LoginPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("pass"); // input is named "pass"

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // MUST MATCH API
    });

    const result = await res.json();
    console.log("Login API Response:", result);

    if (result.success) {
      sessionStorage.setItem("email", result.email);
      sessionStorage.setItem("role", result.account_type);

      if (result.account_type === "manager") {
        window.location.href = "/manager";
      } else {
        window.location.href = "/customer";
      }
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          LOG IN
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField fullWidth label="Email" name="email" required />
          <TextField
            fullWidth
            label="Password"
            name="pass"
            type="password"
            required
            sx={{ mt: 2 }}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => (window.location.href = "/newregister")}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
