import LeftHero from "@/components/cms-blocks/LeftHero";
import CROForm from "./CROForm";

export default function CROChecklistPage() {
  return (
    <LeftHero
      pageHeader="CRO Checklist"
      pageSubtitle="Free Conversion Rate Optimization Checklist"
      showCta={false}
      customContent={<CROForm />}
    />
  );
}
