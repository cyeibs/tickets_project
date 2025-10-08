import React, { useRef, useState, useEffect } from "react";
import { Avatar } from "../Avatar";
import type { AvatarSize } from "../Avatar";
import styles from "./StoriesLine.module.scss";

interface Story {
  id: string | number;
  imageUrl?: string;
  title?: string;
  name?: string;
}

interface StoriesLineProps {
  title: string;
  stories: Story[];
  avatarSize?: AvatarSize;
  className?: string;
  onStoryClick?: (index: number) => void;
}

export const StoriesLine: React.FC<StoriesLineProps> = ({
  title,
  stories,
  avatarSize = 64,
  className,
  onStoryClick,
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

  const handleStoryClick = (index: number) => {
    if (onStoryClick && !isDragging) {
      onStoryClick(index);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className={`${styles.container} ${className || ""}`}>
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
        {stories.map((story, index) => (
          <li key={story.id} className={styles.storyItem}>
            <button
              type="button"
              className={styles.storyButton}
              onClick={() => handleStoryClick(index)}
              aria-label={`View story ${
                story.name || story.title || index + 1
              }`}
            >
              <Avatar size={avatarSize} src={story.imageUrl} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
