import React from "react";

export interface StoryItem {
  url: string;
  header?: {
    heading: string;
    subheading: string;
    profileImage: string;
  };
  duration?: number;
  seeMore?: React.ComponentType<any> | ((props: any) => React.ReactElement);
  seeMoreCollapsed?:
    | React.ComponentType<any>
    | ((props: any) => React.ReactElement);
  type?: "image" | "video";
}

export interface CompanyStories {
  id: number;
  name: string;
  avatarUrl: string;
  stories: StoryItem[];
}

export interface StoriesWidgetProps {
  companies?: CompanyStories[];
}
