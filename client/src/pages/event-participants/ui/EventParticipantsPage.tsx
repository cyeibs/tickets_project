import { Avatar } from "@/shared/ui";
import styles from "./EventParticipantsPage.module.scss";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const EventParticipantsPage = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const eventId = routeId ?? "";

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["event-purchases", eventId],
    enabled: !!eventId,
    queryFn: () => userApi.getEventPurchases(eventId, "paid"),
  });

  return (
    <div className={styles.container}>
      <div className={`${styles.eventContainer}`}>
        <div className={styles.participants}>
          <div className={styles.participantsWrapper}>
            <span className={styles.participantsTitle}>Участники</span>
            <span className={styles.participantsValue}>
              {isLoading ? "..." : purchases.length}
            </span>
          </div>
          <div className={styles.participantsList}>
            {!isLoading &&
              purchases.map((p, idx) => (
                <div className={styles.participantItem} key={p.user.id || idx}>
                  <Avatar
                    size={48}
                    src={p.user.avatarUrl || "/avatars/1.webp"}
                  />
                  <span className={styles.participantName}>{p.user.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
