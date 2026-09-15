import React from 'react';
import { SearchX } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({
  title = "No results found",
  description = "We couldn't find anything matching your search criteria. Try adjusting your filters.",
  icon: Icon = SearchX,
  actionLabel,
  onAction
}) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon-wrapper">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
