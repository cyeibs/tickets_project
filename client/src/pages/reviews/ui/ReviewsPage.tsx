import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./ReviewsPage.module.scss";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui";
import { EventRatingModal } from "@/widgets/modals";

const actualEvents = {
  id: 3,
  title: "Путешествие в Оркестрбург: знакомство с ударными",
  date: "12 июня",
  time: "18:00",
  status: "В оплате",
  imageUrl: "/avatars/1.webp",
};

const reviewsData = [
  {
    id: 1,
    name: "Антонова Женя",
    text: "Слов нет, отличные ребята. Очень понравилось мероприятие, обязательно приду еще раз!",
    avatar: "/avatars/1.webp",
  },
  {
    id: 2,
    name: "Иванов Петр",
    text: "Прекрасная организация, все было на высшем уровне. Рекомендую всем! Прекрасная организация, все было на высшем уровне. Рекомендую всем!",
    avatar: "/avatars/2.avif",
  },
  {
    id: 3,
    name: "Смирнова Анна",
    text: "Интересное мероприятие, но можно было бы улучшить звук. В целом впечатления положительные. Интересное мероприятие, но можно было бы улучшить звук. В целом впечатления положительные.",
    avatar: "/avatars/1.webp",
  },
];

export const ReviewsPage = () => {
  const [isEventRatingModalOpen, setIsEventRatingModalOpen] = useState(false);

  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  const [canShowMoreById, setCanShowMoreById] = useState<
    Record<number, boolean>
  >({});
  const reviewRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  const toggleExpand = (id: number) => {
    setExpandedReviews((prev) =>
      prev.includes(id)
        ? prev.filter((reviewId) => reviewId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    const checkOverflow = () => {
      const nextState: Record<number, boolean> = {};
      for (const review of reviewsData) {
        const el = reviewRefs.current[review.id];
        if (!el) continue;
        if (expandedReviews.includes(review.id)) {
          nextState[review.id] = canShowMoreById[review.id] ?? false;
          continue;
        }
        nextState[review.id] = el.scrollHeight > el.clientHeight + 1;
      }
      setCanShowMoreById((prev) => ({ ...prev, ...nextState }));
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedReviews]);

  return (
    <div className={styles.container}>
      <EventRatingModal
        isOpen={isEventRatingModalOpen}
        onClose={() => setIsEventRatingModalOpen(false)}
      />
      <div className={`${styles.reviewsContainer}`}>
        <SubscriptionCard
          title={actualEvents.title}
          date={actualEvents.date}
          time={actualEvents.time}
          imageUrl={actualEvents.imageUrl}
          image={true}
          isHeart
          hideReviews
        />

        <div className={styles.reviews}>
          <div className={styles.reviewsWrapper}>
            <span className={styles.reviewsTitle}>Об организации</span>
            <span className={styles.reviewsValue}>321</span>
          </div>

          <div className={styles.reviewsList}>
            {reviewsData.map((review, index) => (
              <div key={review.id} className={styles.reviewItem}>
                {index > 0 && <div className={styles.reviewDivider} />}
                <div className={styles.reviewContent}>
                  <div className={styles.avatarContainer}>
                    <Avatar src={review.avatar} size={32} alt={review.name} />
                  </div>
                  <div className={styles.reviewTextContainer}>
                    <span className={styles.reviewName}>{review.name}</span>
                    <span
                      className={`${styles.reviewsText} ${
                        expandedReviews.includes(review.id)
                          ? styles.expanded
                          : styles.collapsed
                      }`}
                      ref={(el) => {
                        reviewRefs.current[review.id] = el;
                      }}
                    >
                      {review.text}
                    </span>
                    {(canShowMoreById[review.id] ||
                      expandedReviews.includes(review.id)) && (
                      <button
                        className={styles.showMoreButton}
                        onClick={() => toggleExpand(review.id)}
                        type="button"
                      >
                        {expandedReviews.includes(review.id)
                          ? "Скрыть"
                          : "Показать еще"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <div className={styles.actions}>
            <Button
              onClick={() => setIsEventRatingModalOpen(true)}
              className={styles.button}
            >
              Оставить отзыв
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
