import {
  Box,
  Container,
  Typography,
  Grid2,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const blogPosts = [
  {
    title: "What's Trending?",
    image: "https://picsum.photos/400/200?random=1",
    description: "Latest healthcare trends and news",
  },
  {
    title: "Healthcare Tips & Tricks",
    image: "https://picsum.photos/400/200?random=1",
    description: "Simple ways to maintain good health",
  },
  {
    title: "Medical Research Updates",
    image: "https://picsum.photos/400/200?random=1",
    description: "Recent developments in medical science",
  },
];

export default function Blog() {
  return (
    <Box sx={{ py: 8, backgroundColor: "secondary.light" }}>
      <Container>
        <Typography variant="h2" gutterBottom>
          What you need to know about healthy living
        </Typography>
        <Grid2 container spacing={4} sx={{ mt: 2 }}>
          {blogPosts.map((post) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={post.title}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
