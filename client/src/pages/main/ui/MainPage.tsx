import { EventCard, Tab, TabGroup } from "@/shared/ui";
import { SwipeCards } from "@/widgets/events";
import type { EventCardType } from "@/widgets/events/ui/SwipeCards";
import { StoriesWidget } from "@widgets/stories";
import { useAuth } from "@features/auth";
import React, { useMemo, useState } from "react";
import styles from "./MainPage.module.scss";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"poster" | "swiper">("poster");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: () => userApi.getEvents(),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => userApi.getFavorites(),
    enabled: isAuthenticated,
  });

  const addFavorite = useMutation({
    mutationFn: (eventId: string) => userApi.addFavorite(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: (eventId: string) => userApi.removeFavorite(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // Convert events to EventCardType for SwipeCards
  const eventCards: EventCardType[] = useMemo(
    () =>
      (events ?? []).map((event) => ({
        id: Number.isFinite(Number(event.id)) ? Number(event.id) : Date.now(),
        uuid: String(event.id),
        title: event.title,
        date: event.date,
        location: event.location,
        price: event.price,
        imageUrl: event.imageUrl,
      })),
    [events]
  );

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
        <TabGroup key="tabs" title="События" className={styles.tabsContainer}>
          <Tab
            key="poster"
            accent={activeTab === "poster"}
            onClick={() => setActiveTab("poster")}
          >
            Афишой
          </Tab>
          <Tab
            key="swiper"
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
            // Render EventCard components when "poster" tab is active
            (events ?? []).map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                price={event.price}
                imageUrl={event.imageUrl}
                image={!!event.imageUrl}
                liked={favorites.includes(String(event.id))}
                onIconClick={() => {
                  navigate(`/organizer/${event.organization.id}`);
                }}
                onButtonClick={() => {
                  navigate(`/event/${event.id}`);
                }}
                onLikeClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  const id = String(event.id);
                  if (favorites.includes(id)) removeFavorite.mutate(id);
                  else addFavorite.mutate(id);
                }}
              />
            ))
          ) : (
            // Render SwipeCards component when "swiper" tab is active
            <SwipeCards
              events={eventCards}
              onPositiveSwipe={(id, uuid) => {
                if (!isAuthenticated) {
                  navigate("/login");
                  return;
                }
                addFavorite.mutate(uuid ?? String(id));
              }}
              onNegativeSwipe={(id, uuid) => {
                if (!isAuthenticated) {
                  navigate("/login");
                  return;
                }
                removeFavorite.mutate(uuid ?? String(id));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
