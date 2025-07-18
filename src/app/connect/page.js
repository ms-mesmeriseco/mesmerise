export default function Connect() {
  return (
    <div className="flex flex-col min-h-screen gap-[var(--global-margin)]">
      {/* Top Row */}
      <div className="flex justify-start items-end h-[40vh] border-b-1 border-black">
        <h1 className="text-9xl font-normal">Connect</h1>
      </div>

      {/* Middle Row */}
<div className="flex w-full justify-between gap-[var(--global-margin)]">
  {/* Form */}
  
  <div className="w-1/2 p-[var(--global-margin)]">
  <h3>Send us a love letter</h3>
    <form className="space-y-4 w-full">
      <input
        type="text"
        placeholder="Name"
        className="w-full border-b-1 p-[var(--global-margin)]"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full border-b-1 p-[var(--global-margin)]"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border-b-1 p-[var(--global-margin)]"
      />
      <textarea
        placeholder="Message"
        className="w-full border-b-1 p-[var(--global-margin)] h-32"
      />
      
      <button
        type="submit"
        className="w-full bg-none rounded-full border-1 border-[var(--foreground)] duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)] py-2 font-normal"
      >
        Submit
      </button>
    </form>
  </div>

  {/* Empty right column for visual balance (optional) */}
  <div className="w-1/2"></div>
</div>


      {/* Bottom Row */}
      <div className="flex h-[40vh]  gap-[var(--global-margin)]">
        <div className="flex-1 border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin)] flex-start flex">
            Call
          </button>
        </div>
        <div className="flex-1  border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin)] flex-start flex">
            Email
          </button>
        </div>
      </div>
    </div>
  );
}
