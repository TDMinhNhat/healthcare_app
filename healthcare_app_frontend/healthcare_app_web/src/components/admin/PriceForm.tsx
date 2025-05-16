import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Price } from "../../types/price";

interface PriceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (price: Partial<Price>) => void;
  price?: Price | null;
  mode: "add" | "edit";
  loading?: boolean;
}

const validationSchema = Yup.object({
  priceType: Yup.string()
    .required("Loại giá là bắt buộc")
    .min(2, "Loại giá phải có ít nhất 2 ký tự"),
  price: Yup.number()
    .required("Giá tiền là bắt buộc")
    .min(0, "Giá tiền không được âm"),
});

const PriceForm: React.FC<PriceFormProps> = ({
  open,
  onClose,
  onSubmit,
  price,
  mode,
  loading = false,
}) => {
  // Sử dụng formik để quản lý trạng thái và xác thực form
  const formik = useFormik({
    initialValues: {
      priceType: "",
      price: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Cập nhật giá trị form khi price hoặc mode thay đổi
  useEffect(() => {
    if (price && mode === "edit") {
      formik.setValues({
        priceType: price.priceType,
        price: price.price,
      });
    } else if (mode === "add") {
      formik.resetForm();
    }
  }, [price, mode]);

  // Xử lý đóng dialog và reset form
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Xác định tiêu đề và text của nút dựa vào mode
  const title = mode === "add" ? "Thêm giá mới" : "Chỉnh sửa thông tin giá";
  const buttonText = mode === "add" ? "Thêm giá" : "Lưu thay đổi";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            name="priceType"
            label="Loại giá"
            value={formik.values.priceType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.priceType && Boolean(formik.errors.priceType)}
            helperText={formik.touched.priceType && formik.errors.priceType}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            name="price"
            label="Giá tiền"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            fullWidth
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">VND</InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PriceForm;
