# রান করতে সমস্যা হলে (Bangla Troubleshooting)

এই প্রোজেক্ট রান না হওয়ার সবচেয়ে কমন কারণগুলো নিচে দেওয়া হলো:

## 1) `npm install` এ 403 / network error
এটা কোডের সমস্যা না, আপনার নেটওয়ার্ক/registry policy ব্লক করছে।

সমাধান:
```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
cd backend
npm install
```

যদি অফিস/কোম্পানি proxy থাকে:
```bash
npm config set proxy http://YOUR_PROXY:PORT
npm config set https-proxy http://YOUR_PROXY:PORT
```

## 2) MySQL connection error
`.env` এ DB credential ভুল হলে app চালু হবে না।

চেক করুন:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## 3) Port conflict (`EADDRINUSE`)
4000 বা 3306/3307 পোর্ট আগে থেকেই ব্যবহার হলে error আসবে।

Linux/macOS:
```bash
lsof -i :4000
lsof -i :3307
```
Windows (PowerShell):
```powershell
netstat -ano | findstr :4000
netstat -ano | findstr :3307
```

## 4) Docker দিয়ে সবচেয়ে সহজে রান
লোকাল Node/MySQL সেটআপ না করেও চালাতে পারবেন:
```bash
docker compose up --build
```
তারপর খুলুন: `http://localhost:4000`

## Default Login
- admin@travel.local / admin123
- manager@travel.local / admin123
