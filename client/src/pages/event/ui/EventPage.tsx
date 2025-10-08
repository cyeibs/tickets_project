import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./EventPage.module.scss";
import { CalendarIcon, LocationIcon, TimeIcon } from "@/shared/assets/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Pills } from "@/shared/ui";
import { useNavigate, useParams } from "react-router-dom";
import { GoToIcon } from "@/shared/assets/icons/goTo";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { useAuth } from "@/features/auth/model/useAuth";

// Local fallbacks to keep UI stable before data loads
const FALLBACK_IMAGE = "/avatars/1.webp";

export const EventPage = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const eventId = routeId ?? "";
  const [isExpanded, setIsExpanded] = useState(false);
  const [canShowMore, setCanShowMore] = useState(false);
  const descriptionRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    enabled: !!eventId,
    queryFn: () => userApi.getEventById(eventId),
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ["event-purchases", eventId],
    enabled:
      !!eventId &&
      !!event &&
      isAuthenticated &&
      !!user &&
      user.isOrganizer &&
      user.organizationId === event.raw.organizationId,
    queryFn: () => userApi.getEventPurchases(eventId, "paid"),
  });

  const participants = useMemo(
    () =>
      purchases.map((p, i) => ({
        id: p.user.id || `participant-${i}`,
        imageUrl: p.user.avatarUrl || FALLBACK_IMAGE,
      })),
    [purchases]
  );

  const isOrganizerOfEvent = useMemo(() => {
    if (!user || !user.isOrganizer || !event) return false;
    return user.organizationId === event.raw.organizationId;
  }, [user, event]);
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
      <div className={`${styles.eventContainer}`}>
        <SubscriptionCard
          title={event?.title || ""}
          date={event?.date}
          time={event?.time}
          imageUrl={event?.imageUrl || FALLBACK_IMAGE}
          image={!!event?.imageUrl}
          isEdit={isOrganizerOfEvent}
          onBackClick={() => {
            navigate(-1);
            console.log("back");
          }}
          isEventPage
          hideContent
        />
        <div className={styles.eventContent}>
          <Pills
            avatar={{
              src: event?.organization.avatarUrl || FALLBACK_IMAGE,
              size: 32,
            }}
            primaryText={event?.organization.name || ""}
            secondaryText="Организатор"
            rightIcon={GoToIcon}
            iconColor="#AFF940"
            onClick={() => {
              if (event?.organization.id) {
                navigate(`/organizer/${event.organization.id}`);
              }
            }}
          />
        </div>
        <div className={styles.infoWrapper}>
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              <CalendarIcon size={24} color="#BBBAFF" />
              <span className={styles.infoText}>{event?.date}</span>
            </div>
            <div className={styles.content}>
              <TimeIcon size={24} color="#BBBAFF" />
              <span className={styles.infoText}>{event?.time}</span>
            </div>
          </div>
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              <LocationIcon size={24} color="#BBBAFF" />
              <span className={styles.infoText}>{event?.location}</span>
            </div>
          </div>
        </div>

        {isOrganizerOfEvent && (
          <div className={styles.statistics}>
            <span className={styles.statisticsTitle}>Статистика</span>
            <div className={styles.statisticsContent}>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsText}>Продаж</span>
                <span className={styles.statisticsValue}>
                  {purchases.length}
                </span>
              </div>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsText}>Комиссия</span>
                <span className={styles.statisticsValue}>
                  {Math.round(
                    purchases.reduce((sum, p) => sum + (p.serviceTax || 0), 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {isOrganizerOfEvent && (
          <div className={styles.participants}>
            <div className={styles.participantsWrapper}>
              <span className={styles.participantsTitle}>Участники</span>
              <span className={styles.participantsValue}>
                {participants.length}
              </span>
            </div>
            <div className={styles.participantsContent}>
              {participants.slice(0, 11).map((participant) => (
                <Avatar
                  key={participant.id}
                  size={48}
                  src={participant.imageUrl}
                />
              ))}
              {participants.length > 11 && (
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/event/${eventId}/participants`);
                  }}
                >
                  <Avatar
                    size={48}
                    backgroundColor="#BBBAFF"
                    count={participants.length - 11}
                  />
                </button>
              )}
            </div>
          </div>
        )}

        <div className={styles.description}>
          <span className={styles.descriptionTitle}>Описание</span>
          <div className={styles.descriptionContent}>
            <span
              className={`${styles.descriptionText} ${
                isExpanded ? styles.expanded : styles.collapsed
              }`}
              ref={descriptionRef}
            >
              {event?.description || ""}
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
