import axiosConfig from "../axiosConfig";

// Định nghĩa kiểu dữ liệu cho thông tin tài khoản ngân hàng
export interface BankAccount {
  id?: number;
  userId: string;
  accountNumber: string;
  bankName: string;
}

const prefix = "/authenticate/api/v1/bank-account";

/**
 * Hàm lấy thông tin tài khoản ngân hàng của bệnh nhân
 * @param userId ID của bệnh nhân
 * @returns Promise với dữ liệu tài khoản ngân hàng
 */
export const getBankAccount = async (userId: string) => {
  // Giả lập gọi API thực tế
  console.log(`Đang lấy thông tin tài khoản ngân hàng cho userId: ${userId}`);

  // Trong môi trường thực tế, sẽ sử dụng axios để gọi API
  // return await axiosConfig.get(`${prefix}/${userId}`);

  // Giả lập trả về dữ liệu sau 500ms
  return new Promise((resolve) => {
    setTimeout(() => {
      // Kiểm tra localStorage để xem có dữ liệu không
      const savedData = localStorage.getItem(`bank_account_${userId}`);

      if (savedData) {
        resolve({
          data: {
            code: 200,
            message: "Lấy thông tin tài khoản ngân hàng thành công",
            data: JSON.parse(savedData),
          },
        });
      } else {
        // Trả về null nếu chưa có dữ liệu
        resolve({
          data: {
            code: 404,
            message: "Không tìm thấy thông tin tài khoản ngân hàng",
            data: null,
          },
        });
      }
    }, 500);
  });
};

/**
 * Hàm thêm mới tài khoản ngân hàng cho bệnh nhân
 * @param bankAccount Thông tin tài khoản ngân hàng cần thêm
 * @returns Promise với kết quả thêm tài khoản
 */
export const addBankAccount = async (bankAccount: BankAccount) => {
  // Giả lập gọi API thực tế
  console.log(`Đang thêm tài khoản ngân hàng: ${JSON.stringify(bankAccount)}`);

  // Trong môi trường thực tế, sẽ sử dụng axios để gọi API
  // return await axiosConfig.post(`${prefix}`, bankAccount);

  // Giả lập trả về dữ liệu sau 500ms
  return new Promise((resolve) => {
    setTimeout(() => {
      // Lưu vào localStorage để giả lập cơ sở dữ liệu
      localStorage.setItem(
        `bank_account_${bankAccount.userId}`,
        JSON.stringify({
          ...bankAccount,
          id: new Date().getTime(), // Tạo ID giả
        })
      );

      resolve({
        data: {
          code: 201,
          message: "Thêm tài khoản ngân hàng thành công",
          data: {
            ...bankAccount,
            id: new Date().getTime(),
          },
        },
      });
    }, 500);
  });
};

/**
 * Hàm cập nhật thông tin tài khoản ngân hàng
 * @param bankAccount Thông tin tài khoản ngân hàng cần cập nhật
 * @returns Promise với kết quả cập nhật
 */
export const updateBankAccount = async (bankAccount: BankAccount) => {
  // Giả lập gọi API thực tế
  console.log(
    `Đang cập nhật tài khoản ngân hàng: ${JSON.stringify(bankAccount)}`
  );

  // Trong môi trường thực tế, sẽ sử dụng axios để gọi API
  // return await axiosConfig.put(`${prefix}/${bankAccount.userId}`, bankAccount);

  // Giả lập trả về dữ liệu sau 500ms
  return new Promise((resolve) => {
    setTimeout(() => {
      // Lấy dữ liệu hiện tại
      const savedData = localStorage.getItem(
        `bank_account_${bankAccount.userId}`
      );
      const currentData = savedData ? JSON.parse(savedData) : {};

      // Cập nhật dữ liệu
      const updatedData = { ...currentData, ...bankAccount };

      // Lưu vào localStorage
      localStorage.setItem(
        `bank_account_${bankAccount.userId}`,
        JSON.stringify(updatedData)
      );

      resolve({
        data: {
          code: 200,
          message: "Cập nhật tài khoản ngân hàng thành công",
          data: updatedData,
        },
      });
    }, 500);
  });
};
