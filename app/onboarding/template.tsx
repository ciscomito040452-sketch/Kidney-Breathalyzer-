import { MotionPage } from "@/components/motion/MotionPage";

export default function OnboardingTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionPage>{children}</MotionPage>;
}
