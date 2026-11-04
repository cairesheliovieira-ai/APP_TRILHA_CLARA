import type { ReactNode, KeyboardEvent } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  role?: string;
  ariaLabel?: string;
}

export default function Card({
  children,
  onClick,
  className,
  role: roleProp,
  ariaLabel,
}: CardProps) {
  const isInteractive = typeof onClick === 'function';

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick!();
    }
  };

  return (
    <div
      className={`${styles.card} ${className ?? ''}`}
      role={roleProp ?? (isInteractive ? 'button' : undefined)}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
