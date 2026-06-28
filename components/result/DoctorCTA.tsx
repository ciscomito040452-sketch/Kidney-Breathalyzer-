import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DoctorCTA() {
  return (
    <Button className="w-full gap-2" asChild>
      <a href="tel:1669">
        <Stethoscope className="h-5 w-5" />
        พบแพทย์
      </a>
    </Button>
  );
}
