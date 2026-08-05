/**
 * data.js — Nguồn dữ liệu DUY NHẤT cho toàn bộ trang.
 *
 * Cách hoạt động:
 * 1. Dữ liệu gốc nằm trong data/profile.json (chỉnh sửa trực tiếp file này
 *    nếu bạn muốn thay đổi "mặc định" mà mọi trình duyệt đều thấy).
 * 2. Khi chỉnh sửa qua trang /admin, dữ liệu mới được lưu vào localStorage
 *    của trình duyệt đó — đè lên dữ liệu mặc định mà KHÔNG cần server/database.
 * 3. Trang chính (index.html) và trang quản trị (admin.html) đều gọi các
 *    hàm dưới đây, nên chỉ cần sửa ở một nơi, mọi nơi hiển thị đều đồng bộ.
 *
 * Muốn nâng cấp lên có server thật? Sau này chỉ cần thay nội dung bên trong
 * loadProfile() / saveProfile() để gọi API thay vì localStorage — phần giao
 * diện (main.js, admin.js) không cần đổi gì.
 */

const PROFILE_STORAGE_KEY = "portfolio_profile_data";
const DEFAULT_PROFILE_URL = "data/profile.json";

/**
 * Bản dữ liệu dự phòng, dùng khi trình duyệt chặn việc tải data/profile.json
 * (thường gặp khi mở file index.html trực tiếp bằng cách nhấp đúp, thay vì
 * chạy qua một local server). Nội dung giống hệt data/profile.json — nếu bạn
 * sửa file đó, nên cập nhật cả ở đây để tránh lệch dữ liệu khi không có server.
 */
const FALLBACK_PROFILE = {
  name: "Nguyễn Văn A",
  title: "Web Developer & Người kể chuyện bằng code",
  avatar: "",
  cover: "",
  bio: "Xin chào, mình là một lập trình viên yêu thích tạo ra những sản phẩm nhỏ nhưng có hồn. Đây là phiên bản đầu tiên của trang cá nhân — nơi mình sẽ cập nhật hành trình học tập, dự án và những cột mốc của bản thân theo thời gian.",
  birthday: "01/01/2000",
  job: "Lập trình viên Frontend",
  location: "Việt Nam",
  hobbies: ["Đọc sách", "Nghe nhạc", "Chơi game", "Chụp ảnh"],
  skills: [
    { name: "HTML / CSS", level: 90 },
    { name: "JavaScript", level: 80 },
    { name: "UI/UX Design", level: 70 },
    { name: "Git & GitHub", level: 75 }
  ],
  socials: { facebook: "", zalo: "", tiktok: "", instagram: "", youtube: "", github: "", email: "" },
  projects: [
    {
      name: "Trang cá nhân v1",
      description: "Sản phẩm đầu tay — trang giới thiệu bản thân với hiệu ứng cuộn mượt, dark mode và trang quản trị riêng.",
      link: "",
      image: ""
    }
  ],
  achievements: [
    {
      title: "Hoàn thành phiên bản đầu tiên của trang cá nhân",
      year: "2026",
      description: "Cột mốc đầu tiên trong hành trình xây dựng thương hiệu cá nhân."
    }
  ]
};

/**
 * Lấy dữ liệu đang được dùng để hiển thị:
 * ưu tiên bản đã chỉnh trong localStorage, nếu chưa có thì lấy bản mặc định.
 */
async function loadProfile() {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Dữ liệu lưu trong trình duyệt bị lỗi, dùng dữ liệu mặc định.", e);
    }
  }
  return loadDefaultProfile();
}

/** Lấy bản dữ liệu gốc từ data/profile.json (bỏ qua mọi chỉnh sửa đã lưu). */
async function loadDefaultProfile() {
  try {
    const res = await fetch(DEFAULT_PROFILE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (e) {
    // Thường xảy ra khi mở file bằng cách nhấp đúp (giao thức file://) —
    // trình duyệt chặn fetch() vì lý do bảo mật (CORS). Dùng bản dự phòng
    // để trang vẫn chạy được ngay, không cần cấu hình gì thêm.
    console.warn("Không tải được data/profile.json, dùng dữ liệu dự phòng. Chạy qua local server để dùng file JSON thật.", e);
    return JSON.parse(JSON.stringify(FALLBACK_PROFILE));
  }
}

/** Lưu dữ liệu mới (gọi từ trang admin sau khi người dùng bấm "Lưu thay đổi"). */
function saveProfile(profileData) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData, null, 2));
}

/** Xoá mọi chỉnh sửa đã lưu, quay lại dùng dữ liệu mặc định trong profile.json. */
function clearSavedProfile() {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

/** true nếu đang có bản chỉnh sửa lưu riêng trên trình duyệt này. */
function hasSavedProfile() {
  return localStorage.getItem(PROFILE_STORAGE_KEY) !== null;
}
