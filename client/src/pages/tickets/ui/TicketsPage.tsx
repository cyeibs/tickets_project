import React, { useMemo, useState } from "react";
import styles from "./TicketsPage.module.scss";
import { Tab, TabGroup } from "@/shared/ui";
import { EventTicketCard } from "@/shared/ui/EventTicketCard";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const TicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "favorites" | "actual" | "history"
  >("favorites");

  const queryClient = useQueryClient();
  const { data: favoriteEvents = [] } = useQuery({
    queryKey: ["favoriteEvents"],
    queryFn: () => userApi.getFavoriteEvents(),
  });
  const { data: favoriteIds = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => userApi.getFavorites(),
  });

  const { data: myPurchases = [] } = useQuery({
    queryKey: ["myPurchases"],
    queryFn: () => userApi.getMyPurchases(),
  });

  const removeFavorite = useMutation({
    mutationFn: (eventId: string) => userApi.removeFavorite(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteEvents"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const navigate = useNavigate();

  const { actualEvents, historyEvents } = useMemo(() => {
    const now = new Date();
    // Deduplicate purchases by eventId
    const deduped = Array.from(
      new Map(myPurchases.map((p) => [p.eventId, p])).values()
    );

    const upcoming: typeof myPurchases = [];
    const past: typeof myPurchases = [];

    for (const p of deduped) {
      const dateObj = new Date(p.raw.eventDate);
      const [hh, mm] = p.raw.startTime.split(":").map(Number);
      dateObj.setHours(hh || 0, mm || 0, 0, 0);
      if (dateObj.getTime() >= now.getTime()) {
        upcoming.push(p);
      } else {
        past.push(p);
      }
    }

    return { actualEvents: upcoming, historyEvents: past };
  }, [myPurchases]);

  const toggleFavorite = useMutation({
    mutationFn: async (eventId: string) => {
      const liked = favoriteIds.includes(eventId);
      if (liked) return userApi.removeFavorite(eventId);
      return userApi.addFavorite(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteEvents"] });
      queryClient.invalidateQueries({ queryKey: ["myPurchases"] });
    },
  });

  const renderEvents = () => {
    switch (activeTab) {
      case "favorites":
        return favoriteEvents.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            // status="Избранное"
            onButtonClick={() => {
              navigate(`/purchase/1`);
            }}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={true}
            isHeart
            liked
            onIconClick={() => removeFavorite.mutate(String(event.id))}
          />
        ));
      case "actual":
        return actualEvents.map((event) => (
          <EventTicketCard
            key={event.eventId}
            title={event.title}
            date={event.date}
            time={event.time}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
            isHeart
            liked={favoriteIds.includes(event.eventId)}
            onIconClick={() => toggleFavorite.mutate(String(event.eventId))}
          />
        ));
      case "history":
        return historyEvents.map((event) => (
          <EventTicketCard
            key={event.eventId}
            title={event.title}
            date={event.date}
            time={event.time}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
            isHeart
            liked={favoriteIds.includes(event.eventId)}
            onIconClick={() => toggleFavorite.mutate(String(event.eventId))}
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
