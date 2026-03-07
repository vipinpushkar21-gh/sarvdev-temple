import React from 'react';

export type DevotionalCardProps = {
  title: string;
  titleNode?: React.ReactNode;
  category?: string;
  language?: string;
  type?: string;
  deity?: string;
  description?: string;
  descriptionNode?: React.ReactNode;
  hasAudio?: boolean;
  isFeatured?: boolean;
  onClick?: () => void;
};

/**
 * 2026 Devotional Card — gradient accent on hover, deity chip,
 * audio indicator, clean typography, smooth lift animation.
 */
export const DevotionalCard: React.FC<DevotionalCardProps> = ({
  title,
  titleNode,
  category,
  language,
  type,
  deity,
  description,
  descriptionNode,
  hasAudio,
  isFeatured,
  onClick,
}) => (
  <div
    className="devotional-card-2026 p-5 cursor-pointer group"
    tabIndex={0}
    aria-label={title}
    onClick={onClick}
    role="button"
  >
    <div className="flex flex-col gap-2.5">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-h4 font-serif text-secondary-700 group-hover:text-primary-700 transition-colors duration-200 leading-snug">
          {titleNode ?? title}
        </h3>
        {hasAudio && (
          <span className="flex-shrink-0 mt-1" title="Audio available">
            <span className="audio-dot" />
          </span>
        )}
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {category && (
          <span className="badge badge-primary text-[11px]">
            {category}
          </span>
        )}
        {deity && (
          <span className="badge text-[11px]">
            {deity}
          </span>
        )}
        {language && (
          <span className="badge text-[11px]">
            {language}
          </span>
        )}
        {type && (
          <span className="badge text-[11px]">
            {type}
          </span>
        )}
        {isFeatured && (
          <span className="badge-trending text-[10px]">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Featured
          </span>
        )}
      </div>

      {/* Description */}
      {(descriptionNode ?? description) && (
        <p className="text-body-sm text-ink-muted line-clamp-2 leading-relaxed">
          {descriptionNode ?? description}
        </p>
      )}
    </div>
  </div>
);
