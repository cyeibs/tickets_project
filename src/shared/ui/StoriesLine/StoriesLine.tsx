import React, { useRef, useState, useEffect } from 'react';
import { Avatar } from '../Avatar';
import type { AvatarSize } from '../Avatar';
import styles from './StoriesLine.module.scss';

interface Story {
  id: string | number;
  imageUrl?: string;
  title?: string;
}

interface StoriesLineProps {
  title: string;
  stories: Story[];
  avatarSize?: AvatarSize;
  className?: string;
}

export const StoriesLine: React.FC<StoriesLineProps> = ({
  title,
  stories,
  avatarSize = 64,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h2 className={styles.title}>{title}</h2>
      <ul
        className={styles.scrollContainer}
        ref={scrollContainerRef}
        aria-label="Stories scrollable list"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {stories.map((story) => (
          <li key={story.id} className={styles.storyItem}>
            <Avatar size={avatarSize} src={story.imageUrl} />
            {story.title && <span>{story.title}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
