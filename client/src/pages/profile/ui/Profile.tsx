import { Edit, StarIcon } from "@/shared/assets/icons";
import { Avatar, Button, IconButton, Tab, TabGroup } from "@/shared/ui";
import React, { useState, useEffect } from "react";
import styles from "./Profile.module.scss";
import { Link } from "@/shared/ui/Link";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { SupportModal } from "@/widgets/modals";

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

  const { logout } = useAuth();

  const userLinks = [
    {
      id: "subscriptions",
      text: "Подписки",
      onClick: () => navigate("/profile/subscriptions"),
    },
    {
      id: "become-organizer",
      text: "Стать организатором",
      onClick: () => navigate("/profile/get-rights"),
    },
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

  return (
    <div className={styles.container}>
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
      <div className={styles.profileContainer}>
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

        <div className={styles.profileCard}>
          {activeTab === "user" ? (
            <div className={styles.userProfileLayout}>
              <div className={styles.userAvatarContainer}>
                <Avatar size={64} src={"./avatars/1.webp"} />
              </div>
              <div className={styles.userInfoContainer}>
                <div className={styles.profileName}>Женя Антонова</div>
                <div className={styles.profileUsername}>@jenya_antonova</div>
              </div>
              <div className={styles.profileCardHeaderRight}>
                <IconButton
                  icon={Edit}
                  onClick={() => {}}
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
                    <Avatar size={100} src={"./avatars/1.webp"} />
                  </div>
                </div>
                <div className={styles.profileCardHeaderRight}>
                  <IconButton
                    icon={Edit}
                    onClick={() => {}}
                    iconColor="#ffffff"
                    iconSize={24}
                    variant={"minimal"}
                  />
                </div>
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.profileInfoLeft}>
                  <div className={styles.profileName}>Лучший организатор</div>
                  <div className={styles.profileUsername}>Женя Антонова</div>
                </div>
                <div className={styles.profileInfoRight}>
                  <StarIcon size={16} color="#BBBAFF" />
                  <div className={styles.profileRating}>4,8</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.userActions}>
          {activeTab === "user" ? (
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
