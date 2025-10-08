import { userApi } from "@/entities/user";
import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./SubscriptionsPage.module.scss";

export const SubscriptionsPage = () => {
  const queryClient = useQueryClient();

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
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
