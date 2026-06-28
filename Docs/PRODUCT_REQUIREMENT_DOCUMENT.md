## Kidney Breathalyzer — Web App Requirements

### 1\. Overview

Project type: Web application (mobile-first, deployed บน Vercel)  
 Tech stack แนะนำ: Next.js 14 \+ Tailwind CSS \+ Supabase \+ Recharts  
 เป้าหมาย: ให้กรรมการเปิด URL แล้วเห็นภาพรวมของระบบและทดลองใช้งานได้จริง โดยไม่ต้องมีอุปกรณ์ฮาร์ดแวร์

---

### 2\. Pages / Screens

#### 2.1 Splash / Landing Page (/)

* แสดงชื่อ project และ tagline  
* ปุ่ม "เริ่มต้นใช้งาน" → ไปหน้า Login  
* ปุ่ม "ดู Demo" → ข้าม login เข้าสู่ระบบด้วย demo account  
* Medical disclaimer สั้น ๆ ที่ footer

#### 2.2 Auth Pages (/login, /register)

* Login ด้วย Email \+ Password  
* Register พร้อมกรอก risk factor เบื้องต้น (เบาหวาน, ความดัน, ประวัติครอบครัว)  
* ใช้ Supabase Auth หรือ mock auth สำหรับ demo

#### 2.3 Onboarding (/onboarding)

* แสดงครั้งแรกหลัง register เท่านั้น  
* Step 1: กรอกข้อมูลส่วนตัว (อายุ, เพศ, น้ำหนัก)  
* Step 2: เลือก risk factor (checkbox: เบาหวาน / ความดัน / ประวัติครอบครัว / อื่น ๆ)  
* Step 3: อ่านและยอมรับ medical disclaimer  
* Step 4: วิธีใช้งานอุปกรณ์ (ภาพ \+ ข้อความสั้น ๆ)

#### 2.4 Dashboard / Home (/dashboard)

หน้าหลักหลัง login ประกอบด้วย:

* Risk Score Card — แสดง risk level ล่าสุด (Low / Moderate / High) พร้อมสี  
* Trend Chart — กราฟเส้นแสดงค่า sensor ย้อนหลัง 7 / 30 วัน (toggle ได้)  
* Last Measurement — วันเวลาและค่าที่วัดล่าสุด  
* Device Status Badge — Connected / Disconnected / Demo Mode  
* Last Sync — วันเวลาที่ข้อมูลจากอุปกรณ์ซิงค์ล่าสุด  
* Gamification widgets (P1) — Streak, Weekly Goal, 14-Day Challenge  
* Trend Chart — กราฟเส้นแสดงค่า sensor ย้อนหลัง 7 / 30 วัน (toggle ได้)  
* Last Measurement — วันเวลาและค่าที่ซิงค์ล่าสุด  
* AI Insight Card — สรุปจาก AI ของการวัดล่าสุด

#### 2.5 Device Sync Model (ไม่มีหน้าวัดในแอป)

การวัดเกิดที่ **อุปกรณ์ IoT (ESP32)** — แอปเป็น companion แสดงผลเท่านั้น

* ผู้ใช้เป่าลมหายใจที่อุปกรณ์ (ไม่ใช่ในแอป)  
* อุปกรณ์อ่านค่าเซนเซอร์และส่งข้อมูลผ่าน Wi-Fi → `POST /api/device/ingest`  
* Backend คำนวณ risk score + AI explanation แล้วบันทึก  
* แอปแสดงผลบน Dashboard, History, Result  
* `/measure` redirect ไป `/dashboard` (legacy route)

**Demo Mode (ไม่มี hardware):** Pre-load ข้อมูล 30 วัน — ไม่มี UI สำหรับวัดใหม่ในแอป

#### 2.6 Result & AI Report (/result/:id)

* แสดงค่า sensor ที่วัดได้ (MQ-135, MQ-3)  
* Risk level badge (Low / Moderate / High)  
* AI Explanation — อธิบายว่าทำไมถึงได้ risk level นี้ (เช่น "ค่า ammonia สูงกว่าค่าเฉลี่ยของคุณ 18% ติดต่อกัน 3 วัน")  
* Health tips ทั่วไป (ดื่มน้ำ, ลดโปรตีน ฯลฯ)  
* Disclaimer ชัดเจนว่า "นี่ไม่ใช่การวินิจฉัยโรค"  
* ปุ่ม "พบแพทย์" (ถ้า High risk)

#### 2.7 History Page (/history)

* ตารางหรือ list แสดงผลการวัดทั้งหมด  
* กรอง: วันที่, risk level  
* กดดูรายละเอียดแต่ละครั้งได้ → link ไป /result/:id

#### 2.8 Profile & Settings (/profile)

* แก้ไขข้อมูลส่วนตัวและ risk factor  
* เปิด/ปิด notification  
* ปุ่ม logout

---

### 3\. Mock Data Mode

เนื่องจากกรรมการไม่มีอุปกรณ์จริง ระบบต้องรองรับ Demo Mode ดังนี้

