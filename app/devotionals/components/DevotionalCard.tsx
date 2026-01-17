import { motion } from 'framer-motion';
import React from 'react';

export type DevotionalCardProps = {
  title: string;
  titleNode?: React.ReactNode;
  category?: string;
  language?: string;
  type?: string;
  description?: string;
  descriptionNode?: React.ReactNode;
  onClick?: () => void;
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
};

export const DevotionalCard: React.FC<DevotionalCardProps> = ({
  title,
  titleNode,
  category,
  language,
  type,
  description,
  descriptionNode,
  onClick,
}) => (
  <motion.div
    className="bg-background rounded-xl shadow-md p-5 cursor-pointer transition-colors border border-accent hover:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    variants={cardVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
    tabIndex={0}
    aria-label={title}
    onClick={onClick}
    role="button"
  >
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-primary mb-1">{titleNode ?? title}</h3>
      <div className="flex flex-wrap gap-2 text-xs text-text">
        {category && <span className="px-2 py-0.5 bg-accent rounded-full text-text">{category}</span>}
        {language && <span className="px-2 py-0.5 bg-accent rounded-full text-text">{language}</span>}
        {type && <span className="px-2 py-0.5 bg-accent rounded-full text-text">{type}</span>}
      </div>
      {(descriptionNode ?? description) && (
        <p className="mt-2 text-sm text-text line-clamp-2">{descriptionNode ?? description}</p>
      )}
    </div>
  </motion.div>
);
