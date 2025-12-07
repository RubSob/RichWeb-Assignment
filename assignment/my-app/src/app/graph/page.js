"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Box, Typography, Button } from "@mui/material";
import Navbar from "@/components/navbar";

export default function GraphPage() {
  const [data, setData] = useState([]);

  //session
  useEffect(() => {
    const role = sessionStorage.getItem("role");

    if (!role) {
      window.location.href = "/login";
      return;
    }

    loadOrders(); // load order data for the graph
  }, []);

  //counting how many orders happened on each date
  const loadOrders = async () => {
    const res = await fetch("/api/getorders");
    const out = await res.json();

    if (!out.success) return;

    const count = {};

    //looping all order and grouping by date
    out.orders.forEach((order) => {
      const d = new Date(order.date).toLocaleDateString();

      if (!count[d]) count[d] = 0;
      count[d] += 1; 
    });

    // Changing the data into graph format
    const list = Object.keys(count).map((d) => ({
      date: d,
      sales: count[d],
    }));

    setData(list);
  };

  //graph
  let graph;

  if (data.length === 0) {
    graph = <Typography>No sales</Typography>;
  } else {
    graph = (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <Line dataKey="sales" stroke="#d32f2f" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Sales Graph
        </Typography>

        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => (window.location.href = "/manager")}
        >
          Back
        </Button>

        {graph}
      </Box>
    </>
  );
}
