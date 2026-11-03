# MAZHI SHETI – UNIFIED NEON DATABASE & BACKEND INTEGRATION DIRECTIVE

> **Target Agent**: Senior Full-Stack Engineer, Next.js Architect, & PostgreSQL Database Specialist  
> **Project**: Mazhi Sheti Ecosystem Website (`E:\MazhiShetiWebsite`)  
> **Architecture Goal**: Single Source of Truth — One Central Neon PostgreSQL Database serving both the Next.js Web Platform and the Android Mobile Application.

---

## 1. Executive Mission & Primary Objective

You are tasked with establishing a unified, production-grade backend and database architecture for **Mazhi Sheti**.

Both the **Mazhi Sheti Website** (Next.js 15, App Router, TypeScript, Drizzle ORM) and the **Mazhi Sheti Android App** (Flutter / Native Android) must read and write to the **exact same live Neon PostgreSQL database instance**.

### Core Tenet
* **No Duplicate Databases**: Neon PostgreSQL is the sole source of truth.
* **No Client-Direct DB Connections from Mobile**: The Android application communicates exclusively via Next.js REST API endpoints (`/api/*`). The database connection string is never embedded in the client APK.
* **Dual-Platform Bi-Directional Sync**: Any farm, field, crop, or profile record created or updated on Android must instantly appear on the Web dashboard, and vice-versa.

---

## 2. Neon Cloud Configuration & Provisioning

Your central Neon database and cloud services have already been initialized under project **`royal-star-13732573`**.

### Database Connection String
```env
DATABASE_URL=postgresql://neondb_owner:npg_hmqFx6bTaY0s@ep-autumn-darkness-b333zsvx-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Neon CLI Provisioning Instructions
Run the following in the project root (`E:\MazhiShetiWebsite`):
```bash
# 1. Install / update Neon CLI
npm i -g neon@latest

# 2. Authenticate
neon login

# 3. Initialize project with all 5 required services
neon init -y --org-id org-little-river-77935796 --project-id royal-star-13732573 --branch production --services postgres,auth,object-storage,functions,realtime

