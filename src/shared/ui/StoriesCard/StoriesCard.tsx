import styles from "./StoriesCard.module.scss";

export interface StoriesCardProps {
  title: string;
  imageUrl?: string;
  image?: boolean;
  className?: string;
  size?: "small" | "large";
  description?: string;
  date?: string;
  time?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const StoriesCard: React.FC<StoriesCardProps> = ({
  title,
  imageUrl,
  image = true,
  className = "",
  size = "small",
  description,
  date,
  time,
  backgroundColor,
  textColor,
}) => {
  const cardClasses = [
    styles.storiesCard,
    image ? "" : styles.noImage,
    className,
    size === "small" ? styles.small : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {image && imageUrl && (
        <img src={imageUrl} alt={title} className={styles.image} />
      )}
      <div
        className={styles.content}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        {(date || time) && (
          <div className={styles.infoWrapper}>
            {date && <div className={styles.infoText}>{date}</div>}
            {time && <div className={styles.infoText}>{time}</div>}
          </div>
        )}
        <div className={styles.contentWrapper}>
          <h3 className={styles.title} style={{ color: textColor }}>
            {title}
          </h3>
          <h3 className={styles.description} style={{ color: textColor }}>
            {description}
          </h3>
        </div>
      </div>
    </div>
  );
};
