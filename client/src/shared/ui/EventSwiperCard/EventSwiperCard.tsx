import { CalendarIcon, CardIcon, LocationIcon } from "@/shared/assets/icons";
import { Button } from "@shared/ui/Button";
import React from "react";
import styles from "./EventSwiperCard.module.scss";

export interface EventSwiperCardProps {
  title: string;
  date?: string;
  location?: string;
  imageUrl?: string;
  image?: boolean;
  onButtonClick?: () => void;
  onIconClick?: () => void;
  className?: string;
  price?: string;
  isFront?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export const EventSwiperCard: React.FC<EventSwiperCardProps> = ({
  title,
  date,
  location,
  imageUrl,
  image = true,
  onButtonClick,
  className = "",
  price,
  isFront,
  backgroundColor,
  textColor,
}) => {
  const cardClasses = [
    styles.eventCard,
    image ? styles.withImage : styles.noImage,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {image && imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className={styles.image}
          draggable="false"
          style={{ pointerEvents: "none" }}
        />
      )}
      <div
        className={styles.content}
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <h3 className={styles.title} style={{ color: textColor }}>
          {title}
        </h3>

        {(date || location || price) && (
          <div className={styles.info}>
            {date && (
              <span className={styles.infoWrapper}>
                <CalendarIcon size={16} color={textColor} />
                <span className={styles.infoText} style={{ color: textColor }}>
                  {date}
                </span>
              </span>
            )}
            {location && (
              <span className={styles.infoWrapper}>
                <LocationIcon size={16} color={textColor} />
                <span className={styles.infoText} style={{ color: textColor }}>
                  {location}
                </span>
              </span>
            )}
            {price && (
              <span className={styles.infoWrapper}>
                <CardIcon size={16} color={textColor} />
                <span className={styles.infoText} style={{ color: textColor }}>
                  {price}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
      {isFront && (
        <div className={styles.actionsWrapper}>
          <div className={styles.actions}>
            <Button accent onClick={onButtonClick} className={styles.button}>
              К событию
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
