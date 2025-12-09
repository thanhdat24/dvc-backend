
# DVC Backend (Vercel)

Backend đơn giản để gọi 2 API Dat & Sau (Can Tho DVC) bằng serverless function trên Vercel.

## 1. Cấu trúc

- `api/dat.js`  – Gọi API_DAT
- `api/sau.js`  – Gọi API_SAU
- `package.json` – Thông tin dự án Node

## 2. Biến môi trường cần cấu hình trên Vercel

Vào **Project → Settings → Environment Variables** và thêm:

- `API_DAT` – URL API Dat  
- `API_SAU` – URL API Sau  
- `AUTH_TOKEN` – chuỗi **Bearer ...** (token giống như bạn đang dùng bên Flask)

Ví dụ:

- API_DAT = `https://apidvc.cantho.gov.vn/pa/dossier/search?...`  
- API_SAU = `https://apidvc.cantho.gov.vn/pa/dossier/search?...`  
- AUTH_TOKEN = `Bearer eyJhbGciOi...`  (KHÔNG nên commit token này lên Git)

## 3. Cách deploy

1. Tạo project mới trên Vercel.
2. Upload toàn bộ folder này (hoặc push lên GitHub rồi import vào Vercel).
3. Chọn framework **Other** / **Node** (mặc định Vercel sẽ hiểu folder `api/` là Serverless Functions).
4. Cấu hình 3 biến môi trường ở trên.
5. Deploy.

Sau khi deploy xong bạn sẽ có 2 endpoint:

- `https://<tên-project>.vercel.app/api/dat`
- `https://<tên-project>.vercel.app/api/sau`

## 4. Cách gọi từ Telegram bot

Thay vì gọi trực tiếp `https://apidvc.cantho.gov.vn/...` từ Python,
bạn có thể gọi qua Vercel:

```python
API_DAT = "https://<tên-project>.vercel.app/api/dat"
API_SAU = "https://<tên-project>.vercel.app/api/sau"
```

Token sẽ được gắn trong backend Vercel nên bạn không phải gửi từ client.
