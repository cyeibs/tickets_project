import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./OrganizerPage.module.scss";
import { StarIcon, ReviewsIcon } from "@/shared/assets/icons";
import { useEffect, useRef, useState } from "react";
import { EventCard } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { StoriesWidget } from "@/widgets";

const actualEvents = {
  id: 1,
  title: "Путешествие в Оркестрбург: знакомство с ударными",
  date: "12 июня",
  time: "18:00",
  status: "В оплате",
  imageUrl: "/tickets_project/avatars/1.webp",
};

const events = [
  {
    id: 1,
    title: "Путешествие в Оркестрбург: знакомство с ударными",
    date: "12 июня в 12:00",
    location: "Парк 300-летия Петербурга",
    price: "от 1500₽",
    imageUrl: "/tickets_project/avatars/1.webp",
  },
  {
    id: 2,
    title: "Джазовый вечер в филармонии",
    date: "15 июня в 19:00",
    location: "Филармония им. Шостаковича",
    price: "от 2000₽",
    imageUrl: "/tickets_project/avatars/2.avif",
  },
  {
    id: 3,
    title: "Мастер-класс по живописи",
    date: "18 июня в 15:00",
    location: "Творческая студия «Палитра»",
    price: "от 1200₽",
  },
  {
    id: 4,
    title: "Фестиваль уличной еды",
    date: "20 июня в 12:00",
    location: "Новая Голландия",
    price: "Вход свободный",
    imageUrl: "/tickets_project/avatars/2.avif",
  },
  {
    id: 5,
    title: "Выставка современного искусства",
    date: "25 июня в 10:00",
    location: "Эрарта",
    price: "от 700₽",
    imageUrl: "/tickets_project/avatars/1.webp",
  },
  {
    id: 6,
    title: "Выставка современного искусства",
    date: "25 июня в 10:00",
    location: "Эрарта",
    price: "от 700₽",
  },
];

export const OrganizerPage = () => {
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
          <span className={styles.descriptionTitle}>Об организаторе</span>
          <div className={styles.descriptionContent}>
            <span
              className={`${styles.descriptionText} ${
                isExpanded ? styles.expanded : styles.collapsed
              }`}
              ref={descriptionRef}
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

        <div className={styles.storiesWrapper}>
          <StoriesWidget />
        </div>

        <div className={styles.eventsWrapper}>
          <div className={styles.eventsTitle}>События</div>

          <div className={styles.eventsContainer}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                price={event.price}
                image={!!event.imageUrl}
                imageUrl={event.imageUrl}
                onButtonClick={() => {
                  navigate(`/event/1`);
                }}
                forSearch
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
