import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Card, CardMedia, Container } from "@mui/material";

export default function ImageSlider() {
  const images = [
    "https://picsum.photos/id/1018/600/300",
    "https://picsum.photos/id/1020/600/300",
    "https://picsum.photos/id/1024/600/300",
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Card>
              <CardMedia
                component="img"
                height="500"
                image={src}
                alt={`Slide ${index}`}
              />
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
