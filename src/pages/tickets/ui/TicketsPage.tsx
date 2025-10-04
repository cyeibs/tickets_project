import React, { useState } from "react";
import styles from "./TicketsPage.module.scss";
import { Tab, TabGroup } from "@/shared/ui";
import { EventTicketCard } from "@/shared/ui/EventTicketCard";
import { useNavigate } from "react-router-dom";

export const TicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "favorites" | "actual" | "history"
  >("favorites");

  const favoriteEvents = [
    {
      id: 1,
      title: "Путешествие в Оркестрбург: знакомство с ударными",
      date: "12 июня",
      time: "18:00",
      status: "Избранное",
      imageUrl: "./avatars/1.webp",
    },
    {
      id: 2,
      title: "Джазовый вечер в филармонии",
      date: "15 июня",
      time: "19:30",
      status: "Избранное",
      imageUrl: "./avatars/2.avif",
    },
  ];

  const actualEvents = [
    {
      id: 3,
      title: "Путешествие в Оркестрбург: знакомство с ударными",
      date: "12 июня",
      time: "18:00",
      status: "В оплате",
      imageUrl: "./avatars/1.webp",
    },
    {
      id: 4,
      title: "Симфонический оркестр",
      date: "20 июня",
      time: "20:00",
      status: "Оплачено",
    },
  ];

  const historyEvents = [
    {
      id: 5,
      title: "Классическая музыка",
      date: "5 мая",
      time: "19:00",
      status: "Завершено",
      imageUrl: "./avatars/2.avif",
    },
    {
      id: 6,
      title: "Фортепианный концерт",
      date: "1 мая",
      time: "18:30",
      status: "Завершено",
    },
  ];

  const navigate = useNavigate();

  const renderEvents = () => {
    switch (activeTab) {
      case "favorites":
        return favoriteEvents.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            // status={event.status}
            onButtonClick={() => {
              navigate(`/purchase/1`);
            }}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={true}
          />
        ));
      case "actual":
        return actualEvents.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            // status={event.status}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
          />
        ));
      case "history":
        return historyEvents.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            // status={event.status}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.tabsContainer}`}>
        <TabGroup key="tabs">
          <Tab
            key="favorites"
            accent={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
          >
            Избранные
          </Tab>
          <Tab
            key="actual"
            accent={activeTab === "actual"}
            onClick={() => setActiveTab("actual")}
          >
            Актуальные
          </Tab>
          <Tab
            key="history"
            accent={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          >
            Прошедшие
          </Tab>
        </TabGroup>
      </div>

      <div className={styles.eventsListContainer}>{renderEvents()}</div>
    </div>
  );
};
