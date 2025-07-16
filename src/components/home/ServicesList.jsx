export default function ServicesList() {
  const services = [
    "Digital marketing",
    "Growth Architecture",
    "Positioning",
    "Brand strategy",
    "Design",
    "Full-Stack Web Development",
    "UI / UX",
  ];

  return (
    <section
      data-marker="services"
      className="min-h-screen flex flex-col justify-center"
    >
      <ul className="space-y-8">
        {services.map((s, idx) => (
          <li
            key={idx}
            className="border-b border-current pb-2 text-4xl md:text-6xl font-medium
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
