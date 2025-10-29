// import React, { useState, useEffect } from "react";
// import { Grid, CircularProgress, Typography, Box } from "@mui/material";
// import ProductCard from "./productCard";
// import apiLink from "../../../apiLink";

// export default function ProductsList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${apiLink}/products?populate=*`)
//       .then((res) => res.json())
//       .then((data) => {
//         const formatted = data.data.map((p) => ({
//           id: p.documentId,
//           name: p.name,
//           description: p.description,
//           price: p.price,
//           final_price: p.final_price,
//           discount: p.discount,
//           image:
//             p.photo?.formats?.medium?.url ||
//             p.photo?.url ||
//             "https://via.placeholder.com/300x300?text=No+Image",
//           colors: [
//             ...new Set(p.product_variants?.map((v) => v.colorName) || []),
//           ],
//           sizes: [...new Set(p.product_variants?.map((v) => v.size) || [])],
//           available:
//             p.product_variants?.some((variant) => variant.quantity > 0) ||
//             false,
//           product_variants: p.product_variants || [],
//         }));

//         setProducts(formatted);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <CircularProgress />
//         <Typography variant="body1" sx={{ mt: 2 }}>
//           جاري تحميل المنتجات...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <div
//       container
//       spacing={{ xs: 6, sm: 1, md: 3, lg: 5 }}
//       justifyContent="center"
//       sx={{ px: { xs: 0, sm: 2 } }}
//     >
//       {products.length > 0 ? (
//         products.map((p) => (
//           <div
//             key={p.id}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 width: "100%",
//                 maxWidth: {
//                   xs: 150, // عرض صغير في الموبايل
//                   sm: 200, // عرض متوسط في الشاشات الصغيرة
//                   md: 240, // في التابلت
//                   lg: 250, // في الشاشات الكبيرة
//                   xl: 280, // في الشاشات الكبيرة جداً
//                 },
//               }}
//             >
//               <ProductCard product={p} />
//             </Box>
//           </div>
//         ))
//       ) : (
//         <Grid item xs={12}>
//           <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
//             لا توجد منتجات حاليًا.
//           </Typography>
//         </Grid>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Typography, Box } from "@mui/material";
import ProductCard from "./productCard";
import apiLink from "../../../apiLink";
import "./productList.css";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiLink}/products?populate=*`)
      .then((res) => res.json())
      .then((data) => {
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          جاري تحميل المنتجات...
        </Typography>
      </Box>
    );
  }

  return (
    <div
      container
      justifyContent="center"
      className="gridContainer mt-3"
    >
      {products.length > 0 ? (
        products.map((p) => (
          <div
            key={p.id}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <ProductCard product={p} />
            </Box>
          </div>
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
