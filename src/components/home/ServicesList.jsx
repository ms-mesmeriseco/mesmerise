export default function ServicesList() {
  const services = [
    "Branding & Strategy",
    "Website",
    "Growth Marketing",
    "Business Consulting & Development",
  ];

  return (
    <section
      data-marker="capabilities"
      className="min-h-screen flex flex-col justify-center"
    >
      <ul className="space-y-8">
        {services.map((s, idx) => (
          <li
            key={idx}
            className="border-b border-current px-[var(--global-margin-lg)] py-[var(--global-margin-sm)] text-4xl md:text-6xl font-medium
                       transition-all duration-200 ease-in-out
                       opacity-30 hover:opacity-100 hover:translate-x-4"
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
