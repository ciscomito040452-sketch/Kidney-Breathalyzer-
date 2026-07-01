import { MotionPushPage } from "@/components/motion/MotionPushPage";

export default function ResultTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionPushPage>{children}</MotionPushPage>;
}
