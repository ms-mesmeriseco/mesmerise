import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default function Connect() {
  return (
    <div className="flex flex-col min-h-screen gap-[var(--global-margin-lg)] p-[var(--global-margin-lg)]">
      <PageTitleLarge text="Connect" />

      {/* Middle Row */}
      <div className="flex w-full justify-between gap-[var(--global-margin-sm)]">
        {/* Form */}

        <div className="w-1/2 p-[var(--global-margin-xs)]">
          <h3>Send us a love letter</h3>
          <form className="space-y-4 w-full">
            <input
              type="text"
              placeholder="Name"
              className="w-full border-b-1 p-[var(--global-margin-sm)]"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border-b-1 p-[var(--global-margin-sm)]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border-b-1 p-[var(--global-margin-sm)]"
            />
            <textarea
              placeholder="Message"
              className="w-full border-b-1 p-[var(--global-margin-sm)] h-32"
            />

            <button
              type="submit"
              className="w-full bg-none rounded-md border-1 border-[var(--foreground)] duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)] py-2 font-normal"
            >
              <p>Submit</p>
            </button>
          </form>
        </div>

        {/* Empty right column for visual balance (optional) */}
        <div className="w-1/2"></div>
      </div>

      {/* Bottom Row */}
      <div className="flex h-[40vh]  gap-[var(--global-margin-sm)]">
        <div className="flex-1 border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Call
          </button>
        </div>
        <div className="flex-1  border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Email
          </button>
        </div>
      </div>
    </div>
  );
}
