import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./AboutCompanyPage.module.scss";
import { StarIcon, ReviewsIcon } from "@/shared/assets/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const AboutCompanyPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canShowMore, setCanShowMore] = useState(false);
  const descriptionRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const organizationId = user?.organizationId || null;

  const { data: org } = useQuery({
    queryKey: ["organization", organizationId],
    enabled: !!organizationId,
    queryFn: () => userApi.getOrganization(organizationId as string),
  });

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

  const roundedRating = useMemo(() => {
    if (org?.ratingAvg == null) return "—";
    return Number(org.ratingAvg).toFixed(1).replace(".", ",");
  }, [org?.ratingAvg]);

  return (
    <div className={styles.container}>
      <div className={`${styles.subscriptionsContainer}`}>
        <SubscriptionCard
          title={org?.name || ""}
          imageUrl={org?.avatarUrl}
          image={!!org?.avatarUrl}
          isEdit
          hideContent
          onButtonClick={() => navigate("/profile/about-company/edit")}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <span className={styles.infoText}>Рейтинг</span>
            <div className={styles.infoWrapper}>
              <StarIcon size={16} color="#BBBAFF" />
              <div className={styles.infoText}>{roundedRating}</div>
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
              <div className={styles.infoText}>{org?.reviewsCount ?? 0}</div>
            </div>
          </button>
        </div>
        {org?.description && (
          <div className={styles.description}>
            <span className={styles.descriptionTitle}>Об организации</span>
            <div className={styles.descriptionContent}>
              <span
                className={`${styles.descriptionText} ${
                  isExpanded ? styles.expanded : styles.collapsed
                }`}
                ref={descriptionRef}
              >
                {org?.description}
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
        )}
      </div>
    </div>
  );
};
