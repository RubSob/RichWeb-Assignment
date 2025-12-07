"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
} from "@mui/material";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const userData = {
      firstname: form.get("firstname"),
      lastname: form.get("lastname"),
      email: form.get("email"),
      password: form.get("password"),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    setMsg(data.message);

    if (data.success) {
      window.location.href = "/login";
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="firstname"
            label="First Name"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="lastname"
            label="Last Name"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            required
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Create Account
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/login")}
          >
            Back to Login
          </Button>

          {msg && (
            <Typography sx={{ mt: 2, textAlign: "center" }}>{msg}</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
