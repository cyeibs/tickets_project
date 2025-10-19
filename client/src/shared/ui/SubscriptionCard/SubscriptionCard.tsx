import {
  ArrowExport,
  ArrowLeft,
  Edit,
  Heart,
  ReviewsIcon,
  StarIcon,
} from "@/shared/assets/icons";
import { IconButton } from "@shared/ui/IconButton";
import React from "react";
import styles from "./SubscriptionCard.module.scss";
import { useNavigate } from "react-router-dom";

export interface SubscriptionCardProps {
  title: string;
  date?: string;
  time?: string;
  imageUrl?: string;
  image?: boolean;
  onButtonClick?: () => void;
  onHeartClick?: () => void;
  onBackClick?: () => void;
  onCardClick?: () => void;
  className?: string;
  status?: string;
  actionButton?: boolean;
  hideContent?: boolean;
  isEdit?: boolean;
  isHeart?: boolean;
  isSubscribed?: boolean;
  ratingAvg?: number | null;
  reviewsCount?: number;
  isEventPage?: boolean;
  hideReviews?: boolean;
  isExport?: boolean;
  isLiked?: boolean;
  onExportClick?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  imageUrl,
  image = true,
  onButtonClick,
  onHeartClick,
  onBackClick,
  onCardClick,
  className = "",
  actionButton = true,
  isEdit = false,
  isHeart = false,
  isSubscribed = false,
  hideContent = false,
  isEventPage = false,
  hideReviews = false,
  ratingAvg = null,
  reviewsCount,
  isExport = false,
  onExportClick,
  isLiked = false,
}) => {
  const navigate = useNavigate();
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
    <div className={cardClasses} onClick={onCardClick}>
      {image && imageUrl && (
        <img src={imageUrl} alt={title} className={styles.image} />
      )}

      {isEventPage && (
        <div className={styles.headerWrapper}>
          <div className={styles.backWrapper}>
            <IconButton
              icon={ArrowLeft}
              onClick={(e) => {
                e.stopPropagation();
                onBackClick?.();
              }}
              iconColor="#212C3A"
              iconSize={24}
              fill="#212C3A"
            />
          </div>
        </div>
      )}

      <div className={styles.statusesWrapper}>
        {isHeart && (
          <div className={styles.heartWrapper}>
            <IconButton
              icon={Heart}
              onClick={(e) => {
                e.stopPropagation();
                onHeartClick?.();
              }}
              iconColor={isSubscribed || isLiked ? "#212C3A" : "#151515"}
              variant={isSubscribed || isLiked ? "accent" : "basic"}
              iconSize={24}
              fill={isSubscribed || isLiked ? "#212C3A" : "none"}
            />
          </div>
        )}
        {isExport && (
          <div className={styles.exportWrapper}>
            <IconButton
              icon={ArrowExport}
              onClick={(e) => {
                e.stopPropagation();
                onExportClick?.();
              }}
              iconColor="#212C3A"
              // variant="accent"
              iconSize={24}
              fill="#212C3A"
            />
          </div>
        )}
        {isEdit && (
          <div className={styles.editWrapper}>
            <IconButton
              icon={Edit}
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick?.();
              }}
              iconColor="#212C3A"
              // variant="accent"
              iconSize={24}
              fill="#212C3A"
            />
          </div>
        )}
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
                <div className={styles.infoText}>
                  {ratingAvg != null
                    ? (Math.round((ratingAvg as number) * 10) / 10)
                        .toString()
                        .replace(".", ",")
                    : "—"}
                </div>
              </div>
            </div>
            {!hideReviews && (
              <button
                type="button"
                className={styles.content}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/profile/about-company/reviews");
                }}
                aria-label="Перейти к отзывам"
              >
                <span className={styles.infoText}>Отзывы</span>
                <div className={styles.infoWrapper}>
                  <ReviewsIcon size={16} color="#BBBAFF" />
                  <div className={styles.infoText}>{reviewsCount ?? 0}</div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
