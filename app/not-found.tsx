import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <EmptyState
        icon={FileQuestion}
        message="ไม่พบหน้าที่ต้องการ — รายการนี้อาจถูกลบหรือลิงก์ไม่ถูกต้อง"
        ctaLabel="กลับหน้าหลัก"
        ctaHref="/dashboard"
      />
    </main>
  );
}
