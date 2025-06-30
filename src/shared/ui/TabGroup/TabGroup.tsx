import type { FC, ReactNode } from 'react';
import styles from './TabGroup.module.scss';

export interface TabGroupProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const TabGroup: FC<TabGroupProps> = ({
  children,
  title,
  className = '',
}) => {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.tabGroup}>{children}</div>
    </div>
  );
};
