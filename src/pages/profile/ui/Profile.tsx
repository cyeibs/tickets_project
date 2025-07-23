import { Edit, StarIcon } from "@/shared/assets/icons";
import { Avatar, IconButton, Tab, TabGroup } from "@/shared/ui";
import React, { useState } from "react";
import styles from "./Profile.module.scss";
import { Link } from "@/shared/ui/Link";
import { useNavigate } from "react-router-dom";

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"user" | "manager">("user");
  const navigate = useNavigate();

  const userLinks = [
    {
      id: "subscriptions",
      text: "Подписки",
      onClick: () => navigate("/subscriptions"),
    },
    {
      id: "become-organizer",
      text: "Стать организатором",
      onClick: () => navigate("/organizer-profile-create"),
    },
    {
      id: "user-support",
      text: "Служба поддержки",
      onClick: () => navigate("/support"),
    },
  ];

  const managerLinks = [
    {
      id: "my-events",
      text: "Мои события",
      onClick: () => navigate("/my-events"),
    },
    { id: "stories", text: "Сторисы", onClick: () => navigate("/stories") },
    {
      id: "about-org",
      text: "Об организации",
      onClick: () => navigate("/about-organization"),
    },
    {
      id: "legal-docs",
      text: "Юридические документы",
      onClick: () => navigate("/legal-docs"),
    },
    {
      id: "manager-support",
      text: "Служба поддержки",
      onClick: () => navigate("/support"),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <TabGroup>
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
                  onClick={() => navigate("/profile-edit")}
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
                    onClick={() => navigate("/organizer/edit")}
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
          {activeTab === "user"
            ? userLinks.map((link) => (
                <Link key={link.id} text={link.text} onClick={link.onClick} />
              ))
            : managerLinks.map((link) => (
                <Link key={link.id} text={link.text} onClick={link.onClick} />
              ))}
        </div>
      </div>
    </div>
  );
};
