export default function SecondaryButton({ href = "#", children, className = "", ...props }) {
  return (
    <a
      href={href}
     
      {...props}
    >
        <button
         className={`inline-block border border-[var(--foreground)] text-[var(--foreground)] px-8 font-medium text-base h-[32px] rounded-full transition hover:bg-[var(--foreground)] hover:text-[var(--background)] ${className}`}>
            {children}
        </button>
  
    </a>
  );
}
