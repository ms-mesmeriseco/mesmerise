export default function PrimaryButton({ href = "#", children, className = "", ...props }) {
  return (
    <a
      href={href}
      
      {...props}
    >
        <button className={`inline-block w-fit bg-[var(--foreground)] text-[var(--background)] px-8 font-medium text-base h-[32px] rounded-full transition hover:opacity-90 ${className}`}>
            {children}
        </button>
 
    </a>
  );
}
