"use client";

import { useRouter, usePathname } from "next/navigation";
import ToggleSwitch from "./ToggleSwitch";

export default function CollabToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const isDefined = pathname.includes("defined");
  const value = isDefined ? "Defined" : "Continuous";

  const handleChange = (option) => {
    if (option === "Defined") {
      router.push("/defined");
    } else {
      router.push("/continuous");
    }
  };

  return (
    <div className="w-full fixed bottom-4 left-0 flex justify-center">
      <ToggleSwitch
        options={["Defined", "Continuous"]}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
