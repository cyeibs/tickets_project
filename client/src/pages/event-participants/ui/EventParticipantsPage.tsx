import { Avatar } from "@/shared/ui";
import styles from "./EventParticipantsPage.module.scss";

const participants = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: `participant-${i}`,
    imageUrl: "/avatars/1.webp",
    name: `Участник ${i + 1}`,
  }));

export const EventParticipantsPage = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.eventContainer}`}>
        <div className={styles.participants}>
          <div className={styles.participantsWrapper}>
            <span className={styles.participantsTitle}>Участники</span>
            <span className={styles.participantsValue}>20</span>
          </div>
          <div className={styles.participantsList}>
            {participants.map((participant) => (
              <div className={styles.participantItem} key={participant.id}>
                <Avatar size={48} src={participant.imageUrl} />
                <span className={styles.participantName}>
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