# 4. Deploy and pull environment variables
neon deploy
```
*Note: If `neon` is not globally available, run using `npx neon@latest`.*

---

## 3. Database Schema Status & Drizzle ORM

The schema in `src/db/schema.ts` has been pushed to the Neon PostgreSQL database via `drizzle-kit push`. The primary tables are:

1. **`users`**: Core identity (`id`, `clerk_id`, `email`, `full_name`, `phone`, `role`, `avatar_url`, `is_active`)
2. **`user_profiles`**: Farmer KYC, preferred language (`mr`, `en`, `hi`), bio
3. **`farmer_profiles`**: Land ownership, total acres, farming practice, irrigation source, primary crops
4. **`farmer_locations`**: State (`Maharashtra`), District (`Nagpur`), Taluka, Village, Pincode, GPS coordinates
5. **`farms`**: Farm name, total acreage, survey 7/12 number, soil type (`black_cotton`), water availability, boundaries GeoJSON
6. **`farm_fields`**: Individual mapped plots (e.g. Plot A Cotton 3.1 Ac, Plot B Soybean 2.4 Ac) with polygon GeoJSON
7. **`crops`**: Crop variety, sowing date, vegetative growth stage, harvest forecast
8. **`soil_tests`**: N-P-K levels, pH, organic carbon %, micronutrients
9. **`device_telemetry`**: Soil moisture (68%), temperature (26°C-32°C), drone canopy NDVI index (0.78)
10. **`marketplace_products` & `orders`**: Bio-fertilizers, seeds, organic inputs, agricultural trade orders
11. **`community_posts` & `comments`**: Discussion threads, farmer advisories, peer recommendations

---

## 4. Required Shared API Implementation (`src/app/api/`)

The Next.js website acts as the **Shared API Gateway** for both Web and Android. Ensure all route handlers in `src/app/api/` are structured to accept JSON requests and return consistent `{ success: boolean, data?: any, error?: string }` responses.

### 4.1 Authentication & Profile Module
* **`GET /api/me`**: Returns authenticated user record, profile, and farmer metadata.
* **`POST /api/me/sync`**: **Crucial Identity Linker**:
  - Android authenticates via Google/Firebase Auth and passes `{ email, fullName, photoUrl, uid }`.
  - The API verifies whether a record in `users` exists with that `email`.
  - If existing, returns the linked user ID; if new, creates the user and default `farmer_profiles` and `farms` records.
  - Guarantees that logging in with `vineet.mandhalkar@gmail.com` on either Web or Android resolves to the exact same database row!

### 4.2 Farms & Field Management
* **`GET /api/farms`**: List all farms for the current authenticated farmer.
* **`POST /api/farms`**: Create a farm record (Name, Survey No, Acreage, Soil Type, Irrigation).
* **`GET /api/farms/[id]/fields`**: Retrieve mapped field polygons (GeoJSON) with current vegetative health.
* **`POST /api/farms/[id]/fields`**: Add or update GPS parcel coordinates.

### 4.3 Crops & Nutrient Advisory
* **`GET /api/crops`**: Active crops with growth stages (Vegetative, Flowering, Pod Development).
* **`POST /api/crops`**: Register new seasonal crop.
* **`GET /api/advisory/fertilizer?crop=Soybean&acres=2.5`**: Return dynamic NPK dosages (Urea, DAP, MOP, Zinc) computed against acreage and soil type.

### 4.4 Telemetry & Drone Aerial Progress
* **`GET /api/telemetry/live`**: Latest sensor readings (Soil Moisture: 68%, Ambient Temp: 26°C-32°C).
* **`GET /api/drone/progress`**: Drone flight telemetry (Canopy NDVI: 0.78, Canopy Closure: 84%, multispectral orthomosaic survey logs).

### 4.5 Community & Marketplace
* **`GET /api/community/posts`**: Feed of regional farmer discussions with upvotes and comment threads.
* **`POST /api/community/posts`**: Publish question or harvest report.
* **`POST /api/community/posts/[id]/comments`**: Add reply to an existing post.
* **`GET /api/marketplace/products`**: Active crop protection, certified seeds, organic inputs.

---

## 5. Security & Architectural Rules

1. **Zero Database Credentials on Clients**:
   - `DATABASE_URL` must only ever be accessed in server-side Next.js code (`src/db/index.ts`, `src/app/api/*`, Server Components, Server Actions).
   - Never prefix database secrets with `NEXT_PUBLIC_`.
2. **Parameterized Queries**:
   - Always query Neon PostgreSQL via Drizzle ORM (`db.select().from(...)`, `db.insert(...)`). Never concatenate raw SQL strings.
3. **CORS & Mobile Client Access**:
   - In `next.config.ts` or route handlers, ensure CORS headers permit requests from mobile apps:
   ```typescript
   headers: [
     { key: "Access-Control-Allow-Origin", value: "*" },
     { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
     { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
   ]
   ```
4. **Realtime Updates via Neon Realtime**:
   - Connect telemetry, drone logs, and order statuses to Neon Realtime channels so web and mobile clients receive live push updates without manual page refreshes.

---

## 6. End-to-End Verification Checklist

Before finishing, complete and verify the following:

- [ ] **Provisioning**: Neon CLI `neon deploy` executed, environment variables populated in `.env.local`.
- [ ] **Database Connection**: `npm run db:push` / `npx drizzle-kit push` connects to `royal-star-13732573` with zero schema drift.
- [ ] **Type Integrity & Build**: `npm run build` succeeds with zero TypeScript or linting errors.
- [ ] **API Functional Test**:
  - `curl -s http://localhost:3000/api/farms` returns valid farm JSON from Neon.
  - `curl -s http://localhost:3000/api/devices/telemetry` returns active live sensor metrics.
- [ ] **Cross-Platform Verification**:
  - Simulate creating a farm record via POST request &rarr; verify record exists in Neon PostgreSQL &rarr; verify Web dashboard displays the new farm.

