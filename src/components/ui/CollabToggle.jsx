"use client";

import { useRouter, usePathname } from "next/navigation";

export default function CollabToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const isDefined = pathname.includes("defined");

  const handleToggle = () => {
    router.push(
      isDefined ? "/collaboration/perpetual" : "/collaboration/defined"
    );
  };

  return (
    <div className="flex justify-center w-full fixed bottom-4 left-0">
      <div
        className="bg-white border-1 border-[var(--foreground)] rounded-full p-2 shadow cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 px-4">
          <span
            className={`text-sm ${isDefined ? "font-bold" : "text-gray-400"}`}
          >
            Defined
          </span>
          <div className="w-10 h-5 bg-gray-300 rounded-full relative">
            <div
              className={`absolute top-0.5 ${
                isDefined ? "left-1" : "right-1"
              } w-4 h-4 bg-black rounded-full transition-all duration-200`}
            />
          </div>
          <span
            className={`text-sm ${!isDefined ? "font-bold" : "text-gray-400"}`}
          >
            Perpetual
          </span>
        </div>
      </div>
    </div>
  );
}
