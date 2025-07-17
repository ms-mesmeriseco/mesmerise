import Link from "next/link";
import HeaderLarge from "@/components/layout/HeaderLarge";

export default function CollaborationPage() {
  return (
    <div className="flex flex-col gap-6 mt-[var(--global-margin-sm)]">
      <HeaderLarge text="Collaboration" />
      {/* Bottom Row */}

      <div className="flex h-[40vh]  gap-[var(--global-margin-sm)]">
        <div className="flex-1 border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <Link
            href="/collaboration/defined"
            className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex"
          >
            Defined
          </Link>
        </div>
        <div className="flex-1 border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <Link
            href="/collaboration/perpetual"
            className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex"
          >
            Perpetual
          </Link>
        </div>
      </div>
    </div>
  );
}
