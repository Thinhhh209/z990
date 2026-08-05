/**
 * admin.js — Logic riêng cho trang /admin.
 *
 * LƯU Ý BẢO MẬT: mật khẩu bên dưới nằm ngay trong mã nguồn (chạy ở trình
 * duyệt), nên đây chỉ là lớp ngăn chặn cơ bản — không phải bảo mật thực sự.
 * Bất kỳ ai xem được mã nguồn trang đều có thể thấy mật khẩu. Nếu bạn public
 * trang này, hãy đổi mật khẩu mặc định và cân nhắc nâng cấp lên xác thực có
 * máy chủ ở phiên bản sau.
 */

const ADMIN_PASSWORD = "portfolio123"; // 👉 Đổi mật khẩu này trước khi dùng thật!
const ADMIN_AUTH_KEY = "portfolio_admin_authed";

const SKILL_FIELDS = [
  { key: "name", label: "Tên kỹ năng", type: "text" },
  { key: "level", label: "Mức độ (0–100)", type: "number" }
];
const PROJECT_FIELDS = [
  { key: "name", label: "Tên dự án", type: "text" },
  { key: "description", label: "Mô tả", type: "textarea" },
  { key: "link", label: "Link (không bắt buộc)", type: "text" },
  { key: "image", label: "Ảnh — URL (không bắt buộc)", type: "text" }
];
const ACHIEVEMENT_FIELDS = [
  { key: "title", label: "Tiêu đề", type: "text" },
  { key: "year", label: "Năm", type: "text" },
  { key: "description", label: "Mô tả", type: "textarea" }
];

/* ------------------------------------------------------------------------
   ĐĂNG NHẬP
   ------------------------------------------------------------------------ */
function initLogin() {
  const loginScreen = document.getElementById("login-screen");
  const adminPanel = document.getElementById("admin-panel");
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password-input");
  const loginError = document.getElementById("login-error");

  function showPanel() {
    loginScreen.hidden = true;
    adminPanel.hidden = false;
    loadFormData();
  }

  if (sessionStorage.getItem(ADMIN_AUTH_KEY) === "1") {
    showPanel();
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
      loginError.hidden = true;
      showPanel();
    } else {
      loginError.hidden = false;
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    location.reload();
  });
}

/* ------------------------------------------------------------------------
   REPEATER (danh sách kỹ năng / dự án / thành tích có thể thêm-xoá dòng)
   ------------------------------------------------------------------------ */
function buildRepeaterItem(fields, values) {
  const item = document.createElement("div");
  item.className = "repeater-item";

  fields.forEach((f) => {
    const label = document.createElement("label");
    label.className = "field";
    const span = document.createElement("span");
    span.textContent = f.label;
    label.appendChild(span);

    const input = f.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
    if (f.type !== "textarea") input.type = f.type === "number" ? "number" : "text";
    input.name = f.key;
    input.value = values[f.key] ?? "";
    if (f.type === "textarea") input.rows = 2;

    label.appendChild(input);
    item.appendChild(label);
  });

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "repeater-remove";
  removeBtn.textContent = "Xoá dòng này";
  removeBtn.addEventListener("click", () => item.remove());
  item.appendChild(removeBtn);

  return item;
}

function renderRepeater(containerId, fields, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  (items && items.length ? items : []).forEach((values) => {
    container.appendChild(buildRepeaterItem(fields, values));
  });
}

function collectRepeater(containerId, fields, requiredKey) {
  const container = document.getElementById(containerId);
  return Array.from(container.querySelectorAll(".repeater-item"))
    .map((item) => {
      const obj = {};
      fields.forEach((f) => {
        const el = item.querySelector(`[name="${f.key}"]`);
        let val = el ? el.value.trim() : "";
        if (f.type === "number") val = Math.max(0, Math.min(100, Number(val) || 0));
        obj[f.key] = val;
      });
      return obj;
    })
    .filter((obj) => (requiredKey ? String(obj[requiredKey] ?? "").length > 0 : true));
}

/* ------------------------------------------------------------------------
   NẠP DỮ LIỆU HIỆN TẠI VÀO FORM
   ------------------------------------------------------------------------ */
async function loadFormData() {
  let profile;
  try {
    profile = await loadProfile();
  } catch (e) {
    console.error(e);
    profile = {};
  }
  populateForm(profile);
}

