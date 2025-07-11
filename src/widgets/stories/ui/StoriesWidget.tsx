import React from "react";
import { StoriesLine } from "../../../shared/ui";
import styles from "./StoriesWidget.module.scss";

// Mock data for stories
const mockStories = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  // No imageUrl means it will show a gray circle
  imageUrl: "./avatars/1.webp",
}));

export const StoriesWidget: React.FC = () => {
  return (
    <div className={styles.container}>
      <StoriesLine title="Сторисы" stories={mockStories} avatarSize={64} />
    </div>
  );
};
