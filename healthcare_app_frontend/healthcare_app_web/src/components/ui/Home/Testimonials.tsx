import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Rating,
  Avatar,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/pagination";

const testimonials = [
  {
    name: "John Doe",
    rating: 5,
    comment: "Excellent service and professional staff.",
    avatar: "https://picsum.photos/60?random=1",
  },
  {
    name: "Jane Smith",
    rating: 5,
    comment: "Very satisfied with the treatment.",
    avatar: "https://picsum.photos/60?random=1",
  },
  {
    name: "Mike Johnson",
    rating: 5,
    comment: "Great experience overall.",
    avatar: "https://picsum.photos/60?random=1",
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Testimonials
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              968: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <Card
                  sx={{
                    height: "100%",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="h6">{testimonial.name}</Typography>
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.comment}
                    </Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
}
