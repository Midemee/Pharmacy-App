# ChemistPro Frontend

A React + JavaScript frontend for the ChemistProject Spring Boot backend.

## Features
- Landing page with pharmacy hero artwork
- Register and sign-in screens
- Authenticated pharmacy workspace
- Inventory overview, search, add, update and delete
- Dispensing workflow that submits a sale and refreshes stock
- Responsive layouts for desktop, tablet and mobile

## Requirements
- Node.js 18+
- The ChemistProject Spring Boot backend running locally (default `http://localhost:8080`)
- MongoDB running as configured by the backend

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5500**.

The Vite server uses port `5500` because the current backend CORS configuration already permits `http://localhost:5500`.

## Backend URL

By default, requests go to `http://localhost:8080`. To change it, create a `.env` file in this folder:

```env
VITE_API_URL=http://localhost:8080
```

Restart the Vite server after changing environment variables.

## API endpoints used

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/Authorization/Register` |
| Login | POST | `/Authorization/Login` |
| Logout | POST | `/Authorization/Logout` |
| List medicines | GET | `/DrugManagement/GetAllDrugs` |
| Add medicine | POST | `/DrugManagement/AddDrug` |
| Update medicine | POST | `/DrugManagement/UpdateDrug` |
| Search medicines | GET | `/DrugManagement/SearchDrug` |
| Delete medicine | DELETE | `/DrugManagement/DeleteDrug` |
| Dispense sale | POST | `/Sales/dispenseDrug` |

## Important backend integration notes

1. **Login payload:** the backend request DTO uses `userName` and `password`. The login response returns `jwtId`; the frontend stores it and sends `Authorization: Bearer <token>`.
2. **Registration:** the backend requires `fullName`, `storeName`, `userName`, and `passWord`. The backend currently enforces at least 8 characters, one uppercase letter, and one digit in the password.
3. **Inventory isolation:** the backend derives the store ID from the authenticated principal, so the frontend does not send a `storeId`.
4. **Dispensing:** the backend currently expects `name` plus a `drugs` array. Each drug contains `id`, `dosage`, `batchId`, `drugName`, and `quantity`.
5. **CORS:** the provided backend allows `http://localhost:5500`, which is why the frontend dev server runs on that port. If you deploy the frontend elsewhere, add its exact origin to `SecurityConfig`.
6. **Sales history:** the supplied backend exposes a dispense endpoint but no endpoint for listing previous sales. This UI confirms a sale using the response from the dispense request; it does not pretend to show historical sales.

## Notes
- The UI expects the `Drug` response fields shown in the backend model: `id`, `brandName`, `genericName`, `strength`, `dosage`, `manufacturer`, `batchNumber`, `manufactureDate`, `expiryDate`, `price`, and `quantityInStock`.
- The backend's `SearchDrug` and `GetAmountOfDrugs` endpoints are not required for the current screens; inventory is loaded through `GetAllDrugs` and filtered in the browser.
# Pharmacy-App
