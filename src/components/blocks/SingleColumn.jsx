'use client';

import PropTypes from 'prop-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default function SingleColumn({ richText, imageUrl }) {
   if (!richText) return null;

  return (
    <div className="prose max-w-none flex-col items-center">
      {documentToReactComponents(richText)}
      <img className="max-w-30" src={imageUrl} />
    </div>
  );
}

SingleColumn.propTypes = {
  richText: PropTypes.shape({
    json: PropTypes.object,
  }),
};
