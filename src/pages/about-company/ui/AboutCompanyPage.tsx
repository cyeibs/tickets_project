import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./AboutCompanyPage.module.scss";
import { StarIcon, ReviewsIcon } from "@/shared/assets/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const actualEvents = {
  id: 3,
  title: "Путешествие в Оркестрбург: знакомство с ударными",
  date: "12 июня",
  time: "18:00",
  status: "В оплате",
  imageUrl: "/tickets_project/avatars/1.webp",
};

export const AboutCompanyPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canShowMore, setCanShowMore] = useState(false);
  const descriptionRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const checkOverflow = () => {
      const el = descriptionRef.current;
      if (!el) return;
      setCanShowMore(el.scrollHeight > el.clientHeight + 1);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.subscriptionsContainer}`}>
        <SubscriptionCard
          title={actualEvents.title}
          date={actualEvents.date}
          time={actualEvents.time}
          imageUrl={actualEvents.imageUrl}
          image={true}
          isEdit
          hideContent
        />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <span className={styles.infoText}>Рейтинг</span>
            <div className={styles.infoWrapper}>
              <StarIcon size={16} color="#BBBAFF" />
              <div className={styles.infoText}>4,8</div>
            </div>
          </div>
          <button
            type="button"
            className={styles.content}
            onClick={() => navigate("/profile/about-company/reviews")}
            aria-label="Перейти к отзывам"
          >
            <span className={styles.infoText}>Отзывы</span>
            <div className={styles.infoWrapper}>
              <ReviewsIcon size={16} color="#BBBAFF" />
              <div className={styles.infoText}>321</div>
            </div>
          </button>
        </div>
        <div className={styles.description}>
          <span className={styles.descriptionTitle}>Об организации</span>
          <div className={styles.descriptionContent}>
            <span
              className={`${styles.descriptionText} ${
                isExpanded ? styles.expanded : styles.collapsed
              }`}
              ref={descriptionRef}
            >
              Симфонический оркестр — это коллектив музыкантов, который
              исполняет симфонические произведения. Он состоит из солистов,
              струнных, духовых и ударных инструментов. Симфонический оркестр
              исполняет произведения разных эпох и наций.
            </span>
            {(canShowMore || isExpanded) && (
              <button
                className={styles.showMoreButton}
                onClick={toggleExpand}
                type="button"
              >
                {isExpanded ? "Скрыть" : "Показать еще"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
