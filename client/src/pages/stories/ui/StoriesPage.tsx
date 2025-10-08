import { Button, EventCard } from "@/shared/ui";
import styles from "./StoriesPage.module.scss";
import { StoriesCard } from "@/shared/ui/StoriesCard";
import { useNavigate } from "react-router-dom";

const events = [
  {
    id: 1,
    title: "Путешествие в Оркестрбург: знакомство с ударными",
    date: "12 июня в 12:00",
    location: "Парк 300-летия Петербурга",
    price: "от 1500₽",
    imageUrl: "/avatars/1.webp",
  },
  {
    id: 2,
    title: "Джазовый вечер в филармонии",
    date: "15 июня в 19:00",
    location: "Филармония им. Шостаковича",
    price: "от 2000₽",
    imageUrl: "/avatars/2.avif",
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
    imageUrl: "/avatars/2.avif",
  },
  {
    id: 5,
    title: "Выставка современного искусства",
    date: "25 июня в 10:00",
    location: "Эрарта",
    price: "от 700₽",
    imageUrl: "/avatars/1.webp",
  },
  {
    id: 6,
    title: "Выставка современного искусства",
    date: "25 июня в 10:00",
    location: "Эрарта",
    price: "от 700₽",
  },
];

export const StoriesPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.eventsContainer}>
        {events.map((event) => (
          <StoriesCard
            key={event.id}
            title={event.title}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
          />
        ))}
      </div>

      <div className={styles.actionsContainer}>
        <div className={styles.actions}>
          <Button
            accent
            onClick={() => {
              navigate("/story-create");
            }}
            className={styles.button}
          >
            Создать
          </Button>
        </div>
      </div>
    </div>
  );
};
