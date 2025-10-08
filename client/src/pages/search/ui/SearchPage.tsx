import { EventCard } from "@/shared/ui";
import React, { useMemo } from "react";
import styles from "./SearchPage.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { parseDate } from "@shared/lib";

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const q = urlParams.get("q") || undefined;
  const cityId = urlParams.get("cityId") || undefined;
  const categoryId = urlParams.get("categoryId") || undefined;
  const dateStr = urlParams.get("date") || undefined; // expected dd.mm.yyyy

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", { q, cityId, categoryId, date: dateStr }],
    queryFn: () => {
      const params: Parameters<typeof userApi.getEvents>[0] = {};
      if (q) params.q = q;
      if (cityId) params.cityId = cityId;
      if (categoryId) params.categoryId = categoryId;
      if (dateStr) {
        const d = parseDate(dateStr);
        if (d) {
          const iso = d.toISOString().slice(0, 10);
          params.dateFrom = iso;
          params.dateTo = iso;
        }
      }
      return userApi.getEvents(params);
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.eventsContainer}>
        {isLoading
          ? null
          : events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                price={event.price}
                image={!!event.imageUrl}
                imageUrl={event.imageUrl}
                onButtonClick={() => {
                  navigate(`/event/${event.id}`);
                }}
                forSearch
              />
            ))}
      </div>
    </div>
  );
};
