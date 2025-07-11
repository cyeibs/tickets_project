import { EventCard, Header, Snackbar, SnackbarItem } from "@/shared/ui";
import type { SnackbarItemType } from "@/shared/ui/Snackbar/SnackbarItem";
import { useAuth } from "@features/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchPage.module.scss";

export const SearchPage: React.FC = () => {
  const [activeNavItem, setActiveNavItem] =
    useState<SnackbarItemType>("search");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavItemClick = (item: SnackbarItemType) => {
    setActiveNavItem(item);
    navigate(`/${item}`);
  };

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
      <Header
        showLogo
        showLeftButton={false}
        showRightButton={false}
        showSearchInput
        showFilterButton
      />

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

      <div className={styles.snackbarContainer}>
        <Snackbar>
          <SnackbarItem
            type="main"
            isActive={activeNavItem === "main"}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick("main")}
          />
          <SnackbarItem
            type="search"
            isActive={activeNavItem === "search"}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick("search")}
          />
          <SnackbarItem
            type="add"
            isActive={activeNavItem === "add"}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick("add")}
          />
          <SnackbarItem
            type="ticket"
            isActive={activeNavItem === "ticket"}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick("ticket")}
          />
          <SnackbarItem
            type="profile"
            isActive={activeNavItem === "profile"}
            activeItem={activeNavItem}
            onClick={() => {
              handleNavItemClick("profile");
              logout();
            }}
          />
        </Snackbar>
      </div>
    </div>
  );
};
