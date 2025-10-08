import React, { useState } from "react";
import styles from "./MyEventsPage.module.scss";
import { Button, EmptyState, Tab, TabGroup } from "@/shared/ui";
import { EventTicketCard } from "@/shared/ui/EventTicketCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const MyEventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "moderation" | "actual" | "completed" | "drafts"
  >("moderation");

  const { user } = useAuth();
  const organizationId = user?.organizationId || null;

  const { data: moderationEvents = [] } = useQuery({
    queryKey: ["organization-events", organizationId, "moderation"],
    enabled: !!organizationId,
    queryFn: () =>
      userApi.getOrganizationEvents(organizationId as string, {
        statusCode: "moderation",
      }),
  });

  const { data: publishedEvents = [] } = useQuery({
    queryKey: ["organization-events", organizationId, "published"],
    enabled: !!organizationId,
    queryFn: () =>
      userApi.getOrganizationEvents(organizationId as string, {
        statusCode: "published",
      }),
  });

  const { data: completedEvents = [] } = useQuery({
    queryKey: ["organization-events", organizationId, "completed"],
    enabled: !!organizationId,
    queryFn: () =>
      userApi.getOrganizationEvents(organizationId as string, {
        statusCode: "completed",
      }),
  });

  const { data: drafts = [] } = useQuery({
    queryKey: ["organization-drafts", organizationId],
    enabled: !!organizationId,
    queryFn: () => userApi.getOrganizationDrafts(organizationId as string),
  });

  const navigate = useNavigate();

  const renderEvents = () => {
    switch (activeTab) {
      case "moderation":
        if (moderationEvents.length === 0)
          return <EmptyState text="Пока ничего нет" />;
        return moderationEvents.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            isEdit={true}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
            isHeart={false}
            isMyEvent={true}
          />
        ));
      case "actual":
        if (publishedEvents.length === 0)
          return <EmptyState text="Пока ничего нет" />;
        return publishedEvents.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            isEdit={true}
            date={event.date}
            time={event.time}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
            isMyEvent={true}
            isHeart={false}
          />
        ));
      case "drafts":
        if (drafts.length === 0) return <EmptyState text="Пока ничего нет" />;
        return drafts.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
            isMyEvent={true}
            isEdit={true}
            isHeart={false}
          />
        ));
      case "completed":
        if (completedEvents.length === 0)
          return <EmptyState text="Пока ничего нет" />;
        return completedEvents.map((event) => (
          <EventTicketCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
            actionButton={false}
            isMyEvent={true}
            isHeart={false}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.tabsContainer}`}>
        <TabGroup>
          <Tab
            key="moderation"
            accent={activeTab === "moderation"}
            onClick={() => setActiveTab("moderation")}
          >
            Модерация
          </Tab>
          <Tab
            key="actual"
            accent={activeTab === "actual"}
            onClick={() => setActiveTab("actual")}
          >
            Активные
          </Tab>
          <Tab
            key="completed"
            accent={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          >
            Завершены
          </Tab>
          <Tab
            key="drafts"
            accent={activeTab === "drafts"}
            onClick={() => setActiveTab("drafts")}
          >
            Черновики
          </Tab>
        </TabGroup>
      </div>

      <div className={styles.eventsListContainer}>{renderEvents()}</div>

      <div className={styles.actionsContainer}>
        <div className={styles.actions}>
          <Button
            accent
            onClick={() => {
              navigate("/event-create");
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
