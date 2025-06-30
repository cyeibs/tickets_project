import React, { useState } from 'react';
import { useAuth } from '@features/auth';
import { StoriesWidget } from '@widgets/stories';
import styles from './MainPage.module.scss';
import { Header, Tab, TabGroup } from '@/shared/ui';

export const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'poster' | 'swiper'>('poster');

  return (
    <div className={styles.container}>
      <Header showLogo showLeftButton={false} showRightButton={false} />

      <StoriesWidget />

      <div style={{ padding: '0 16px' }}>
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
      </div>
    </div>
  );
};
