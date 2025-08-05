import { ArrowLeft, Edit, Heart } from "@/shared/assets/icons";
import { IconButton } from "@shared/ui/IconButton";
import styles from "./TicketCard.module.scss";
import { Avatar } from "../Avatar";

export interface TicketCardProps {
  title: string;
  date?: string;
  time?: string;
  location?: string;
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

export const TicketCard: React.FC<TicketCardProps> = ({
  title,
  date,
  time,
  location,
  imageUrl,
  image = true,
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

          <div className={styles.avatar}>
            <Avatar src={imageUrl} alt={title} />
          </div>
        </div>

        <div className={styles.ticketCard}>
          <svg
            width="100%"
            height="158px"
            viewBox="0 0 343 158"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.ticketSvg}
          >
            <title>ticket</title>
            <path
              d="M331 0C337.627 6.44258e-08 343 5.37258 343 12V88C336.709 88 331.55 92.8405 331.042 99H330.703C330.151 99 329.703 99.4477 329.703 100C329.703 100.552 330.151 101 330.703 101H331.042C331.55 107.159 336.709 112 343 112V146C343 152.627 337.627 158 331 158H12C5.37258 158 3.22139e-07 152.627 0 146V112C6.29064 112 11.4498 107.159 11.958 101H19.9219C20.4742 101 20.9219 100.552 20.9219 100C20.9219 99.4477 20.4742 99 19.9219 99H11.958C11.4498 92.8405 6.29064 88 0 88V12C3.22139e-07 5.37258 5.37258 6.44258e-08 12 0H331ZM27.8906 99C27.3383 99 26.8906 99.4477 26.8906 100C26.8906 100.552 27.3383 101 27.8906 101H35.8594C36.4117 101 36.8594 100.552 36.8594 100C36.8594 99.4477 36.4117 99 35.8594 99H27.8906ZM43.8281 99C43.2758 99 42.8281 99.4477 42.8281 100C42.8281 100.552 43.2758 101 43.8281 101H51.7969C52.3492 101 52.7969 100.552 52.7969 100C52.7969 99.4477 52.3492 99 51.7969 99H43.8281ZM59.7656 99C59.2133 99 58.7656 99.4477 58.7656 100C58.7656 100.552 59.2133 101 59.7656 101H67.7344L67.8369 100.995C68.341 100.944 68.7344 100.518 68.7344 100C68.7344 99.4823 68.341 99.0562 67.8369 99.0049L67.7344 99H59.7656ZM75.7031 99C75.1508 99 74.7031 99.4477 74.7031 100C74.7031 100.552 75.1508 101 75.7031 101H83.6719C84.2242 101 84.6719 100.552 84.6719 100C84.6719 99.4477 84.2242 99 83.6719 99H75.7031ZM91.6406 99C91.0883 99 90.6406 99.4477 90.6406 100C90.6406 100.552 91.0883 101 91.6406 101H99.6094L99.7119 100.995C100.216 100.944 100.609 100.518 100.609 100C100.609 99.4823 100.216 99.0562 99.7119 99.0049L99.6094 99H91.6406ZM107.578 99C107.026 99 106.578 99.4477 106.578 100C106.578 100.552 107.026 101 107.578 101H115.547C116.099 101 116.547 100.552 116.547 100C116.547 99.4477 116.099 99 115.547 99H107.578ZM123.516 99C122.963 99 122.516 99.4477 122.516 100C122.516 100.552 122.963 101 123.516 101H131.484C132.037 101 132.484 100.552 132.484 100C132.484 99.4477 132.037 99 131.484 99H123.516ZM139.453 99C138.901 99 138.453 99.4477 138.453 100C138.453 100.552 138.901 101 139.453 101H147.422L147.524 100.995C148.029 100.944 148.422 100.518 148.422 100C148.422 99.4823 148.029 99.0562 147.524 99.0049L147.422 99H139.453ZM155.391 99C154.838 99 154.391 99.4477 154.391 100C154.391 100.552 154.838 101 155.391 101H163.359C163.912 101 164.359 100.552 164.359 100C164.359 99.4477 163.912 99 163.359 99H155.391ZM171.328 99C170.776 99 170.328 99.4477 170.328 100C170.328 100.552 170.776 101 171.328 101H179.297C179.849 101 180.297 100.552 180.297 100C180.297 99.4477 179.849 99 179.297 99H171.328ZM187.266 99C186.713 99 186.266 99.4477 186.266 100C186.266 100.552 186.713 101 187.266 101H195.234C195.787 101 196.234 100.552 196.234 100C196.234 99.4477 195.787 99 195.234 99H187.266ZM203.203 99C202.651 99 202.203 99.4477 202.203 100C202.203 100.552 202.651 101 203.203 101H211.172C211.724 101 212.172 100.552 212.172 100C212.172 99.4477 211.724 99 211.172 99H203.203ZM219.141 99C218.588 99 218.141 99.4477 218.141 100C218.141 100.552 218.588 101 219.141 101H227.109C227.662 101 228.109 100.552 228.109 100C228.109 99.4477 227.662 99 227.109 99H219.141ZM235.078 99C234.526 99 234.078 99.4477 234.078 100C234.078 100.552 234.526 101 235.078 101H243.047L243.149 100.995C243.654 100.944 244.047 100.518 244.047 100C244.047 99.4823 243.654 99.0562 243.149 99.0049L243.047 99H235.078ZM251.016 99C250.463 99 250.016 99.4477 250.016 100C250.016 100.552 250.463 101 251.016 101H258.984L259.087 100.995C259.591 100.944 259.984 100.518 259.984 100C259.984 99.4823 259.591 99.0562 259.087 99.0049L258.984 99H251.016ZM266.953 99C266.401 99 265.953 99.4477 265.953 100C265.953 100.552 266.401 101 266.953 101H274.922C275.474 101 275.922 100.552 275.922 100C275.922 99.4477 275.474 99 274.922 99H266.953ZM282.891 99C282.338 99 281.891 99.4477 281.891 100C281.891 100.552 282.338 101 282.891 101H290.859C291.412 101 291.859 100.552 291.859 100C291.859 99.4477 291.412 99 290.859 99H282.891ZM298.828 99C298.276 99 297.828 99.4477 297.828 100C297.828 100.552 298.276 101 298.828 101H306.797L306.899 100.995C307.404 100.944 307.797 100.518 307.797 100C307.797 99.4823 307.404 99.0562 306.899 99.0049L306.797 99H298.828ZM314.766 99C314.213 99 313.766 99.4477 313.766 100C313.766 100.552 314.213 101 314.766 101H322.734C323.287 101 323.734 100.552 323.734 100C323.734 99.4477 323.287 99 322.734 99H314.766Z"
              fill="#AFF940"
            />
          </svg>
          <div className={styles.ticketInfo}>
            {date && (
              <div className={styles.ticketInfoItem}>
                <span className={styles.ticketInfoDate}>{date}</span>
              </div>
            )}
            {time && (
              <div className={styles.ticketInfoItem}>
                <span className={styles.ticketInfoTime}>{time}</span>
              </div>
            )}
            {location && (
              <div className={styles.ticketInfoItem}>
                <span className={styles.ticketInfoLocation}>{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
