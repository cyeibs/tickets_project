import { userApi } from "@/entities/user";
import { useAuth } from "@/features/auth";
import { Button, EmptyState } from "@shared/ui";
import { StoriesCard } from "@shared/ui/StoriesCard";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./StoriesPage.module.scss";

export const StoriesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: orgStories = [] } = useQuery({
    queryKey: ["my-organization-stories", user?.organizationId],
    enabled: !!user?.organizationId,
    queryFn: () =>
      userApi.getOrganizationStories(user!.organizationId as string),
  });

  return (
    <div className={styles.container}>
      <div className={styles.eventsContainer}>
        {orgStories.length === 0 && <EmptyState text="Пока ничего нет" />}
        {orgStories.map((story) => (
          <StoriesCard
            key={story.id}
            title={story.title}
            imageUrl={story.posterUrl}
            image={!!story.posterUrl}
            backgroundColor={story.color}
            textColor={story.textColor}
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
