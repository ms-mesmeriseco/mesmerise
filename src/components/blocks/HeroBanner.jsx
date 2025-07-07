'use client';

import PropTypes from 'prop-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default function HeroBanner({ heroMedia, heroText, mediaHeight }) {
  const isVideo = heroMedia?.contentType?.includes('video');
  const heightClass = mediaHeight ? 'h-(--fh-m)' : 'h-[30vh]';

  return (
    <div className={`relative ${heightClass} overflow-hidden w-(--fw-m) rounded-(--radius-lrg) flex items-center justify-center`}>
      {heroMedia?.url && (
        isVideo ? (
          <video
            src={heroMedia.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={heroMedia.url}
            alt={heroMedia.title || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      )}

      <div className="relative z-10 text-white text-center max-w-2xl px-4">
        {heroText?.json && documentToReactComponents(heroText.json)}
      </div>

      <div className="absolute inset-0 bg-black/40 z-[5]" />
    </div>
  );
}
