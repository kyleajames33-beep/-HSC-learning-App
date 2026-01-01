// Icon mapping for different categories
const iconMap = {
  biology: {
    module5: '🧬',
    module6: '🔬',
    module7: '🌿',
    module8: '🧬',
    genetics: '🧬',
    reproduction: '🌸',
    ecosystem: '🌿',
    mutation: '🔬'
  },
  chemistry: {
    module5: '⚗️',
    module6: '🧪',
    module7: '⚛️',
    module8: '🔥',
    atoms: '⚛️',
    molecules: '🧪',
    reactions: '⚗️'
  },
  physics: {
    module5: '⚡',
    module6: '🌌',
    module7: '💫',
    module8: '🔭'
  },
  default: '📚'
};

/**
 * Get icon string (emoji) for a category and name
 * @param {string} category - The category (biology, chemistry, physics)
 * @param {string} name - The icon name
 * @returns {string} The emoji icon
 */
export const getIconString = (category, name) => {
  const categoryIcons = iconMap[category];
  if (!categoryIcons) {
    return iconMap.default;
  }
  return categoryIcons[name] || iconMap.default;
};

/**
 * Get icon component
 * @param {string} category - The category
 * @param {string} name - The icon name
 * @param {number} size - The size in pixels
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} The icon component
 */
export const getIcon = (category, name, size = 16, className = '') => {
  const icon = getIconString(category, name);
  return (
    <span className={`inline-block ${className}`} style={{ fontSize: size }}>
      {icon}
    </span>
  );
};

export default {
  getIconString,
  getIcon
};
