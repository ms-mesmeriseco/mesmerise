'use client';

import PropTypes from 'prop-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default function HeroBanner({ heroMedia, heroText }) {
  const backgroundImageStyle = heroMedia?.url
    ? {
        backgroundImage: `url(${heroMedia.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '0.5rem',
      }
    : {};

  return (
    <div
      className="w-full h-[50vh] flex items-center justify-center"
      style={backgroundImageStyle}
    >
      <div className="max-w-2xl text-white text-center">
        {heroText?.json && documentToReactComponents(heroText.json)}
      </div>
    </div>
  );
}

HeroBanner.propTypes = {
  heroMedia: PropTypes.shape({
    url: PropTypes.string,
  }),
  heroText: PropTypes.shape({
    json: PropTypes.object,
  }),
};
