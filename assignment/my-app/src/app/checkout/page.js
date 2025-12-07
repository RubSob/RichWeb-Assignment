"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import Navbar from "@/components/navbar";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  //session
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (!role) {
      window.location.href = "/login";
    }
  }, []);

  //product list
  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (data.success) {
      setProducts(data.products);
    }
  };

  //cart items
  const loadCartItems = async () => {
    const email = sessionStorage.getItem("email");

    const res = await fetch("/api/getCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      setCartItems(data.items);
    }
  };

  //calculate total
  const calculateTotal = () => {
    let total = 0;

    cartItems.forEach((item) => {
      const product = products.find((p) => p.title === item.pname);
      if (product) {
        total += product.price;
      }
    });

    return total.toFixed(2);
  };

  //confirm order
  const confirmOrder = async () => {
    const email = sessionStorage.getItem("email");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order placed successfully!");
      window.location.href = "/customer";
    }
  };

  useEffect(() => {
    loadProducts();
    loadCartItems();
  }, []);

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Checkout
        </Typography>

        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => (window.location.href = "/customer")}
        >
          Continue Shopping
        </Button>

        {/* Cart Items */}
        <Grid container spacing={3}>   
          {cartItems.map((item) => {
            const product = products.find((p) => p.title === item.pname);
            if (!product) return null;

            return (
              <Grid item xs={12} key={item._id}>
                <Card sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      marginRight: 20,
                    }}
                  />

                  <CardContent>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography>€{product.price}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box  
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Total: €{calculateTotal()}</Typography>

          <Button variant="contained" size="large" onClick={confirmOrder}>
            CONFIRM ORDER
          </Button>
        </Box>
      </Box>
    </>
  );
}
