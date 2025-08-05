import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./ReviewsPage.module.scss";
import { useState } from "react";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui";
import { EventRatingModal } from "@/widgets/modals";

const actualEvents = {
  id: 3,
  title: "Путешествие в Оркестрбург: знакомство с ударными",
  date: "12 июня",
  time: "18:00",
  status: "В оплате",
  imageUrl: "/tickets_project/avatars/1.webp",
};

const reviewsData = [
  {
    id: 1,
    name: "Антонова Женя",
    text: "Слов нет, отличные ребята. Очень понравилось мероприятие, обязательно приду еще раз!",
    avatar: "/tickets_project/avatars/1.webp",
  },
  {
    id: 2,
    name: "Иванов Петр",
    text: "Прекрасная организация, все было на высшем уровне. Рекомендую всем! Прекрасная организация, все было на высшем уровне. Рекомендую всем!",
    avatar: "/tickets_project/avatars/2.avif",
  },
  {
    id: 3,
    name: "Смирнова Анна",
    text: "Интересное мероприятие, но можно было бы улучшить звук. В целом впечатления положительные. Интересное мероприятие, но можно было бы улучшить звук. В целом впечатления положительные.",
    avatar: "/tickets_project/avatars/1.webp",
  },
];

export const ReviewsPage = () => {
  const [isEventRatingModalOpen, setIsEventRatingModalOpen] = useState(false);

  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedReviews((prev) =>
      prev.includes(id)
        ? prev.filter((reviewId) => reviewId !== id)
        : [...prev, id]
    );
  };

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
                    >
                      {review.text}
                    </span>
                    {review.text.length > 100 && (
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
