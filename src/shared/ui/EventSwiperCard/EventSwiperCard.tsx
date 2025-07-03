import React from 'react';
import { Button } from '@shared/ui/Button';
import { IconButton } from '@shared/ui/IconButton';
import styles from './EventSwiperCard.module.scss';
import {
  ArrowExport,
  CalendarIcon,
  CardIcon,
  Heart,
  LocationIcon,
} from '@/shared/assets/icons';

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
}

export const EventSwiperCard: React.FC<EventSwiperCardProps> = ({
  title,
  date,
  location,
  imageUrl,
  image = true,
  onButtonClick,
  className = '',
  price,
  isFront,
}) => {
  const cardClasses = [
    styles.eventCard,
    image ? styles.withImage : styles.noImage,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      {image && imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className={styles.image}
          draggable="false"
          style={{ pointerEvents: 'none' }}
        />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        {(date || location || price) && (
          <div className={styles.info}>
            {date && (
              <span className={styles.infoWrapper}>
                <CalendarIcon size={16} color="#212C3A" />
                <span className={styles.infoText}>{date}</span>
              </span>
            )}
            {location && (
              <span className={styles.infoWrapper}>
                <LocationIcon size={16} color="#212C3A" />
                <span className={styles.infoText}>{location}</span>
              </span>
            )}
            {price && (
              <span className={styles.infoWrapper}>
                <CardIcon size={16} color="#212C3A" />
                <span className={styles.infoText}>{price}</span>
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
