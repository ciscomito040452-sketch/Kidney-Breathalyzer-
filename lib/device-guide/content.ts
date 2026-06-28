import type { LucideIcon } from "lucide-react";
import {
  Bluetooth,
  Cloud,
  LayoutDashboard,
  Power,
  Smartphone,
  Wind,
} from "lucide-react";

export interface DeviceGuideStep {
  id: string;
  step: number;
  icon: LucideIcon;
  title: string;
  summary: string;
  details: string[];
  tip?: string;
}

export const DEVICE_GUIDE_INTRO = {
  title: "วิธีใช้ Kidney Breathalyzer",
  subtitle:
    "การวัดเกิดที่อุปกรณ์ IoT — แอปเป็นตัวแสดงผลหลังข้อมูลซิงค์เข้ามา อ่านครบทุกขั้นตอนก่อนเริ่มวัด",
  duration: "ใช้เวลาประมาณ 3–5 นาทีต่อครั้ง",
};

export const DEVICE_GUIDE_STEPS: DeviceGuideStep[] = [
  {
    id: "prepare",
    step: 1,
    icon: Power,
    title: "เตรียมอุปกรณ์",
    summary: "วางอุปกรณ์บนพื้นเรียบ ใกล้ปลั๊กไฟและเราเตอร์ Wi-Fi",
    details: [
      "ตรวจสอบว่าอุปกรณ์ชาร์จหรือเสียบสายไฟแล้ว",
      "อยู่ในที่อากาศถ่ายเท หลีกเลี่ยงควันและแอลกอฮอล์ใกล้เครื่อง",
      "ล้างมือและเช็ดปากให้แห้งก่อนเป่า",
    ],
    tip: "วัดตอนเช้าหลังตื่น หรือเวลาเดิมทุกวัน จะเห็นแนวโน้มชัดขึ้น",
  },
  {
    id: "wifi",
    step: 2,
    icon: Bluetooth,
    title: "เปิดเครื่องและเชื่อมต่อ Wi-Fi",
    summary: "เปิด Kidney Breathalyzer แล้วเชื่อมต่อเครือข่ายตามหน้าจออุปกรณ์",
    details: [
      "กดปุ่มเปิดเครื่องจนเห็นโลโก้บนหน้าจอ TFT",
      "เลือก Wi-Fi ของบ้านและใส่รหัสผ่าน",
      "รอจนไอคอนเชื่อมต่อแสดงว่าออนไลน์แล้ว",
    ],
    tip: "หาก Wi-Fi ขาด อุปกรณ์จะเก็บค่าชั่วคราวและส่งเมื่อกลับมาออนไลน์",
  },
  {
    id: "app-ready",
    step: 3,
    icon: Smartphone,
    title: "เปิดแอปและตรวจสถานะ",
    summary: "เข้าหน้าหลักของแอป ตรวจว่าสถานะอุปกรณ์พร้อม",
    details: [
      "เปิดแอป Kidney Breathalyzer บนมือถือ",
      "ดูที่การ์ดสถานะอุปกรณ์ — ควรแสดงเชื่อมต่อหรือโหมดสาธิต",
      "ถ้าไม่ซิงค์ ให้ตรวจ Wi-Fi ของอุปกรณ์อีกครั้ง",
    ],
  },
  {
    id: "breathe",
    step: 4,
    icon: Wind,
    title: "เป่าลมหายใจที่อุปกรณ์",
    summary: "วางปากสนิทกับท่อเป่า หายใจเข้าลึก แล้วเป่าออกช้าและต่อเนื่อง",
    details: [
      "ห้ามเป่าแรงเกินไปหรือสั้นเกินไป — ทำตามเสียง/ข้อความบนจออุปกรณ์",
      "เป่าครั้งละประมาณ 6–10 วินาที หรือจนอุปกรณ์แจ้งว่าเสร็จ",
      "หลีกเลี่ยงอาหาร/เครื่องดื่มแรง ๆ 30 นาทีก่อนวัด (ถ้าเป็นไปได้)",
    ],
    tip: "ถ้าเป่าไม่สำเร็จ รอ 1–2 นาทีแล้วลองใหม่ — ไม่ต้องวัดซ้ำทันที",
  },
  {
    id: "device-measures",
    step: 5,
    icon: LayoutDashboard,
    title: "รออุปกรณ์วิเคราะห์ค่า",
    summary: "ESP32 อ่านเซนเซอร์ MQ-135 และ MQ-3 แล้วคำนวณเบื้องต้นบนเครื่อง",
    details: [
      "อย่าเปิดฝาหรือย้ายอุปกรณ์ระหว่างวัด",
      "หน้าจออุปกรณ์จะแสดงว่ากำลังประมวลผล",
      "เมื่อเสร็จ ข้อมูลจะถูกส่งไปยังระบบอัตโนมัติ",
    ],
  },
  {
    id: "sync",
    step: 6,
    icon: Cloud,
    title: "ดูผลบนแอปหลังซิงค์",
    summary: "ผลการคัดกรองความเสี่ยงจะปรากฏบนหน้าหลัก ประวัติ และรายละเอียดแต่ละครั้ง",
    details: [
      "รอสักครู่แล้วดึงหน้าหลักลงเพื่อรีเฟรช (หรือเปิดแอปใหม่)",
      "ดูคะแนนความเสี่ยง แอมโมเนีย อะซิโทน และสรุปจาก AI",
      "แตะการ์ดเพื่อดูรายละเอียดและคำอธิบายเพิ่มเติม",
    ],
    tip: "ผลลัพธ์เป็นการคัดกรองความเสี่ยงเบื้องต้น ไม่ใช่การวินิจฉัยโรค",
  },
];

/** Short steps for onboarding step 4 */
export const ONBOARDING_DEVICE_STEPS = DEVICE_GUIDE_STEPS.filter((s) =>
  ["wifi", "breathe", "sync"].includes(s.id)
).map((s) => ({
  icon: s.icon,
  title: s.title,
  description: s.summary,
}));
