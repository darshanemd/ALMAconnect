import React from 'react';
import { getInitials } from '../../utils/formatters';
import { CheckCircle2 } from 'lucide-react';
import './Avatar.css';

export default function Avatar({ 
  src, 
  name = 'User', 
  size = 'md', 
  role = 'default', 
  isVerified = false,
  onClick,
  className = ''
}) {
  const sizeClass = `size-${size}`;
  const roleClass = `role-${role}`;
  const clickableClass = onClick ? 'avatar-clickable' : '';

  return (
    <div 
      className={`avatar-container ${sizeClass} ${roleClass} ${clickableClass} ${className}`}
      onClick={onClick}
      title={name}
    >
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className="avatar-img" 
          onError={(e) => {
            // Fallback to text initials if image fails to load
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}

      {isVerified && size !== 'xs' && (
        <div className="avatar-verified-badge" title="Verified Member">
          <CheckCircle2 size={size === 'xl' ? 18 : size === 'lg' ? 14 : 10} />
        </div>
      )}
    </div>
  );
}
