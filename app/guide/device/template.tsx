import { MotionPushPage } from "@/components/motion/MotionPushPage";

export default function DeviceGuideTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionPushPage>{children}</MotionPushPage>;
}
