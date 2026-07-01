import { MotionPage } from "@/components/motion/MotionPage";

export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionPage>{children}</MotionPage>;
}
