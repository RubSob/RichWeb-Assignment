"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography
} from "@mui/material";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); //stop page refresh

    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const password = form.get("pass");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const out = await res.json();

    //checking login user
    if (out.success) {
      sessionStorage.setItem("email", out.email);
      sessionStorage.setItem("role", out.role);

      if (out.role === "manager") {
        window.location.href = "/manager";
      } else {
        window.location.href = "/customer";
      }
    } else {
      setErrorMsg("Invalid email or password.");
    }
  };

  let errorBox = null;
  if (errorMsg !== "") {
    errorBox = (
      <Typography sx={{ mt: 2, color: "red", textAlign: "center" }}>
        {errorMsg}
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          LOG IN
        </Typography>

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
         
          <TextField   //email
            fullWidth
            label="Email"
            name="email"
            type="email"
            required
            sx={{ mb: 2 }}
          />

          <TextField  //password
            fullWidth
            label="Password"
            name="pass"
            type="password"
            required
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" fullWidth>
            Sign In
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/newregister")}
          >
            Register
          </Button>

          {errorBox}
        </Box>
      </Box>
    </Container>
  );
}
