import {
  ArrowExport,
  ArrowLeft,
  Edit,
  Heart,
  StarIcon,
} from "@/shared/assets/icons";
import { Button } from "@shared/ui/Button";
import { IconButton } from "@shared/ui/IconButton";
import React from "react";
import styles from "./SubscriptionCard.module.scss";

export interface SubscriptionCardProps {
  title: string;
  date?: string;
  time?: string;
  imageUrl?: string;
  image?: boolean;
  onButtonClick?: () => void;
  onIconClick?: () => void;
  onBackClick?: () => void;
  className?: string;
  status?: string;
  actionButton?: boolean;
  hideContent?: boolean;
  isEdit?: boolean;
  isHeart?: boolean;
  isEventPage?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  imageUrl,
  image = true,
  onButtonClick,
  onIconClick,
  onBackClick,
  className = "",
  actionButton = true,
  isEdit = false,
  isHeart = false,
  hideContent = false,
  isEventPage = false,
}) => {
  const cardClasses = [
    styles.subscriptionCard,
    image ? styles.withImage : styles.noImage,
    actionButton ? "" : styles.withoutActionButton,
    hideContent ? styles.hideContent : "",
    isEventPage ? styles.eventPage : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {image && imageUrl && (
        <img src={imageUrl} alt={title} className={styles.image} />
      )}

      {isEventPage && (
        <div className={styles.headerWrapper}>
          <div className={styles.backWrapper}>
            <IconButton
              icon={ArrowLeft}
              onClick={onBackClick}
              iconColor="#212C3A"
              iconSize={24}
              fill="#212C3A"
            />
          </div>
        </div>
      )}

      <div className={styles.statusesWrapper}>
        <div className={styles.heartWrapper}>
          {isHeart && (
            <IconButton
              icon={Heart}
              onClick={onIconClick}
              iconColor="#212C3A"
              variant="accent"
              iconSize={24}
              fill="#212C3A"
            />
          )}
          {isEdit && (
            <IconButton
              icon={Edit}
              onClick={onIconClick}
              iconColor="#212C3A"
              // variant="accent"
              iconSize={24}
              fill="#212C3A"
            />
          )}
        </div>
      </div>

      <div className={styles.actionsWrapper}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        {!hideContent && (
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              <span className={styles.infoText}>Рейтинг</span>
              <div className={styles.infoWrapper}>
                <StarIcon size={16} color="#BBBAFF" />
                <div className={styles.infoText}>4,8</div>
              </div>
            </div>
            <div className={styles.content}>
              <span className={styles.infoText}>Отзывы</span>
              <div className={styles.infoWrapper}>
                <StarIcon size={16} color="#BBBAFF" />
                <div className={styles.infoText}>321</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
