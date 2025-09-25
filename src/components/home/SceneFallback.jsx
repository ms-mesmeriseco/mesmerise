"use client";

export default function SceneFallback({
  onEnable3D,
  showEnableButton = false,
}) {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <picture>
        <source srcSet="/fallback/scene-placeholder.webp" type="image/webp" />
        <img
          src="/fallback/scene-placeholder.gif"
          alt="Loading visual"
          className="h-full w-full object-cover rounded-xl border border-[var(--mesm-grey-dk)]"
          loading="eager"
          decoding="async"
        />
      </picture>

      {showEnableButton && onEnable3D && (
        <button
          onClick={onEnable3D}
          className="absolute bottom-4 right-4 px-3 py-2 rounded-lg border border-white/30 bg-black/50 backdrop-blur text-sm"
        >
          Enable 3D
        </button>
      )}
    </div>
  );
}
