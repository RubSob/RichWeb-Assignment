"use client";

import { Box, Typography, Button } from "@mui/material";
import Navbar from "@/components/navbar";

export default function OrderSuccess() {
  return (
    <>
      <Navbar />

      <Box
        sx={{
          p: 4,
          textAlign: "center",
          mt: 8,
        }}
      >
        <Typography variant="h4">
          Thank you <br /> Order Confirmed! <br /> <br />
        </Typography>


        <Button
          variant="contained"
          size="large"
          onClick={() => (window.location.href = "/customer")}
        >
          Home
        </Button>
      </Box>
    </>
  );
}
