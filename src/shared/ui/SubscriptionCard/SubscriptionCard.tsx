import { ArrowExport, Heart, StarIcon } from "@/shared/assets/icons";
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
  className?: string;
  status?: string;
  actionButton?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  date,
  time,
  imageUrl,
  image = true,
  onButtonClick,
  onIconClick,
  className = "",
  status,
  actionButton = true,
}) => {
  const cardClasses = [
    styles.subscriptionCard,
    image ? styles.withImage : styles.noImage,
    actionButton ? "" : styles.withoutActionButton,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {image && imageUrl && (
        <img src={imageUrl} alt={title} className={styles.image} />
      )}

      <div className={styles.statusesWrapper}>
        <div className={styles.statusLine}>
          <div className={styles.heartWrapper}>
            <IconButton
              icon={Heart}
              onClick={onIconClick}
              iconColor="#212C3A"
              variant="accent"
              iconSize={24}
              fill="#212C3A"
            />
          </div>
        </div>
      </div>

      <div className={styles.actionsWrapper}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
        </div>

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
      </div>
    </div>
  );
};
