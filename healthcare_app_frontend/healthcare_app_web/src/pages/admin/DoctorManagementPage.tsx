import React, { useState, useEffect, useRef } from "react";
import {
  DataGrid,
  GridColDef,
  GridCsvExportOptions,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add, Visibility, UploadFile } from "@mui/icons-material";
import { Doctor } from "../../types/doctor";
import DoctorForm from "../../components/admin/DoctorForm";
import DoctorDetailModal from "../../components/admin/DoctorDetailModal";
import {
  getAllDoctors,
  addDoctor,
  importDoctor,
  deleteDoctor,
} from "../../services/admin/doctor_service";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { Address } from "../../types/address";
import {
  DoctorCertificate,
  DoctorEducation,
  DoctorExperience,
} from "../../types/doctor";

const DoctorManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [doctors, setDoctors] = useState<Doctor[]>([]); // Danh sách bác sĩ
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false); // Trạng thái hiển thị modal chi tiết
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Bác sĩ đang được chọn
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [importing, setImporting] = useState<boolean>(false); // Trạng thái import dữ liệu
  const [error, setError] = useState<string | null>(null); // Lỗi nếu có
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [submitting, setSubmitting] = useState<boolean>(false); // Trạng thái đang gửi form

  const fileInputRef = useRef<HTMLInputElement>(null);

  const csvOptions: GridCsvExportOptions = {
    fileName: "doctors",
    delimiter: ",",
    utf8WithBom: true,
  };

  // Hàm lấy danh sách bác sĩ từ API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getAllDoctors();
      if (response && response.data) {
        setDoctors(response.data);
      } else {
        setError("Không thể tải danh sách bác sĩ");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Đã xảy ra lỗi khi tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách bác sĩ khi component được tải
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Đóng snackbar thông báo
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Hiển thị thông báo
  const showMessage = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Hàm mở form thêm bác sĩ mới
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedDoctor(null);
    setIsFormOpen(true);
  };

  // Hàm mở form chỉnh sửa thông tin bác sĩ
  const handleEditClick = (doctor: Doctor) => {
    setFormMode("edit");
    setSelectedDoctor(doctor);
    setIsFormOpen(true);
    showMessage("Chức năng chỉnh sửa bác sĩ chưa được hỗ trợ", "info");
  };

  // Hàm mở modal xem chi tiết bác sĩ
  const handleViewDetail = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailOpen(true);
  };

  // Hàm đóng form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Hàm đóng modal chi tiết
  const handleDetailClose = () => {
    setIsDetailOpen(false);
  };

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = async (doctorData: Partial<Doctor>) => {
    try {
      setSubmitting(true); // Start loading
      if (formMode === "add") {
        // Format dob to dd-MM-yyyy
        let formattedDob = "";
        if (doctorData.dob) {
          const dobDate = new Date(doctorData.dob);
          formattedDob = format(dobDate, "dd-MM-yyyy");
        }

        // Extract only disease name if typeDisease exists
        let diseaseInfo = null;
        if (doctorData.typeDisease) {
          diseaseInfo = doctorData.typeDisease.name;
        }

        // Chuẩn bị dữ liệu theo cấu trúc API
        const doctorToAdd = {
          ...doctorData,
          password: "123456789", // Default password
          dob: formattedDob,
          typeDisease: diseaseInfo, // Send only disease name
          certificates: [], // Đảm bảo các mảng là rỗng
          educations: [],
          experiences: [],
        };

        // Log data for debugging
        console.log("Sending doctor data:", JSON.stringify(doctorToAdd));

        // Gọi API thêm bác sĩ
        const response = await addDoctor(doctorToAdd);
        console.log("Response from addDoctor:", response);
        if (response && response.data) {
          // Cập nhật state với bác sĩ mới được thêm vào
          setDoctors([...doctors, response.data]);
          showMessage("Thêm bác sĩ thành công", "success");
        }
      } else {
        showMessage("Chức năng cập nhật bác sĩ chưa được hỗ trợ", "info");
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting doctor data:", error);
      showMessage(
        `Lỗi khi ${formMode === "add" ? "thêm" : "cập nhật"} bác sĩ`,
        "error"
      );
    } finally {
      setSubmitting(false); // End loading regardless of outcome
    }
  };

  // Hàm xử lý xóa bác sĩ
  const handleDeleteClick = async (id: number) => {
    try {
      setLoading(true);
      // Find the doctor by id to get the userId
      const doctorToDelete = doctors.find((doctor) => doctor.id === id);

      if (!doctorToDelete) {
        showMessage("Không tìm thấy bác sĩ", "error");
        return;
      }

      const response = await deleteDoctor(doctorToDelete.userId);

      if (response.code === 200) {
        // Update the doctor status in the local state
        setDoctors(
          doctors.map((doctor) =>
            doctor.id === id ? { ...doctor, status: false } : doctor
          )
        );
        showMessage("Xóa bác sĩ thành công", "success");
      } else {
        showMessage("Xóa bác sĩ thất bại", "error");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      showMessage("Lỗi khi xóa bác sĩ", "error");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý cập nhật thông tin chi tiết của bác sĩ (học vấn, chứng chỉ, kinh nghiệm)
  const handleUpdateDoctorDetail = (updatedDoctor: Doctor) => {
    // showMessage(
    //   "Chức năng cập nhật thông tin chi tiết bác sĩ chưa được hỗ trợ",
    //   "info"
    // );
  };

  // Hàm xử lý import file
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Hàm phân tích chuỗi thành đối tượng địa chỉ - hỗ trợ cả 2 định dạng
  // 1. Trong ngoặc đơn: (số,đường,phường,quận/huyện,thành phố,quốc gia) - dùng cho experiences, certificates
  // 2. Không có ngoặc đơn: các phần địa chỉ ngăn cách bởi dấu phẩy - dùng cho địa chỉ độc lập
  const parseAddress = (addressStr: string): Partial<Address> | null => {
    if (!addressStr || addressStr === "null") return null;

    // console.log("Parsing address:", addressStr);

    // Kiểm tra xem chuỗi có nằm trong ngoặc đơn không
    if (addressStr.startsWith("(") && addressStr.endsWith(")")) {
      // Format 1: Địa chỉ trong ngoặc đơn, phân tách bằng dấu phẩy
      const cleanAddress = addressStr
        .substring(1, addressStr.length - 1)
        .trim();
      const parts = cleanAddress.split(",").map((part) => part.trim());

      if (parts.length < 3) {
        console.error(
          "Định dạng địa chỉ trong ngoặc đơn không hợp lệ:",
          addressStr
        );
        return null;
      }

      // Xử lý linh hoạt các trường hợp thiếu thành phần địa chỉ
      const address: Partial<Address> = {};

      if (parts.length >= 1) address.number = parts[0];
      if (parts.length >= 2) address.street = parts[1];
      if (parts.length >= 3) {
        if (parts.length <= 4) {
          // Thiếu phường hoặc quận, coi là city và country
          address.city = parts[2];
          if (parts.length === 4) address.country = parts[3];
        } else {
          // Đủ các thành phần
          address.ward = parts[2];
          address.district = parts[3];
          address.city = parts[4];
          if (parts.length >= 6) address.country = parts[5];
        }
      }

      return address;
    } else {
      // Format 2: Địa chỉ không có ngoặc đơn, phân tách bằng dấu phẩy
      // Hỗ trợ các định dạng trong ví dụ: "15, Đường số 12/1,Hồ Chí Minh,Việt Nam"
      const parts = addressStr.split(",").map((part) => part.trim());

      if (parts.length < 2) {
        console.error(
          "Định dạng địa chỉ không ngoặc đơn không hợp lệ:",
          addressStr
        );
        return null;
      }

      // Xử lý linh hoạt các trường hợp thiếu thành phần địa chỉ
      const address: Partial<Address> = {};

      if (parts.length >= 1) address.number = parts[0];
      if (parts.length >= 2) address.street = parts[1];
      if (parts.length >= 3) {
        if (parts.length <= 4) {
          // Thiếu phường hoặc quận, coi là city và country
          address.city = parts[2];
          if (parts.length === 4) address.country = parts[3];
        } else {
          // Đủ các thành phần
          address.ward = parts[2];
          address.district = parts[3];
          address.city = parts[4];
          if (parts.length >= 6) address.country = parts[5];
        }
      }

      // console.log("Parsed standalone address:", address);
      return address;
    }
  };

  // Hàm phân tích chuỗi thành danh sách chứng chỉ
  // Cấu trúc: tên chứng chỉ,ngày cấp,địa chỉ;tên chứng chỉ,ngày cấp,địa chỉ;...
  const parseCertificates = (certStr: string): Partial<DoctorCertificate>[] => {
    if (!certStr || certStr === "null") return [];

    // Tách các chứng chỉ bằng dấu chấm phẩy
    return certStr
      .split(";")
      .map((cert) => {
        // Tách thông tin chi tiết của từng chứng chỉ bằng dấu phẩy
        const parts = cert.split(",");

        if (parts.length < 2) {
          console.error("Định dạng chứng chỉ không hợp lệ:", cert);
          return null;
        }

        const certName = parts[0].trim();
        const issueDate = parts[1].trim();

        // Kiểm tra xem có địa chỉ không (có thể nằm trong phần còn lại)
        let address: Partial<Address> | null = null;
        if (parts.length > 2) {
          // Nếu có địa chỉ trong ngoặc đơn
          const addrStr = parts.slice(2).join(",");
          if (addrStr.includes("(") && addrStr.includes(")")) {
            const openParenPos = addrStr.indexOf("(");
            const closeParenPos = addrStr.lastIndexOf(")");
            if (openParenPos !== -1 && closeParenPos !== -1) {
              const addressPart = addrStr.substring(
                openParenPos,
                closeParenPos + 1
              );
              address = parseAddress(addressPart);
            }
          } else {
            // Thử xem nếu phần còn lại là địa chỉ theo định dạng cũ
            address = parseAddress(addrStr);
          }
        }

        return {
          certName,
          issueDate,
          address: address,
        };
      })
      .filter((cert) => cert !== null) as Partial<DoctorCertificate>[];
  };

  // Hàm phân tích chuỗi thành danh sách học vấn
  // Cấu trúc: tên trường,ngày bắt đầu,ngày tốt nghiệp,bằng cấp;...
  const parseEducations = (eduStr: string): Partial<DoctorEducation>[] => {
    if (!eduStr || eduStr === "null") return [];

    // Tách các học vấn bằng dấu chấm phẩy
    return eduStr.split(";").map((edu) => {
      // Tách thông tin chi tiết của từng học vấn bằng dấu phẩy
      const [schoolName, joinDate, graduateDate, diploma] = edu.split(",");
      return {
        schoolName,
        joinDate,
        graduateDate,
        diploma,
      };
    });
  };

  // Hàm phân tích chuỗi thành danh sách kinh nghiệm làm việc
  // Cấu trúc phức tạp: tên công ty,chuyên môn,ngày bắt đầu,ngày kết thúc, (địa chỉ trong ngoặc đơn),mô tả;...
  const parseExperiences = (expStr: string): Partial<DoctorExperience>[] => {
    if (!expStr || expStr === "null") return [];

    // Tách các kinh nghiệm bằng dấu chấm phẩy
    return expStr
      .split(";")
      .map((exp) => {
        // Vì địa chỉ giờ đây nằm trong ngoặc đơn, nên cần tìm ngoặc đơn để xử lý
        const openParenPos = exp.indexOf("(");
        const closeParenPos = exp.indexOf(")", openParenPos);

        if (openParenPos === -1 || closeParenPos === -1) {
          // Thử format cũ nếu không tìm thấy ngoặc đơn
          console.warn(
            "Không tìm thấy ngoặc đơn cho địa chỉ, thử dùng format cũ:",
            exp
          );
          return parseExperienceOldFormat(exp);
        }

        // Tách các phần trước địa chỉ
        const beforeAddress = exp.substring(0, openParenPos).trim();
        const parts = beforeAddress.split(",");

        if (parts.length < 4) {
          console.error(
            "Định dạng kinh nghiệm không hợp lệ (thiếu trường):",
            exp
          );
          return null;
        }

        // Trích xuất 4 trường đầu tiên
        const compName = parts[0].trim();
        const specialization = parts[1].trim();
        const startDate = parts[2].trim();
        const endDate = parts[3].trim();

        // Trích xuất địa chỉ từ trong ngoặc đơn và dùng hàm parseAddress
        const addressStr = exp
          .substring(openParenPos, closeParenPos + 1)
          .trim();
        const compAddress = parseAddress(addressStr);

        // Tìm mô tả (phần sau dấu ngoặc đóng và dấu phẩy tiếp theo nếu có)
        let description = "";
        if (closeParenPos < exp.length - 1) {
          const restPart = exp.substring(closeParenPos + 1).trim();
          // Nếu phần còn lại bắt đầu với dấu phẩy, bỏ nó đi
          description = restPart.startsWith(",")
            ? restPart.substring(1).trim()
            : restPart;
        }

        // console.log("Thông tin kinh nghiệm đã phân tích (format mới):", {
        //   compName,
        //   specialization,
        //   startDate,
        //   endDate,
        //   addressStr,
        //   description,
        // });

        return {
          companyName: compName,
          specialization,
          startDate,
          endDate: endDate === "null" ? undefined : endDate,
          address: compAddress,
          description: description === "null" ? "" : description,
        };
      })
      .filter((exp) => exp !== null) as Partial<DoctorExperience>[];
  };

  // Hàm hỗ trợ để xử lý format cũ (trong trường hợp cần)
  const parseExperienceOldFormat = (
    exp: string
  ): Partial<DoctorExperience> | null => {
    const firstCommaPos = exp.indexOf(",");
    const secondCommaPos = exp.indexOf(",", firstCommaPos + 1);
    const thirdCommaPos = exp.indexOf(",", secondCommaPos + 1);
    const fourthCommaPos = exp.indexOf(",", thirdCommaPos + 1);

    // Kiểm tra tính hợp lệ của định dạng
    if (
      firstCommaPos === -1 ||
      secondCommaPos === -1 ||
      thirdCommaPos === -1 ||
      fourthCommaPos === -1
    ) {
      console.error("Định dạng kinh nghiệm không hợp lệ:", exp);
      return null;
    }

    // Trích xuất 4 trường đầu tiên
    const compName = exp.substring(0, firstCommaPos);
    const specialization = exp.substring(firstCommaPos + 1, secondCommaPos);
    const startDate = exp.substring(secondCommaPos + 1, thirdCommaPos);
    const endDate = exp.substring(thirdCommaPos + 1, fourthCommaPos);

    // Tìm dấu phẩy cuối cùng để tách mô tả
    const lastCommaPos = exp.lastIndexOf(",");

    // Trích xuất địa chỉ và mô tả
    const addressStr = exp.substring(fourthCommaPos + 1, lastCommaPos);
    const description = exp.substring(lastCommaPos + 1);

    // Sử dụng hàm parseAddress chung để xử lý địa chỉ
    const compAddress = parseAddress(addressStr);

    return {
      compName,
      specialization,
      startDate,
      endDate: endDate === "null" ? undefined : endDate,
      compAddress,
      description: description === "null" ? "" : description,
    };
  };

  // Hàm xử lý định dạng ngày tháng để hỗ trợ nhiều định dạng khác nhau
  const formatDateString = (dateValue: any): string => {
    if (!dateValue) return "";

    try {
      // Trường hợp 1: Nếu là chuỗi có định dạng YYYY-MM-DD (với dấu gạch ngang)
      if (typeof dateValue === "string" && dateValue.includes("-")) {
        // Kiểm tra xem có đúng định dạng YYYY-MM-DD không
        const match = dateValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (match) {
          const year = match[1];
          let month = match[2];
          let day = match[3];

          // Thêm số 0 ở đầu nếu cần
          day = day.padStart(2, "0");
          month = month.padStart(2, "0");

          // Trả về định dạng "dd-MM-yyyy"
          return `${day}-${month}-${year}`;
        }
      }

      // Trường hợp 2: Nếu là chuỗi có định dạng DD/MM/YYYY
      if (typeof dateValue === "string" && dateValue.includes("/")) {
        const parts = dateValue.split("/");
        if (parts.length !== 3) return dateValue;

        let day = parts[0];
        let month = parts[1];
        const year = parts[2];

        // Thêm số 0 ở đầu nếu cần
        day = day.padStart(2, "0");
        month = month.padStart(2, "0");

        return `${day}-${month}-${year}`;
      }

      // Trường hợp 3: Nếu là số (Excel date serial)
      if (typeof dateValue === "number" || !isNaN(Number(dateValue))) {
        // Tạo đối tượng Date sử dụng UTC để tránh vấn đề múi giờ
        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // 30/12/1899 ở UTC
        const daysSinceEpoch = Number(dateValue);
        const millisecondsSinceEpoch = daysSinceEpoch * 24 * 60 * 60 * 1000;
        const date = new Date(excelEpoch.getTime() + millisecondsSinceEpoch);

        // Lấy các thành phần ngày tháng ở định dạng UTC để tránh dịch ngày
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
      }
    } catch (error) {
      console.error("Lỗi định dạng ngày tháng:", error, dateValue);
      return String(dateValue);
    }

    // Trả về giá trị gốc nếu không thể xử lý
    return String(dateValue);
  };

  // Hàm hỗ trợ xử lý và định dạng ngày tháng trong hồ sơ học vấn
  const formatEducationDates = (educations: Partial<DoctorEducation>[]) => {
    return educations.map((edu) => ({
      ...edu,
      joinDate: edu.joinDate ? formatDateString(edu.joinDate) : "",
      graduateDate: edu.graduateDate ? formatDateString(edu.graduateDate) : "",
    }));
  };

  // Hàm hỗ trợ xử lý và định dạng ngày tháng trong hồ sơ chứng chỉ
  const formatCertificateDates = (
    certificates: Partial<DoctorCertificate>[]
  ) => {
    return certificates.map((cert) => ({
      ...cert,
      issueDate: cert.issueDate ? formatDateString(cert.issueDate) : "",
    }));
  };

  // Hàm hỗ trợ xử lý và định dạng ngày tháng trong hồ sơ kinh nghiệm
  const formatExperienceDates = (experiences: Partial<DoctorExperience>[]) => {
    return experiences.map((exp) => ({
      ...exp,
      startDate: exp.startDate ? formatDateString(exp.startDate) : "",
      endDate: exp.endDate ? formatDateString(exp.endDate) : "",
    }));
  };

  // Hàm xử lý khi người dùng chọn file để import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    // Kiểm tra loại file
    if (
      fileName.endsWith(".csv") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      setImporting(true); // Đặt trạng thái đang import
      reader.onload = async (evt) => {
        try {
          // Đọc dữ liệu file
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Xử lý từng dòng dữ liệu và phân tích các trường phức tạp
          const processedData = json.map((row: any) => {
            let address = null;
            if (row.address && row.address !== "null") {
              address = parseAddress(row.address);
            }

            // Phân tích chứng chỉ, học vấn và kinh nghiệm
            const certificates = parseCertificates(row.certificates || "");
            const educations = parseEducations(row.educations || "");
            const experiences = parseExperiences(row.experiences || "");

            // Định dạng ngày sinh
            const formattedDob = row.dob ? formatDateString(row.dob) : "";

            console.log(
              `Ngày sinh gốc: ${row.dob}, Đã định dạng: ${formattedDob}`
            ); // Ghi log gỡ lỗi

            // Định dạng các trường ngày tháng khác
            const formattedCertificates = formatCertificateDates(certificates);
            const formattedEducations = formatEducationDates(educations);
            const formattedExperiences = formatExperienceDates(experiences);

            // Sửa dữ liệu giới tính về giá trị đúng:
            let correctedSex = row.sex;
            if (typeof row.sex === "string") {
              // Chuyển đổi biểu diễn chuỗi sang giá trị boolean đúng
              if (
                row.sex.toLowerCase() === "nữ" ||
                row.sex.toLowerCase() === "nu" ||
                row.sex === "1" ||
                row.sex === "true"
              ) {
                correctedSex = true; // Nữ
              } else if (
                row.sex.toLowerCase() === "nam" ||
                row.sex === "0" ||
                row.sex === "false"
              ) {
                correctedSex = false; // Nam
              }
            }

            return {
              ...row,
              dob: formattedDob, // Sử dụng ngày sinh đã định dạng
              sex: correctedSex, // Sử dụng giới tính đã được sửa
              typeDisease: row.typeDisease || "",
              address: address,
              certificates: formattedCertificates,
              educations: formattedEducations,
              experiences: formattedExperiences,
            };
          });

          console.log("Dữ liệu bác sĩ đã xử lý:", processedData);

          // Gọi API import bác sĩ
          try {
            const response = await importDoctor(processedData);
            if (response && response.data) {
              showMessage("Import dữ liệu bác sĩ thành công", "success");
              // Làm mới danh sách bác sĩ sau khi import thành công
              fetchDoctors();
            } else {
              showMessage("Đã xảy ra lỗi khi import dữ liệu bác sĩ", "error");
            }
          } catch (apiError) {
            console.error("Lỗi khi import bác sĩ:", apiError);
            showMessage(
              "Đã xảy ra lỗi khi gửi dữ liệu bác sĩ đến server",
              "error"
            );
          } finally {
            setImporting(false);
          }
        } catch (parseError) {
          console.error("Lỗi khi phân tích file:", parseError);
          showMessage(
            `Lỗi khi parse file ${fileName.endsWith(".csv") ? "CSV" : "Excel"}`,
            "error"
          );
          setImporting(false);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      showMessage("Chỉ hỗ trợ file .csv, .xlsx, .xls", "warning");
    }

    // Reset input để có thể chọn lại cùng 1 file
    e.target.value = "";
  };

  // Định nghĩa cấu trúc các cột cho bảng dữ liệu
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      flex: 0.5,
    },
    {
      field: "avatar",
      headerName: "Ảnh",
      width: 80,
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={(params.value as string) || "/default-avatar.png"} />
      ),
      sortable: false,
    },
    {
      field: "userId",
      headerName: "Mã bác sĩ",
      width: 120,
      flex: 0.8,
    },
    {
      field: "firstName",
      headerName: "Họ",
      width: 100,
      flex: 0.8,
    },
    {
      field: "lastName",
      headerName: "Tên",
      width: 120,
      flex: 0.8,
    },
    {
      field: "specialization",
      headerName: "Chuyên khoa",
      width: 150,
      flex: 1,
    },
    {
      field: "sex",
      headerName: "Giới tính",
      width: 100,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Nam" : "Nữ"}
          color={params.value ? "info" : "secondary"}
          size="small"
        />
      ),
    },
    {
      field: "dob",
      headerName: "Ngày sinh",
      width: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) =>
        new Date(params.row.dob).toLocaleDateString("vi-VN"),
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 130,
      flex: 0.8,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 130,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Đang hoạt động" : "Không hoạt động"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 80,
      flex: 0.7,
      sortable: false,
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
          <IconButton
            size="small"
            color="primary"
            title="Xem chi tiết"
            onClick={() => handleViewDetail(params.row)}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            title="Xóa"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", padding: 0 }}>
      {/* Phần header với nút thêm bác sĩ và import */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm bác sĩ
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={
            importing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <UploadFile />
            )
          }
          onClick={handleImportClick}
          disabled={importing}
          sx={{ fontWeight: 600 }}
        >
          {importing ? "Đang import..." : "Import file"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Bảng dữ liệu bác sĩ */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          <DataGrid
            rows={doctors}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                csvOptions: csvOptions,
              },
            }}
            disableRowSelectionOnClick
            disableColumnFilter={false}
            disableDensitySelector={false}
            disableColumnSelector={false}
            loading={loading}
          />
        )}
      </Paper>

      {/* Form thêm mới/chỉnh sửa bác sĩ */}
      <DoctorForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        doctor={selectedDoctor}
        mode={formMode}
        isSubmitting={submitting} // Pass loading state to form
      />

      {/* Modal xem chi tiết bác sĩ */}
      <DoctorDetailModal
        open={isDetailOpen}
        onClose={handleDetailClose}
        doctor={selectedDoctor}
        onUpdate={handleUpdateDoctorDetail}
      />

      {/* Snackbar cho thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorManagementPage;
