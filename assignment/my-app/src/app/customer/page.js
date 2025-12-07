"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
} from "@mui/material";

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [weather, setWeather] = useState(null);

  // Session guard
  useEffect(() => {
    const role = sessionStorage.getItem("role");

    if (!role) {
      window.location.href = "/login";
    } else if (role !== "customer") {
      window.location.href = "/manager";
    }
  }, []);

  // Load products + weather
  useEffect(() => {
    const loadProducts = async () => {
  const res = await fetch("/api/products");
  const data = await res.json();

  if (data.success) {
    setProducts(data.products);   
  } else {
    setProducts([]);              
  }
};


    const loadWeather = async () => {
      const res = await fetch("/api/weather");
      const data = await res.json();
      setWeather(data); // API returns { temp, desc }
    };

    loadProducts();
    loadWeather();
  }, []);

  // Add item to cart
  const addToCart = async (item) => {
    const email = sessionStorage.getItem("email");

    await fetch("/api/inCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pname: item.title }),
    });

    // Tell Navbar to update count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Navbar />

      <Box sx={{ mt: 3, px: 2 }}>
        {weather && (
          <Typography variant="h5" sx={{ mb: 3 }}>
            Weather Today: {weather.temp}°C — {weather.desc}
          </Typography>
        )}

        <Grid container spacing={3}>
          {products.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Box
                  sx={{
                    height: 180,
                    backgroundColor: "#f5f5f5",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography>{item.description}</Typography>
                  <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                    €{item.price}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
