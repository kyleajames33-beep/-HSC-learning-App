import React from 'react';
import { getIcon, getIconString } from '../utils/iconMap.jsx';

const Icon = ({ 
  category, 
  name, 
  size = 16, 
  className = '', 
  type = 'component' // 'component' or 'emoji'
}) => {
  if (type === 'emoji') {
    return (
      <span className={`inline-block ${className}`} style={{ fontSize: size }}>
        {getIconString(category, name)}
      </span>
    );
  }

  return getIcon(category, name, size, className);
};

export default Icon;
