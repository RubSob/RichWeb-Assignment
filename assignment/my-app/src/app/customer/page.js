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

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <Navbar/>

      <Box sx={{ mt: 3, px: 2 }}>
        {weather && (
          <Typography variant="h5" sx={{ mb: 2 }}>
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
