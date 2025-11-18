'use client';

import React from "react";
import { Button, TextField, Container, Box } from "@mui/material";

export default function Register() {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = data.get("name");
    const email = data.get("email");
    const pass = data.get("pass");
    const tel = data.get("tel");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, pass, tel }),
    });

    const result = await res.json();
    console.log(result);

    if (result.status === "success") {
      alert("Account created successfully!");
    } else {
      alert("Registration failed: " + result.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="Full Name"
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="email"
          label="Email Address"
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="pass"
          label="Password"
          type="password"
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="tel"
          label="Telephone Number"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Register
        </Button>

      </Box>
    </Container>
  );
}
