import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <h1 className="text-xl font-semibold">ไม่พบหน้าที่ต้องการ</h1>
      <p className="max-w-sm text-sm text-[var(--text-secondary)]">
        รายการนี้อาจถูกลบหรือลิงก์ไม่ถูกต้อง
      </p>
      <Button asChild>
        <Link href="/dashboard">กลับหน้าหลัก</Link>
      </Button>
    </main>
  );
}
