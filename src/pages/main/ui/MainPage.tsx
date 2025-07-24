import { EventCard, Tab, TabGroup } from "@/shared/ui";
import { SwipeCards } from "@/widgets/events";
import type { EventCardType } from "@/widgets/events/ui/SwipeCards";
import { StoriesWidget } from "@widgets/stories";
import React, { useState } from "react";
import styles from "./MainPage.module.scss";
import { useNavigate } from "react-router-dom";

const events = [
  {
    id: 1,
    title: "Путешествие в Оркестрбург: знакомство с ударными",
    date: "12 июня в 12:00",
    location: "Парк 300-летия Петербурга",
    price: "от 1500₽",
    imageUrl: "./avatars/1.webp",
  },
  {
    id: 2,
    title: "Джазовый вечер в филармонии",
    date: "15 июня в 19:00",
    location: "Филармония им. Шостаковича",
    price: "от 2000₽",
    imageUrl: "./avatars/2.avif",
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
    imageUrl: "./avatars/2.avif",
  },
  {
    id: 5,
    title: "Выставка современного искусства",
    date: "25 июня в 10:00",
    location: "Эрарта",
    price: "от 700₽",
  },
];
export const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"poster" | "swiper">("poster");
  const navigate = useNavigate();
  // Sample event data (in a real app, this would come from an API)

  // Convert events to EventCardType for SwipeCards
  const eventCards: EventCardType[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    price: event.price,
    imageUrl: event.imageUrl,
  }));

  return (
    <div className={styles.container}>
      <div
        className={`${styles.storiesContainer} ${
          activeTab === "poster" ? styles.visible : styles.hidden
        }`}
      >
        <StoriesWidget />
      </div>

      <div className={styles.sectionBody}>
        <TabGroup title="События" className={styles.tabsContainer}>
          <Tab
            accent={activeTab === "poster"}
            onClick={() => setActiveTab("poster")}
          >
            Афишой
          </Tab>
          <Tab
            accent={activeTab === "swiper"}
            onClick={() => setActiveTab("swiper")}
          >
            Свайпер
          </Tab>
        </TabGroup>

        <div
          className={`${styles.eventsContainer} ${
            activeTab === "swiper" ? styles.swiperMode : ""
          }`}
        >
          {activeTab === "poster" ? (
            // Render 5 EventCard components when "poster" tab is active
            events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                price={event.price}
                imageUrl={event.imageUrl}
                image={!!event.imageUrl}
                onIconClick={() => {
                  navigate(`/about-company/1`);
                }}
                onButtonClick={() => {
                  navigate(`/event/1`);
                }}
              />
            ))
          ) : (
            // Render SwipeCards component when "swiper" tab is active
            <SwipeCards
              events={eventCards}
              onButtonClick={() => {
                navigate(`/event/1`);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
