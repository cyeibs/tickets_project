import { userApi } from "@/entities/user";
import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import { EmptyState } from "@/shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./SubscriptionsPage.module.scss";

export const SubscriptionsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: () => userApi.getMySubscriptions(),
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async (organizationId: string) =>
      userApi.unsubscribe(organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
    },
  });

  return (
    <div className={styles.container}>
      <div className={`${styles.subscriptionsContainer}`}>
        {isLoading && null}
        {!isLoading && (!subscriptions || subscriptions.length === 0) && (
          <EmptyState text="Пока ничего нет" />
        )}
        {subscriptions?.map((s) => (
          <SubscriptionCard
            key={s.id}
            title={s.organization.name}
            imageUrl={s.organization.avatarUrl}
            image={!!s.organization.avatarUrl}
            isHeart
            isSubscribed
            ratingAvg={s.organization.ratingAvg ?? null}
            reviewsCount={s.organization.reviewsCount}
            onHeartClick={() => unsubscribeMutation.mutate(s.organization.id)}
            onCardClick={() => navigate(`/organizer/${s.organization.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
