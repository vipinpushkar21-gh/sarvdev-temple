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
    className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-5 cursor-pointer transition-colors border border-neutral-100 dark:border-neutral-800 hover:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
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
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">{titleNode ?? title}</h3>
      <div className="flex flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-300">
        {category && <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">{category}</span>}
        {language && <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">{language}</span>}
        {type && <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">{type}</span>}
      </div>
      {(descriptionNode ?? description) && (
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200 line-clamp-2">{descriptionNode ?? description}</p>
      )}
    </div>
  </motion.div>
);
