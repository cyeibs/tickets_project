import React from 'react';
import { Button } from '@shared/ui/Button';
import { IconButton } from '@shared/ui/IconButton';
import styles from './EventCard.module.scss';
import {
  ArrowExport,
  CalendarIcon,
  CardIcon,
  Heart,
  LocationIcon,
} from '@/shared/assets/icons';

export interface EventCardProps {
  title: string;
  date?: string;
  location?: string;
  imageUrl?: string;
  short?: boolean;
  image?: boolean;
  forSearch?: boolean;
  onButtonClick?: () => void;
  onIconClick?: () => void;
  className?: string;
  price?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  imageUrl,
  short = false,
  image = true,
  forSearch = false,
  onButtonClick,
  onIconClick,
  className = '',
  price,
}) => {
  const cardClasses = [
    styles.eventCard,
    image ? styles.withImage : styles.noImage,
    !short ? styles.withMinHeight : '',
    forSearch ? styles.withSearch : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      {image && imageUrl && (
        <img src={imageUrl} alt={title} className={styles.image} />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        {!forSearch && (date || location || price) && (
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
      {!short && (
        <div className={styles.actionsWrapper}>
          {!forSearch && (
            <div className={styles.actionsLine}>
              <IconButton
                icon={
                  <img
                    src={'/avatars/1.webp'}
                    alt="avatar"
                    className={styles.avatar}
                  />
                }
                onClick={onIconClick}
                iconColor="#151515"
                iconSize={24}
              />
              <IconButton
                icon={Heart}
                onClick={onIconClick}
                iconColor="#151515"
                iconSize={24}
              />
            </div>
          )}
          <div className={styles.actions}>
            <Button accent onClick={onButtonClick} className={styles.button}>
              К событию
            </Button>
            {!forSearch && (
              <IconButton
                icon={ArrowExport}
                onClick={onIconClick}
                iconColor="#151515"
                iconSize={24}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
