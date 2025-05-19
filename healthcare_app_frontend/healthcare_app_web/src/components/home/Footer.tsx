import { Box, Container, Grid2, Typography, Link } from "@mui/material";
import Logo from "./Logo";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
      <Container>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Logo />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Cung cấp dịch vụ chăm sóc sức khỏe chất lượng cho một tương lai
              tốt đẹp hơn.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Công Ty
            </Typography>
            <Link href="#" color="inherit" display="block">
              Giới Thiệu
            </Link>
            <Link href="#" color="inherit" display="block">
              Tuyển Dụng
            </Link>
            <Link href="#" color="inherit" display="block">
              Liên Hệ
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dịch Vụ
            </Typography>
            <Link href="#" color="inherit" display="block">
              Lịch Hẹn
            </Link>
            <Link href="#" color="inherit" display="block">
              Điều Trị
            </Link>
            <Link href="#" color="inherit" display="block">
              Chuyên Gia
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tài Nguyên
            </Typography>
            <Link href="#" color="inherit" display="block">
              Blog
            </Link>
            <Link href="#" color="inherit" display="block">
              Tin Tức
            </Link>
            <Link href="#" color="inherit" display="block">
              Câu Hỏi Thường Gặp
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pháp Lý
            </Typography>
            <Link href="#" color="inherit" display="block">
              Quyền Riêng Tư
            </Link>
            <Link href="#" color="inherit" display="block">
              Điều Khoản
            </Link>
            <Link href="#" color="inherit" display="block">
              Chính Sách Cookie
            </Link>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
