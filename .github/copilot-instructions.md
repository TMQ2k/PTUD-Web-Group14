# 🤖 GitHub Copilot – Custom Repository Instructions

Tệp hướng dẫn tuỳ chỉnh cho Copilot nhằm đảm bảo mọi thao tác đều có xác nhận rõ ràng từ người dùng.

---

## ⚙️ QUY TẮC CHUNG

Với **mọi loại file** (`.js`, `.ts`, `.tsx`, `.java`, `.py`, `.ino`, `.html`, `.css`, `.md`, `.json`, v.v...):

> **Trước khi thực hiện bất kỳ hành động nào**, Copilot phải hỏi lại người dùng:
> Bạn muốn tôi chỉnh sửa file hay hướng dẫn cách thực hiện?
> Chọn 1 để chỉnh sửa file.
> Chọn 2 để hướng dẫn cách thực hiện.

> Nếu chọn **1** → Copilot được phép **chỉnh sửa hoặc viết code trực tiếp** trong file hiện tại đồng thời giải thích chi tiết cách thức hoạt động của từng dòng code.
> Nếu chọn **2** → Copilot **chỉ giải thích các bước, hướng dẫn cách làm**, **không chỉnh sửa file**.
> Nếu việc chỉnh sửa có sử dụng thư viện X của framework hiện tại → Copilot phải hỏi lại:
> Bạn có muốn tôi chỉnh sửa trực tiếp bằng cách sử dụng thư viện X (tên thư viện) của framework hiện tại không?
> Chọn 1 để có + giải thích cách làm.
> Chọn 2 để không, chỉ ra thư viện nào cần dùng và cách cài đặt kèm hướng dẫn.

---

## ⚛️ JAVASCRIPT / TYPESCRIPT (`**/*.js`, `**/*.ts`, `**/*.tsx`)

> Sau câu hỏi mặc định, Copilot hỏi thêm:
> Bạn đang làm việc với React/Tailwind.
> Bạn có muốn tôi giữ nguyên cấu trúc JSX hiện có không?
> Chọn 1 để giữ nguyên.
> Chọn 2 để refactor component.
> **Khi chỉnh sửa:**
> Ưu tiên dùng **arrow function components**.  
> Giữ nguyên `className` và các Tailwind classes.  
> Không thêm thư viện ngoài khi chưa được yêu cầu.  
> Tuân thủ style hiện có (Prettier, ESLint nếu có).

## 📋 LƯU Ý CHUNG

- Luôn hỏi câu xác nhận **bằng tiếng Việt**.
- Không thực hiện hành động nào trước khi người dùng chọn.
- Nếu có nhiều quy định cùng lúc (VD: `.tsx` và `.css`), ưu tiên loại chính (JS/TS trước CSS).
- Khi trả lời hoặc chỉnh sửa, nên thêm dòng:
  > _(Theo hướng dẫn trong `.github/copilot-instructions.md`)_
