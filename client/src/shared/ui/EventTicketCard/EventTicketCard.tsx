import { ArrowExport, Edit, Heart } from "@/shared/assets/icons";
import { Button } from "@shared/ui/Button";
import { IconButton } from "@shared/ui/IconButton";
import React from "react";
import styles from "./EventTicketCard.module.scss";

export interface EventTicketCardProps {
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
  isHeart?: boolean;
  isMyEvent?: boolean;
  liked?: boolean;
  isEdit?: boolean;
  onEditClick?: () => void;
}

export const EventTicketCard: React.FC<EventTicketCardProps> = ({
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
  isHeart = true,
  isMyEvent = false,
  liked = true,
  isEdit = false,
  onEditClick,
}) => {
  const cardClasses = [
    styles.eventTicketCard,
    image ? styles.withImage : styles.noImage,
    actionButton ? "" : styles.withoutActionButton,
    isMyEvent ? styles.myEvent : "",
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
          {status && <span className={styles.statusText}>{status}</span>}
          {isHeart && (
            <div className={styles.heartWrapper}>
              <IconButton
                icon={Heart}
                onClick={onIconClick}
                iconColor={liked ? "#212C3A" : "#151515"}
                variant={liked ? "accent" : "basic"}
                iconSize={24}
                fill={liked ? "#212C3A" : "none"}
              />
            </div>
          )}

          {isEdit && (
            <div className={styles.editWrapper}>
              <IconButton
                icon={Edit}
                onClick={onEditClick}
                iconColor="#212C3A"
                // variant="accent"
                iconSize={24}
                fill="#212C3A"
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionsWrapper}>
        <div className={styles.content}>
          <div className={styles.infoWrapper}>
            <span className={styles.infoText}>{date}</span>
            <span className={styles.infoText}>{time}</span>
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>

        {actionButton && (
          <div className={styles.actions}>
            <Button accent onClick={onButtonClick} className={styles.button}>
              Купить билет
            </Button>

            <IconButton
              icon={ArrowExport}
              onClick={onIconClick}
              iconColor="#151515"
              iconSize={24}
            />
          </div>
        )}
      </div>
    </div>
  );
};
