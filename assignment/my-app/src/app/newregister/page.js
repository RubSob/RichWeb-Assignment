"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography
} from "@mui/material";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const body = {
      firstname: data.get("firstname"),
      lastname: data.get("lastname"),
      email: data.get("email"),
      password: data.get("password")
    };

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(body)
    });

    const result = await res.json();
    setMsg(result.message);

    if (result.success) {
      window.location.href = "/login";
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4">Register</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField fullWidth name="firstname" label="First Name" required sx={{ mb: 2 }} />
          <TextField fullWidth name="lastname" label="Last Name" required sx={{ mb: 2 }} />
          <TextField fullWidth name="email" label="Email" required sx={{ mb: 2 }} />
          <TextField fullWidth name="password" type="password" label="Password" required sx={{ mb: 2 }} />

          <Button type="submit" variant="contained" fullWidth>
            Create Account
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>

          <Typography sx={{ mt: 2 }}>{msg}</Typography>
        </Box>
      </Box>
    </Container>
  );
}
