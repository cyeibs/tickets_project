import { EventCard } from "@/shared/ui";
import React from "react";
import styles from "./SearchPage.module.scss";

export const SearchPage: React.FC = () => {
  // Sample event data (in a real app, this would come from an API)
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

  return (
    <div className={styles.container}>
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
            forSearch
          />
        ))}
      </div>
    </div>
  );
};
