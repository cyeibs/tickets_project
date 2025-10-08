import React, { useState, useCallback } from "react";
import { StoriesLine } from "../../../shared/ui";
import { StoriesModal } from "../../modals/stories";
import styles from "./StoriesWidget.module.scss";
import type { CompanyStories, StoriesWidgetProps } from "../model/types";

// Default mock data for companies with their stories
const defaultMockCompanies: CompanyStories[] = [
  {
    id: 1,
    name: "Company 1",
    avatarUrl: "/avatars/1.webp",
    stories: [
      {
        url: "/avatars/1.webp",
        duration: 4001,
      },
      {
        url: "./avatars/2.avif",
        duration: 4001,
      },
    ],
  },
  {
    id: 2,
    name: "Company 2",
    avatarUrl: "/avatars/2.avif",
    stories: [
      {
        url: "/avatars/1.webp",
        duration: 4001,
      },
      {
        url: "/avatars/2.avif",
        duration: 4001,
      },
    ],
  },
];

export const StoriesWidget: React.FC<StoriesWidgetProps> = ({
  companies = defaultMockCompanies,
}) => {
  const [showStories, setShowStories] = useState(false);
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);

  const handleStoryClose = useCallback(() => {
    setShowStories(false);
  }, []);

  const handleStoryClick = (index: number) => {
    setCurrentCompanyIndex(index);
    setShowStories(true);
  };

  return (
    <div className={styles.container}>
      <StoriesLine
        title="Сторисы"
        stories={companies.map((company) => ({
          id: company.id,
          imageUrl: company.avatarUrl,
          name: company.name,
        }))}
        avatarSize={64}
        onStoryClick={handleStoryClick}
      />

      <StoriesModal
        isOpen={showStories}
        onClose={handleStoryClose}
        companies={companies}
        currentCompanyIndex={currentCompanyIndex}
        setCurrentCompanyIndex={setCurrentCompanyIndex}
      />
    </div>
  );
};
