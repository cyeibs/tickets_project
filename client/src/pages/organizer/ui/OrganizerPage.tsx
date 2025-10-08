import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./OrganizerPage.module.scss";
import { StarIcon, ReviewsIcon } from "@/shared/assets/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { EventCard } from "@/shared/ui";
import { useNavigate, useParams } from "react-router-dom";
import { StoriesWidget } from "@/widgets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { useAuth } from "@/features/auth";

const FALLBACK_IMAGE = "/avatars/1.webp";

export const OrganizerPage = () => {
  const { id: orgId } = useParams<{ id: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [canShowMore, setCanShowMore] = useState(false);
  const descriptionRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
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

  const { data: org } = useQuery({
    queryKey: ["organization", orgId],
    enabled: !!orgId,
    queryFn: () => userApi.getOrganization(orgId as string),
  });

  console.log("org", org);

  const { data: orgEvents = [] } = useQuery({
    queryKey: ["organization-events", orgId],
    enabled: !!orgId,
    queryFn: () => userApi.getOrganizationEvents(orgId as string),
  });

  const { data: orgStories = [] } = useQuery({
    queryKey: ["organization-stories", orgId],
    enabled: !!orgId,
    queryFn: () => userApi.getOrganizationStories(orgId as string),
  });

  // My subscriptions to determine current org subscription state
  const { data: mySubscriptions = [] } = useQuery({
    queryKey: ["mySubscriptions"],
    enabled: !!isAuthenticated,
    queryFn: () => userApi.getMySubscriptions(),
  });

  const subscribeMutation = useMutation({
    mutationFn: async (organizationId: string) =>
      userApi.subscribe(organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async (organizationId: string) =>
      userApi.unsubscribe(organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
    },
  });

  const roundedRating = useMemo(() => {
    if (org?.ratingAvg == null) return "—";
    return Number(org.ratingAvg).toFixed(1).replace(".", ",");
  }, [org?.ratingAvg]);

  const isSubscribed = useMemo(() => {
    if (!orgId) return false;
    return mySubscriptions.some((s) => s.organization.id === orgId);
  }, [mySubscriptions, orgId]);

  const companiesStories = useMemo(() => {
    if (!org) return [];
    return orgStories.map((s, idx) => ({
      id: idx + 1,
      name: org.name,
      avatarUrl: (s as any).posterUrl || org.avatarUrl || FALLBACK_IMAGE,
      stories: [
        {
          url: (s as any).posterUrl || org.avatarUrl || FALLBACK_IMAGE,
          duration: 4001,
          header: {
            heading: s.title,
            subheading: s.description || "",
            profileImage: org.avatarUrl || FALLBACK_IMAGE,
          },
        },
      ],
    }));
  }, [org, orgStories]);

  return (
    <div className={styles.container}>
      <div className={`${styles.eventContainer}`}>
        <SubscriptionCard
          title={org?.name || ""}
          imageUrl={org?.avatarUrl || FALLBACK_IMAGE}
          image={!!org?.avatarUrl}
          onBackClick={() => {
            navigate(-1);
            console.log("back");
          }}
          onHeartClick={() => {
            if (!orgId) return;
            if (!isAuthenticated) {
              navigate("/login");
              return;
            }
            if (isSubscribed) {
              unsubscribeMutation.mutate(orgId);
            } else {
              subscribeMutation.mutate(orgId);
            }
          }}
          isEventPage
          hideContent
          isHeart
          isSubscribed={isSubscribed}
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
            <span className={styles.descriptionTitle}>Об организаторе</span>
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

        {orgStories.length > 0 && (
          <div className={styles.storiesWrapper}>
            <StoriesWidget companies={companiesStories} />
          </div>
        )}

        {orgEvents.length > 0 && (
          <div className={styles.eventsWrapper}>
            <div className={styles.eventsTitle}>События</div>

            <div className={styles.eventsContainer}>
              {orgEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={event.date + ` в ${event.time}`}
                  location={event.location}
                  price={event.price}
                  image={!!event.imageUrl}
                  imageUrl={event.imageUrl}
                  onButtonClick={() => {
                    navigate(`/event/${event.id}`);
                  }}
                  forSearch
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
