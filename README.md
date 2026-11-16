# KOFI INC NETWORK - Backend

## Run it (on your laptop first)
```
npm install
cp .env.example .env
# Edit .env - put your real PAYSTACK keys
npm run seed
npm run dev
```
Backend runs on http://localhost:5000
Admin login (seeded): evans@kofiincnetwork.com / admin123

## API
- POST /api/auth/register {name,phone,email,password}
- POST /api/auth/login {phone,password}
- GET /api/packages ?network=MTN
- GET /api/wallet (auth)
- POST /api/payments/topup/init {amount,email} (auth) -> Paystack link
- GET /api/payments/verify/:reference (auth) -> credits wallet
- POST /api/orders {package_id, beneficiary} (auth)
- GET /api/orders (auth) - my orders
- GET /api/orders/track/:id - public track order
- GET /api/admin/stats, POST /api/admin/packages (admin)

## To go live
1. Host on Render / Railway / Hostinger VPS
2. Set env vars on host
3. Change FRONTEND_URL to your Netlify domain
4. Replace mock supplier in src/routes/orders.js with your real Data Supplier API
5. In frontend, change API_BASE to your backend URL

## Next steps
- Add Paystack webhook for automatic crediting
- Add real supplier API (Arkesel / Hubtel / your vendor)
- Add SMS notification
