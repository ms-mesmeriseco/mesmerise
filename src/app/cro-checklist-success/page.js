export default function SuccessPage() {
  return (
    <div className="px-[var(--global-margin-sm)] py-[var(--global-margin-lg)] text-center h-[50vh] items-center flex flex-col justify-center">
      <h1 className="text-3xl mb-4">Success</h1>
      <p className="mb-6">
        Your free CRO Checklist is ready. Click below to access the Google
        Sheet:
      </p>

      <a
        href="https://docs.google.com/spreadsheets/d/1_605Gnx63KYZawLi8kqJvQ-D95ZlsA4rlU1bG1q1Zz4/edit?gid=303701215#gid=303701215"
        target="_blank"
        className="w-sm bg-none rounded-2xl border-1 border-[var(--foreground)] duration-200 cursor-pointer text-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)] py-3 px-4 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get Instant Access
      </a>
    </div>
  );
}
