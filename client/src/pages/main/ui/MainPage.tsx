import { EventCard, Tab, TabGroup, Pills } from "@/shared/ui";
import { SwipeCards } from "@/widgets/events";
import type { EventCardType } from "@/widgets/events/ui/SwipeCards";
import { StoriesWidget } from "@widgets/stories";
import type { CompanyStories } from "@widgets/stories";
import { useAuth } from "@features/auth";
import React, { useMemo, useState } from "react";
import styles from "./MainPage.module.scss";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { toast } from "react-toastify";
import { TickCircleIcon } from "@/shared/assets/icons";

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

  // Subscriptions
  const { data: mySubscriptions = [] } = useQuery({
    queryKey: ["mySubscriptions"],
    enabled: isAuthenticated,
    queryFn: () => userApi.getMySubscriptions(),
  });

  // Determine organizations to fetch stories for
  const orgIds = useMemo(
    () =>
      isAuthenticated && mySubscriptions.length > 0
        ? mySubscriptions.map((s) => s.organization.id)
        : Array.from(new Set((events ?? []).map((e) => e.organization.id))),
    [isAuthenticated, mySubscriptions, events]
  );

  // Fetch stories per organization
  const storiesResults = useQueries({
    queries: orgIds.map((orgId) => ({
      queryKey: ["organization-stories", orgId],
      queryFn: () => userApi.getOrganizationStories(orgId),
      enabled: !!orgId,
    })),
  });

  // Optionally fetch org details when not subscribed (to get name/avatar)
  const orgDetailsResults = useQueries({
    queries:
      isAuthenticated && mySubscriptions.length > 0
        ? []
        : orgIds.map((orgId) => ({
            queryKey: ["organization", orgId],
            queryFn: () => userApi.getOrganization(orgId),
            enabled: !!orgId,
          })),
  });

  const companyStories: CompanyStories[] = useMemo(() => {
    return orgIds.map((orgId, index) => {
      // Resolve org meta
      const subOrg = mySubscriptions.find(
        (s) => s.organization.id === orgId
      )?.organization;
      const orgMeta = subOrg || orgDetailsResults[index]?.data;

      const name = orgMeta?.name || "Организация";
      const avatarUrl = orgMeta?.avatarUrl || "/avatars/1.webp";

      // Resolve stories data
      const stories = storiesResults[index]?.data || [];
      const mappedStories = stories.map((s) => ({
        url: s.posterUrl || avatarUrl,
        duration: 4001,
        header: {
          heading: s.title,
          subheading: s.description || "",
          profileImage: avatarUrl,
        },
      }));

      return {
        id: index + 1,
        name,
        avatarUrl,
        stories: mappedStories,
      } as CompanyStories;
    });
  }, [orgIds, mySubscriptions, storiesResults, orgDetailsResults]);

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
        <StoriesWidget companies={companyStories} />
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
                onExportClick={() => {
                  const url = `https://t.me/ticketzhenyabot?startapp=${event.id}`;
                  const doToast = () =>
                    toast(
                      <Pills
                        icon={TickCircleIcon}
                        primaryText="Ссылка на ивент скопирована"
                        iconColor="#AFF940"
                      />
                    );
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard
                      .writeText(url)
                      .then(() => doToast())
                      .catch(() => {
                        try {
                          const textArea = document.createElement("textarea");
                          textArea.value = url;
                          textArea.style.position = "fixed";
                          textArea.style.opacity = "0";
                          document.body.appendChild(textArea);
                          textArea.focus();
                          textArea.select();
                          document.execCommand("copy");
                          document.body.removeChild(textArea);
                          doToast();
                        } catch {}
                      });
                  } else {
                    try {
                      const textArea = document.createElement("textarea");
                      textArea.value = url;
                      textArea.style.position = "fixed";
                      textArea.style.opacity = "0";
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                      doToast();
                    } catch {}
                  }
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
