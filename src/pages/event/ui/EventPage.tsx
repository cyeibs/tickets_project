import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./EventPage.module.scss";
import {
  StarIcon,
  ReviewsIcon,
  CalendarIcon,
  LocationIcon,
  TimeIcon,
} from "@/shared/assets/icons";
import { useState } from "react";
import { Avatar, Pills } from "@/shared/ui";
import { useNavigate } from "react-router-dom";

const actualEvents = {
  id: 1,
  title: "Путешествие в Оркестрбург: знакомство с ударными",
  date: "12 июня",
  time: "18:00",
  status: "В оплате",
  imageUrl: "/tickets_project/avatars/1.webp",
};

// Create an array of participants (20 total)
const participants = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: `participant-${i}`,
    imageUrl: actualEvents.imageUrl,
  }));

export const EventPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.eventContainer}`}>
        <SubscriptionCard
          title={actualEvents.title}
          date={actualEvents.date}
          time={actualEvents.time}
          imageUrl={actualEvents.imageUrl}
          image={true}
          isEdit
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
              src: actualEvents.imageUrl,
              size: 32,
            }}
            primaryText="Особняк Серебрякова"
            secondaryText="Организатор"
            rightIcon={LocationIcon}
          />
        </div>
        <div className={styles.infoWrapper}>
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              <CalendarIcon size={24} color="#BBBAFF" />
              <span className={styles.infoText}>12.07</span>
            </div>
            <div className={styles.content}>
              <TimeIcon size={24} color="#BBBAFF" />
              <span className={styles.infoText}>18:00</span>
            </div>
          </div>
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              <LocationIcon size={24} color="#BBBAFF" />
              <span className={styles.infoText}>Парк 300-летия Петербурга</span>
            </div>
          </div>
        </div>

        <div className={styles.statistics}>
          <span className={styles.statisticsTitle}>Статистика</span>
          <div className={styles.statisticsContent}>
            <div className={styles.statisticsItem}>
              <span className={styles.statisticsText}>Просмотров</span>
              <span className={styles.statisticsValue}>1240</span>
            </div>
            <div className={styles.statisticsItem}>
              <span className={styles.statisticsText}>Продаж</span>
              <span className={styles.statisticsValue}>124</span>
            </div>
            <div className={styles.statisticsItem}>
              <span className={styles.statisticsText}>Комиссия</span>
              <span className={styles.statisticsValue}>1400</span>
            </div>
          </div>
        </div>

        <div className={styles.participants}>
          <div className={styles.participantsWrapper}>
            <span className={styles.participantsTitle}>Участники</span>
            <span className={styles.participantsValue}>20</span>
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
                  navigate(`/event/${actualEvents.id}/participants`);
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

        <div className={styles.description}>
          <span className={styles.descriptionTitle}>Описание</span>
          <div className={styles.descriptionContent}>
            <span
              className={`${styles.descriptionText} ${
                isExpanded ? styles.expanded : styles.collapsed
              }`}
            >
              VK Fest — это музыка от известных исполнителей, встречи с
              блогерами, знания и лекции, спорт, мастер-классы, конкурсы и много
              активностей для всей семьи. В сообществе ВКонтакте vk.com/fest_msk
              (гиперссылкой) можно узнать больше о программе и других новостях.
              Программа уникальная для всех городов. Все развлечения входят в
              цену билета. Фестивальный мерч и еду на фудкорте можно будет
              купить отдельно.Покупая билет, вы соглашаетесь с правилами
              мероприятия –{" "}
              <a href="https://vkfest.ru/rules">https://vkfest.ru/rules</a>
            </span>
            <button
              className={styles.showMoreButton}
              onClick={toggleExpand}
              type="button"
            >
              {isExpanded ? "Скрыть" : "Показать еще"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
