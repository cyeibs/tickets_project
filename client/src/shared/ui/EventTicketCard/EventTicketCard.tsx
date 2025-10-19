import { ArrowExport, Edit, Heart } from "@/shared/assets/icons";
import { Button } from "@shared/ui/Button";
import { IconButton } from "@shared/ui/IconButton";
import { Pills } from "@shared/ui/Pills";
import { TickCircleIcon } from "@shared/assets/icons";
import { toast } from "react-toastify";
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
  onClick?: () => void;
  className?: string;
  status?: string;
  actionButton?: boolean;
  isHeart?: boolean;
  isMyEvent?: boolean;
  liked?: boolean;
  isEdit?: boolean;
  onEditClick?: () => void;
  eventId?: string; // used to build export link
}

export const EventTicketCard: React.FC<EventTicketCardProps> = ({
  title,
  date,
  time,
  imageUrl,
  image = true,
  onButtonClick,
  onIconClick,
  onClick,
  className = "",
  status,
  actionButton = true,
  isHeart = true,
  isMyEvent = false,
  liked = true,
  isEdit = false,
  onEditClick,
  eventId,
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
    <div className={cardClasses} onClick={onClick}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  onIconClick?.();
                }}
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
            <Button
              accent
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick?.();
              }}
              className={styles.button}
            >
              Купить билет
            </Button>

            <IconButton
              icon={ArrowExport}
              onClick={(e) => {
                e.stopPropagation();
                const id = eventId;
                if (!id) {
                  onIconClick?.();
                  return;
                }
                const url = `https://t.me/ticketzhenyabot?startapp=${id}`;
                const doToast = () =>
                  toast(
                    <Pills
                      icon={TickCircleIcon}
                      primaryText="Ссылка на ивент скопирована"
                      iconColor="#AFF940"
                    />
                  );
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard
                    .writeText(url)
                    .then(() => doToast())
                    .catch(() => {
                      try {
                        const textArea = document.createElement("textarea");
                        textArea.value = url;
                        textArea.style.position = "fixed";
                        textArea.style.opacity = "0";
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textArea);
                        doToast();
                      } catch {}
                    });
                } else {
                  try {
                    const textArea = document.createElement("textarea");
                    textArea.value = url;
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    doToast();
                  } catch {}
                }
              }}
              iconColor="#151515"
              iconSize={24}
            />
          </div>
        )}
      </div>
    </div>
  );
};
