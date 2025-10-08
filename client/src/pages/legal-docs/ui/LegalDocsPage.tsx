import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./LegalDocs.module.scss";
import { useAuth } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { useNavigate } from "react-router-dom";

export const LegalDocsPage = () => {
  const { user } = useAuth();
  const organizationId = user?.organizationId || null;
  const navigate = useNavigate();

  const { data: org } = useQuery({
    queryKey: ["organization", organizationId],
    enabled: !!organizationId,
    queryFn: () => userApi.getOrganization(organizationId as string),
  });

  return (
    <div className={styles.container}>
      <div className={`${styles.legalDocsContainer}`}>
        <SubscriptionCard
          title={org?.name || ""}
          imageUrl={org?.avatarUrl}
          image={!!org?.avatarUrl}
          isEdit
          hideContent
          onButtonClick={() => navigate("/profile/about-company/edit")}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <span className={styles.infoText}>ИНН</span>
            <div className={styles.infoText}>{org?.inn || "—"}</div>
          </div>
          <div className={styles.content}>
            <span className={styles.infoText}>КПП</span>
            <div className={styles.infoText}>{org?.kpp || "—"}</div>
          </div>
          <div className={styles.content}>
            <span className={styles.infoText}>ОГРН</span>
            <div className={styles.infoText}>{org?.ogrn || "—"}</div>
          </div>
          <div className={styles.content}>
            <span className={styles.infoText}>Лицензия</span>
            <div className={styles.infoText}>{org?.licence || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
