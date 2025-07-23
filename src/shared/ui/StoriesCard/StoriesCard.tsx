import React from "react";
import styles from "./StoriesCard.module.scss";

export interface StoriesCardProps {
  title: string;
  imageUrl?: string;
  image?: boolean;
  className?: string;
}

export const StoriesCard: React.FC<StoriesCardProps> = ({
  title,
  imageUrl,
  image = true,
  className = "",
}) => {
  const cardClasses = [
    styles.storiesCard,
    image ? "" : styles.noImage,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {image && imageUrl && (
        <img src={imageUrl} alt={title} className={styles.image} />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
};
