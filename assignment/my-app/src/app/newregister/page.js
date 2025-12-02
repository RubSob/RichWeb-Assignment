"use client";

import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";

export default function NewRegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    pass: "",
    acc_type: "customer",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    const res = await fetch("/api/newregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.message || "Error registering user");
    } else {
      setOk("User registered! You can now log in.");
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
        <Typography variant="h5" mb={2}>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Username (optional)"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="pass"
            type="password"
            value={form.pass}
            onChange={handleChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Account Type"
            name="acc_type"
            value={form.acc_type}
            onChange={handleChange}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>

          {error && <Typography color="error">{error}</Typography>}
          {ok && <Typography color="primary">{ok}</Typography>}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Create Account
          </Button>
        </form>
      </Box>
    </Container>
  );
}
