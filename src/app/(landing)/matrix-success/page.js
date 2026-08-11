export default function SuccessPage() {
  return (
    <div className="px-[var(--global-margin-sm)] py-[var(--global-margin-lg)] text-center h-[50vh] items-center flex flex-col justify-center">
      <h1 className="text-3xl mb-4">Success</h1>
      <p className="mb-6">
        Your free Marketing Matrix is ready. Click below to access the Google
        Sheet:
      </p>

      <a
        href="https://docs.google.com/spreadsheets/d/1OAfVA_fEyzCvO0XT0pmJQS9FNNy_tk9tQSfQyR8ntDY/edit?gid=1037830427#gid=1037830427"
        target="_blank"
        className="w-sm bg-none rounded-2xl border-1 border-[var(--foreground)] duration-200 cursor-pointer text-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)] py-3 px-4 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get Instant Access
      </a>
    </div>
  );
}