function populateForm(profile) {
  const form = document.getElementById("profile-form");
  const set = (name, value) => {
    if (form.elements[name]) form.elements[name].value = value ?? "";
  };

  set("name", profile.name);
  set("title", profile.title);
  set("birthday", profile.birthday);
  set("job", profile.job);
  set("location", profile.location);
  set("avatar", profile.avatar);
  set("cover", profile.cover);
  set("bio", profile.bio);
  set("hobbies", (profile.hobbies || []).join(", "));

  const socials = profile.socials || {};
  set("social_facebook", socials.facebook);
  set("social_zalo", socials.zalo);
  set("social_tiktok", socials.tiktok);
  set("social_instagram", socials.instagram);
  set("social_youtube", socials.youtube);
  set("social_github", socials.github);
  set("social_email", socials.email);

  renderRepeater("skills-repeater", SKILL_FIELDS, profile.skills);
  renderRepeater("projects-repeater", PROJECT_FIELDS, profile.projects);
  renderRepeater("achievements-repeater", ACHIEVEMENT_FIELDS, profile.achievements);
}

/* ------------------------------------------------------------------------
   THU THẬP DỮ LIỆU TỪ FORM
   ------------------------------------------------------------------------ */
function collectFormData() {
  const form = document.getElementById("profile-form");
  const val = (name) => (form.elements[name] ? form.elements[name].value.trim() : "");

  return {
    name: val("name"),
    title: val("title"),
    avatar: val("avatar"),
    cover: val("cover"),
    bio: val("bio"),
    birthday: val("birthday"),
    job: val("job"),
    location: val("location"),
    hobbies: val("hobbies").split(",").map((s) => s.trim()).filter(Boolean),
    skills: collectRepeater("skills-repeater", SKILL_FIELDS, "name"),
    socials: {
      facebook: val("social_facebook"),
      zalo: val("social_zalo"),
      tiktok: val("social_tiktok"),
      instagram: val("social_instagram"),
      youtube: val("social_youtube"),
      github: val("social_github"),
      email: val("social_email")
    },
    projects: collectRepeater("projects-repeater", PROJECT_FIELDS, "name"),
    achievements: collectRepeater("achievements-repeater", ACHIEVEMENT_FIELDS, "title")
  };
}

/* ------------------------------------------------------------------------
   HÀNH ĐỘNG: LƯU / XUẤT FILE / KHÔI PHỤC MẶC ĐỊNH
   ------------------------------------------------------------------------ */
function showStatus(message) {
  const el = document.getElementById("save-status");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(showStatus._timer);
  showStatus._timer = setTimeout(() => (el.hidden = true), 4000);
}

function initFormActions() {
  const form = document.getElementById("profile-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = collectFormData();
    saveProfile(data);
    showStatus("✅ Đã lưu! Mở lại (hoặc tải lại) trang cá nhân để thấy thay đổi.");
  });

  document.getElementById("add-skill-btn").addEventListener("click", () => {
    document.getElementById("skills-repeater").appendChild(buildRepeaterItem(SKILL_FIELDS, {}));
  });
  document.getElementById("add-project-btn").addEventListener("click", () => {
    document.getElementById("projects-repeater").appendChild(buildRepeaterItem(PROJECT_FIELDS, {}));
  });
  document.getElementById("add-achievement-btn").addEventListener("click", () => {
    document.getElementById("achievements-repeater").appendChild(buildRepeaterItem(ACHIEVEMENT_FIELDS, {}));
  });

  document.getElementById("export-btn").addEventListener("click", () => {
    const data = collectFormData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profile.json";
    a.click();
    URL.revokeObjectURL(url);
    showStatus("📦 Đã xuất file profile.json — thay vào thư mục data/ để lưu vĩnh viễn cho mọi trình duyệt.");
  });

  document.getElementById("reset-btn").addEventListener("click", async () => {
    const ok = confirm(
      "Khôi phục dữ liệu mặc định từ data/profile.json?\nMọi thay đổi đã lưu trên trình duyệt này sẽ bị xoá."
    );
    if (!ok) return;
    clearSavedProfile();
    const defaults = await loadDefaultProfile();
    populateForm(defaults);
    showStatus("↩️ Đã khôi phục về dữ liệu mặc định (nhớ bấm Lưu thay đổi để áp dụng).");
  });
}

/* ------------------------------------------------------------------------
   KHỞI CHẠY
   ------------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initFormActions();
});
