import { Edit, StarIcon } from "@/shared/assets/icons";
import { Avatar, Button, IconButton, Tab, TabGroup } from "@/shared/ui";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./Profile.module.scss";
import { Link } from "@/shared/ui/Link";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { SupportModal } from "@/widgets/modals";
import { userApi } from "@/entities/user";

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"user" | "manager">(() => {
    // Get the saved tab from localStorage or default to "user"
    return (
      (localStorage.getItem("profileActiveTab") as "user" | "manager") || "user"
    );
  });

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("profileActiveTab", activeTab);
  }, [activeTab]);

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const isOrganizer = !!user?.isOrganizer;
  const hasOrganizerApplication =
    user?.organizerApplicationStatus === "pending" ||
    user?.organizerApplicationStatus === "approved";
  const displayName = user?.name ?? "";
  const avatarSrc = user?.avatar ?? undefined;

  const [organization, setOrganization] = useState<{
    id: string;
    name: string;
    avatarUrl?: string;
    description?: string;
    ratingAvg?: number | null;
  } | null>(null);

  useEffect(() => {
    if (activeTab === "manager" && isOrganizer && user?.organizationId) {
      userApi
        .getOrganization(user.organizationId)
        .then(setOrganization)
        .catch(() => setOrganization(null));
    }
  }, [activeTab, isOrganizer, user?.organizationId]);

  const userLinks = [
    {
      id: "subscriptions",
      text: "Подписки",
      onClick: () => navigate("/profile/subscriptions"),
    },
    ...(!isOrganizer && !hasOrganizerApplication
      ? [
          {
            id: "become-organizer",
            text: "Стать организатором",
            onClick: () => navigate("/profile/get-rights"),
          } as const,
        ]
      : []),
    {
      id: "user-support",
      text: "Служба поддержки",
      onClick: () => setIsSupportModalOpen(true),
    },
    {
      id: "logout",
      text: "Выйти",
      onClick: () => {
        logout();
        navigate("/main");
      },
    },
  ];

  const managerLinks = [
    {
      id: "my-events",
      text: "Мои события",
      onClick: () => navigate("/profile/my-events"),
    },
    {
      id: "stories",
      text: "Сторисы",
      onClick: () => navigate("/profile/my-stories"),
    },
    {
      id: "about-org",
      text: "Об организации",
      onClick: () => navigate("/profile/about-company"),
    },
    {
      id: "legal-docs",
      text: "Юридические документы",
      onClick: () => navigate("/profile/legal-docs"),
    },
    {
      id: "manager-support",
      text: "Служба поддержки",
      onClick: () => setIsSupportModalOpen(true),
    },
  ];

  const roundedRating = useMemo(() => {
    if (organization?.ratingAvg == null) return "—";
    return Number(organization.ratingAvg).toFixed(1).replace(".", ",");
  }, [organization?.ratingAvg]);

  return (
    <div className={styles.container}>
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
      <div className={styles.profileContainer}>
        {isOrganizer && (
          <TabGroup key="tabs">
            <Tab
              key="user"
              accent={activeTab === "user"}
              onClick={() => setActiveTab("user")}
            >
              Пользователь
            </Tab>
            <Tab
              key="manager"
              accent={activeTab === "manager"}
              onClick={() => setActiveTab("manager")}
            >
              Организатор
            </Tab>
          </TabGroup>
        )}

        <div className={styles.profileCard}>
          {!isOrganizer || activeTab === "user" ? (
            <div className={styles.userProfileLayout}>
              <div className={styles.userAvatarContainer}>
                <Avatar size={64} src={avatarSrc} />
              </div>
              <div className={styles.userInfoContainer}>
                <div className={styles.profileName}>{displayName}</div>
                {/* <div className={styles.profileUsername}>@jenya_antonova</div> */}
              </div>
              <div className={styles.profileCardHeaderRight}>
                <IconButton
                  icon={Edit}
                  onClick={() => navigate("/profile/edit")}
                  iconColor="#ffffff"
                  iconSize={24}
                  variant={"minimal"}
                />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.profileCardHeader}>
                <div className={styles.profileCardHeaderLeft}>
                  <div className={styles.profileCardHeaderLeftImage}>
                    <Avatar size={100} src={organization?.avatarUrl} />
                  </div>
                </div>
                <div className={styles.profileCardHeaderRight}>
                  <IconButton
                    icon={Edit}
                    onClick={() => navigate("/profile/about-company/edit")}
                    iconColor="#ffffff"
                    iconSize={24}
                    variant={"minimal"}
                  />
                </div>
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.profileInfoLeft}>
                  <div className={styles.profileName}>
                    {organization?.name ?? "Организация"}
                  </div>
                  <div className={styles.profileUsername}>{displayName}</div>
                </div>
                <div className={styles.profileInfoRight}>
                  <StarIcon size={16} color="#BBBAFF" />
                  <div className={styles.profileRating}>{roundedRating}</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.userActions}>
          {!isOrganizer || activeTab === "user" ? (
            userLinks.map((link) => (
              <Link key={link.id} text={link.text} onClick={link.onClick} />
            ))
          ) : (
            <>
              {managerLinks.map((link) => (
                <Link key={link.id} text={link.text} onClick={link.onClick} />
              ))}
              <div className={styles.actions}>
                <Button
                  accent
                  onClick={() => {
                    navigate("/event-create");
                  }}
                  className={styles.button}
                >
                  Создать событие
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