* Pre-load ข้อมูลย้อนหลัง 30 วันสำหรับ demo account เพื่อให้กราฟ trend ดูมีข้อมูล  
* Demo account มี risk level กระจายครบ Low / Moderate / High ในประวัติ 30 วัน (3 วันล่าสุด curated เป็น moderate พร้อมแนวโน้มแอมโมเนียขึ้น) เพื่อให้เห็นทุก state  
* Device Status Badge แสดง "โหมดสาธิต" บน Dashboard  
* **ไม่มี** in-app measurement UI — การวัดใหม่ใน production มาจาก ESP32 ผ่าน `/api/device/ingest`  
* `POST /api/mock/generate` สำหรับ dev/firmware testing เท่านั้น (ไม่ expose ใน UI)

---

### 4\. AI Engine (MVP)

สำหรับ Hackathon ใช้ rule-based scoring ก่อน ไม่จำเป็นต้องใช้ ML model จริง

Risk Score Algorithm (เบื้องต้น):

base\_score \= normalize(MQ135\_value) \* 0.6 \+ normalize(MQ3\_value) \* 0.4

risk\_factor\_multiplier:

  \+ 0.1 ถ้ามีโรคเบาหวาน

  \+ 0.1 ถ้ามีความดันโลหิตสูง

  \+ 0.05 ถ้ามีประวัติครอบครัว

trend\_bonus:

  \+ 0.15 ถ้าค่าสูงกว่าค่าเฉลี่ยส่วนตัว \> 15% ติดต่อกัน 3 วัน

final\_score \= base\_score \+ risk\_factor\_multiplier \+ trend\_bonus

Low    \= 0.00 – 0.39

Moderate \= 0.40 – 0.69

High   \= 0.70 – 1.00

AI Explanation ใช้ template string เลือกตาม factor ที่ทำให้ score สูง เช่น:

* "ค่า ammonia ในลมหายใจสูงกว่าค่าเฉลี่ยของคุณ X% ในช่วง 7 วันที่ผ่านมา"  
* "ประกอบกับประวัติโรคเบาหวาน ระบบจึงประเมินความเสี่ยงในระดับ Moderate"

---

### 5\. Database Schema (Supabase / PostgreSQL)

sql

users

  id uuid PK

  email text

  created\_at timestamp

user\_profiles

  id uuid PK

  user\_id uuid FK → users

  age int

  gender text

  weight\_kg float

  has\_diabetes boolean

  has\_hypertension boolean

  has\_family\_history boolean

  updated\_at timestamp

measurements

  id uuid PK

  user\_id uuid FK → users

  measured\_at timestamp

  mq135\_value float

  mq3\_value float

  risk\_score float

  risk\_level text  \-- 'low' | 'moderate' | 'high'

  is\_mock boolean

  ai\_explanation text

  created\_at timestamp

---

### 6\. API Routes (Next.js API Routes)

POST /api/auth/register

POST /api/auth/login

POST /api/device/ingest         \-- ESP32 ส่งข้อมูลการวัด (primary ingest)

POST /api/measurements          \-- deprecated; ใช้ device/ingest แทน

GET  /api/measurements          \-- ดึงประวัติของ user

GET  /api/measurements/:id      \-- ดึงผลการวัดครั้งนั้น

GET  /api/measurements/trend    \-- ดึงข้อมูลสำหรับ chart

POST /api/mock/generate         \-- dev/firmware testing only

GET  /api/profile               \-- ดึง profile

PUT  /api/profile               \-- อัพเดท profile

---

### 7\. UI / UX Requirements

* Mobile-first — ออกแบบสำหรับหน้าจอ 390×844px (iPhone 14\) เป็นหลัก  
* Color system:  
  * Low risk → สีเขียว  
  * Moderate risk → สีเหลือง/ส้ม  
  * High risk → สีแดง  
  * Primary brand color → สีน้ำเงินเข้ม หรือ teal  
* Font: Inter หรือ Noto Sans Thai (รองรับภาษาไทย)  
* ภาษา: UI ภาษาไทยเป็นหลัก, เทคนิคภาษาอังกฤษได้  
* Disclaimer ต้องแสดงในทุกหน้าที่แสดงผล risk (footer หรือ banner)

---

### 8\. Non-functional Requirements

* Deploy บน Vercel (free tier)  
* Load time \< 3 วินาที บน 4G  
* ไม่เก็บข้อมูลชื่อ-นามสกุลจริงของผู้ทดสอบ (PDPA-aware)  
* Responsive เฉพาะ mobile และ tablet เป็นหลัก ไม่จำเป็นต้อง perfect บน desktop

---

### 9\. Pages Priority (สำหรับ Hackathon)

จัดลำดับตาม impact ที่กรรมการจะเห็น

| Priority | Page | เหตุผล |
| ----- | ----- | ----- |
| P0 | Dashboard + Device Sync display | หน้าแรก — แสดงข้อมูลจากอุปกรณ์ IoT |
| P0 | Result \+ AI Explanation | จุดขายหลักของโปรเจค |
| P1 | History \+ Trend Chart | แสดง value proposition ระยะยาว |
| P1 | Onboarding \+ Disclaimer | แสดง ethical awareness |
| P2 | Login / Register | ต้องมีแต่ไม่ต้องสวยมาก |
| P2 | Profile / Settings | ทำแบบ minimal ได้ |

---

### 10\. Medical Disclaimer (ข้อความที่ต้องใช้)

ใส่ในทุกหน้าที่แสดงผล risk:

"ผลลัพธ์จากระบบนี้เป็นเพียงการคัดกรองความเสี่ยงเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยโรค ผู้ใช้งานควรปรึกษาแพทย์หากมีข้อสงสัยหรือได้รับการแจ้งเตือนความเสี่ยง"

