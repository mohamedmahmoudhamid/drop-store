import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Skeleton } from "@mui/material";
import ProductCard from "./productCard";
import apiLink from "../../../apiLink";
import "./productList.css";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiLink}/products?populate=*`);
        const data = await res.json();

        const formatted = data.data.map((p) => ({
          id: p.documentId,
          name: p.name,
          description: p.description,
          price: p.price,
          final_price: p.final_price,
          discount: p.discount,
          image:
            p.photo?.formats?.medium?.url ||
            p.photo?.url ||
            "https://via.placeholder.com/300x300?text=No+Image",
          colors: [
            ...new Set(p.product_variants?.map((v) => v.colorName) || []),
          ],
          sizes: [...new Set(p.product_variants?.map((v) => v.size) || [])],
          available:
            p.product_variants?.some((variant) => variant.quantity > 0) ||
            false,
          product_variants: p.product_variants || [],
        }));

        setProducts(formatted);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // أثناء التحميل ➜ عرض Skeletons
  if (loading) {
    const skeletonArray = Array.from({ length: 10 });
    return (
      <div className="gridContainer mt-3">
        {skeletonArray.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              borderRadius: "33px 5px 18px 5px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              height: 350,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={160}
              animation="wave"
              sx={{ borderRadius: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="80%" height={25} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
            <Skeleton
              variant="rounded"
              height={40}
              animation="wave"
              sx={{ borderRadius: 3 }}
            />
          </Box>
        ))}
      </div>
    );
  }

  return (
    <div className="gridContainer mt-3">
      {products.length > 0 ? (
        products.map((p) => (
          <Box key={p.id} sx={{ width: "100%" }}>
            <ProductCard product={p} />
          </Box>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
            لا توجد منتجات حاليًا.
          </Typography>
        </Grid>
      )}
    </div>
  );
}
