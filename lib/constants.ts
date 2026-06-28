export const MEDICAL_DISCLAIMER =
  "ผลลัพธ์จากระบบนี้เป็นเพียงการคัดกรองความเสี่ยงเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยโรค ผู้ใช้งานควรปรึกษาแพทย์หากมีข้อสงสัยหรือได้รับการแจ้งเตือนความเสี่ยง";

export const APP_NAME = "Kidney Breathalyzer";
export const APP_TAGLINE = "คัดกรองความเสี่ยงโรคไตจากลมหายใจ";

export const DEMO_USER_ID = "00000000-0000-4000-8000-000000000001";

export const MQ135_RANGE = { min: 150, max: 400 };
export const MQ3_RANGE = { min: 0.1, max: 0.8 };

export const WEEKLY_GOAL_TARGET = 3;
export const CHALLENGE_DAYS = 14;

export const RISK_LABELS = {
  low: "ความเสี่ยงต่ำ",
  moderate: "ความเสี่ยงปานกลาง",
  high: "ความเสี่ยงสูง",
} as const;

export const RISK_SHORT_LABELS = {
  low: "ต่ำ",
  moderate: "ปานกลาง",
  high: "สูง",
} as const;

export const DEVICE_STATUS_LABELS = {
  connected: "เชื่อมต่อแล้ว",
  disconnected: "ไม่ได้เชื่อมต่อ",
  demo: "โหมดสาธิต",
} as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "หน้าหลัก", icon: "Home" as const },
  { href: "/history", label: "ประวัติ", icon: "BarChart3" as const },
  { href: "/ai-insight", label: "เชิงลึก", icon: "Sparkles" as const },
  { href: "/profile", label: "โปรไฟล์", icon: "User" as const },
] as const;

export const HISTORY_DAY_OPTIONS = [7, 30, 90] as const;
export type HistoryDays = (typeof HISTORY_DAY_OPTIONS)[number];

export const DASHBOARD_TREND_DAY_OPTIONS = [7, 30, 90] as const;
export type DashboardTrendDays = (typeof DASHBOARD_TREND_DAY_OPTIONS)[number];

export const CTA_VIEW_DETAIL = "ดูรายละเอียด";
export const CTA_DEVICE_GUIDE = "ดูวิธีใช้อุปกรณ์";
export const ROUTE_DEVICE_GUIDE = "/guide/device";
export const ROUTE_PROFILE_EDIT = "/profile/edit";
