"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";

export default function ViewCartPage() {
  const [cart, setCart] = useState([]);

  // Load and merge duplicates
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    const merged = [];

    saved.forEach((item) => {
      const existing = merged.find((x) => x._id === item._id);
      if (existing) existing.quantity += 1;
      else merged.push({ ...item, quantity: 1 });
    });

    setCart(merged);
  }, []);

  const saveCart = (updated) => {
    const flattened = [];
    updated.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        flattened.push({ ...item, quantity: 1 });
      }
    });
    localStorage.setItem("cart", JSON.stringify(flattened));
    window.dispatchEvent(new Event("storage"));
  };

  const increaseQty = (i) => {
    const updated = [...cart];
    updated[i].quantity++;
    setCart(updated);
    saveCart(updated);
  };

  const decreaseQty = (i) => {
    const updated = [...cart];
    updated[i].quantity--;
    if (updated[i].quantity <= 0) updated.splice(i, 1);
    setCart(updated);
    saveCart(updated);
  };

  const deleteItem = (i) => {
    const updated = cart.filter((_, index) => index !== i);
    setCart(updated);
    saveCart(updated);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <Box sx={{ mt: 3, px: 2 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Your Cart
        </Typography>

        <Grid container spacing={2}>
          {cart.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: "flex", p: 2, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    overflow: "hidden",
                    borderRadius: 2,
                    mr: 2,
                  }}
                >
                  <img
                    src={item.imageUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {item.title} × {item.quantity}
                  </Typography>
                  <Typography>{item.description}</Typography>
                  <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                    €{item.price} each
                  </Typography>

                  <Box sx={{ display: "flex", mt: 1 }}>
                    <Button onClick={() => decreaseQty(index)}>−</Button>
                    <Typography sx={{ px: 2 }}>{item.quantity}</Typography>
                    <Button onClick={() => increaseQty(index)}>+</Button>
                  </Box>

                  <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                    Subtotal: €{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button color="error" variant="outlined" onClick={() => deleteItem(index)}>
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Typography variant="h5">Total: €{total.toFixed(2)}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/checkout")}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </>
  );
}
