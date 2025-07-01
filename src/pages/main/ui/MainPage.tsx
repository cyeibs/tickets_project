import React, { useState } from 'react';
import { useAuth } from '@features/auth';
import { StoriesWidget } from '@widgets/stories';
import styles from './MainPage.module.scss';
import { EventCard, Header, Tab, TabGroup } from '@/shared/ui';

export const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'poster' | 'swiper'>('poster');

  return (
    <div className={styles.container}>
      <Header showLogo showLeftButton={false} showRightButton={false} />

      <StoriesWidget />

      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <TabGroup title="События">
          <Tab
            accent={activeTab === 'poster'}
            onClick={() => setActiveTab('poster')}
          >
            Афишой
          </Tab>
          <Tab
            accent={activeTab === 'swiper'}
            onClick={() => setActiveTab('swiper')}
          >
            Свайпер
          </Tab>
        </TabGroup>

        <EventCard
          title="Путешествие в Оркестрбург: знакомство с ударными"
          date="12 июня в 12:00"
          location="Парк 300-летия Петербурга"
          price="от 1500₽"
          imageUrl="/avatars/1.webp"
        />

        <EventCard
          title="Путешествие в Оркестрбург: знакомство с ударными"
          date="12 июня в 12:00"
          location="Парк 300-летия Петербурга"
          price="от 1500₽"
          imageUrl="/avatars/1.webp"
          short
        />

        <EventCard
          title="Путешествие в Оркестрбург: знакомство с ударными"
          date="12 июня в 12:00"
          location="Парк 300-летия Петербурга"
          price="от 1500₽"
          image={false}
        />

        <EventCard
          title="Путешествие в Оркестрбург: знакомство с ударными"
          date="12 июня в 12:00"
          location="Парк 300-летия Петербурга"
          price="от 1500₽"
          image={false}
          short
        />

        <EventCard
          title="Путешествие в Оркестрбург: знакомство с ударными"
          date="12 июня в 12:00"
          location="Парк 300-летия Петербурга"
          price="от 1500₽"
          imageUrl="/avatars/1.webp"
          forSearch
        />

        <EventCard
          title="Путешествие в Оркестрбург: знакомство с ударными"
          date="12 июня в 12:00"
          location="Парк 300-летия Петербурга"
          price="от 1500₽"
          image={false}
          forSearch
        />
      </div>
    </div>
  );
};
