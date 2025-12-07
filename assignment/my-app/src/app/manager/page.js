"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import Navbar from "@/components/navbar";

export default function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  //checking user
  useEffect(() => {
    const role = sessionStorage.getItem("role");

    if (!role) {
      window.location.href = "/login";
    } else if (role !== "manager") {
      window.location.href = "/customer";
    }
  }, []);

  //loading all orders
  const loadOrders = async () => {
    const res = await fetch("/api/getorders");
    const data = await res.json();

    if (data.success) {
      setOrders(data.orders);
    }
  };

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (data.success) {
      setProducts(data.products);
    }
  };

  //calculating total price for one order
  const calculateOrderTotal = (order) => {
    let total = 0;

    order.items.forEach((item) => {
      const product = products.find((p) => p.title === item.pname);

      if (product) {
        total += product.price;
      }
    });

    return total.toFixed(2);
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  //summary numbers
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(calculateOrderTotal(order)), 0).toFixed(2);

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Manager Dashboard
        </Typography>

        {/* Summary Section */}
        <Typography variant="h6">Total Orders: {totalOrders}</Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Total Revenue: €{totalRevenue}
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => (window.location.href = "/graph")}
        >
          View Sales Graph
        </Button>

        {/* Order List */}
        <Grid container spacing={3}> 
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                  <Typography>Ordered By: {order.email}</Typography>
                  <Typography>
                    Time: {new Date(order.date).toLocaleString()}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1">Products:</Typography>

                  {order.items.map((item, index) => (
                    <Typography key={index}>- {item.pname}</Typography>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6">
                    Order Total: €{calculateOrderTotal(order)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
