"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import Navbar from "@/components/navbar";

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (!role) {
      window.location.href = "/login";
    }
  }, []);

  //loding items
  const loadCart = async () => {
    const email = sessionStorage.getItem("email");
    if (!email) return;

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

  //removing
  const removeItem = async (id) => {
    const res = await fetch("/api/removeFromCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) {
      loadCart(); 
    }
  };

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (data.success) {
      setProducts(data.products);
    }
  };

  //total price 
  const calculateTotal = () => {
    let total = 0;

    cartItems.forEach((item) => {
      const product = products.find((p) => p.title === item.pname);
      if (product) total += product.price;
    });

    return total.toFixed(2);
  };

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Your Cart
        </Typography>

        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => (window.location.href = "/customer")}
        >
          Continue Shopping
        </Button>

        {/*cart items */}
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

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                      €{product.price}
                    </Typography>
                  </CardContent>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(item._id)}
                  >
                    REMOVE
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Total Price */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Total: €{calculateTotal()}</Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => (window.location.href = "/checkout")}
          >
            PROCEED TO CHECKOUT
          </Button>
        </Box>
      </Box>
    </>
  );
}
