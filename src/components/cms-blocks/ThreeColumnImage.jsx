"use client";

import Image from "next/image";

export default function ThreeColumnBlock({
  textContentOne,
  textContentTwo,
  textContentThree,
  mediaCollection,
}) {
  const texts = [textContentOne, textContentTwo, textContentThree];
  const images = mediaCollection?.items || [];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-12">
      {texts.map((text, i) => (
        <div key={i} className="flex flex-col items-center text-left gap-4">
          {images[i] && (
            <Image
              src={images[i].url}
              alt={`Column ${i + 1} image`}
              width={images[i].width || 400}
              height={images[i].height || 300}
              className="rounded-xs object-cover w-full h-auto"
            />
          )}
          <h5 className="prose prose-lg w-full text-left">{text}</h5>
        </div>
      ))}
    </section>
  );
}
