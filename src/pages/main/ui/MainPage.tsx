import {
  EventCard,
  Header,
  Snackbar,
  SnackbarItem,
  Tab,
  TabGroup,
} from '@/shared/ui';
import type { SnackbarItemType } from '@/shared/ui/Snackbar/SnackbarItem';
import { SwipeCards } from '@/widgets/events';
import type { EventCardType } from '@/widgets/events/ui/SwipeCards';
import { useAuth } from '@features/auth';
import { StoriesWidget } from '@widgets/stories';
import React, { useState } from 'react';
import styles from './MainPage.module.scss';

export const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'poster' | 'swiper'>('poster');
  const [activeNavItem, setActiveNavItem] = useState<SnackbarItemType>('home');
  const { logout } = useAuth();

  const handleNavItemClick = (item: SnackbarItemType) => {
    setActiveNavItem(item);
  };

  // Sample event data (in a real app, this would come from an API)
  const events = [
    {
      id: 1,
      title: 'Путешествие в Оркестрбург: знакомство с ударными',
      date: '12 июня в 12:00',
      location: 'Парк 300-летия Петербурга',
      price: 'от 1500₽',
      imageUrl: '/avatars/1.webp',
    },
    {
      id: 2,
      title: 'Джазовый вечер в филармонии',
      date: '15 июня в 19:00',
      location: 'Филармония им. Шостаковича',
      price: 'от 2000₽',
      imageUrl: '/avatars/2.avif',
    },
    {
      id: 3,
      title: 'Мастер-класс по живописи',
      date: '18 июня в 15:00',
      location: 'Творческая студия «Палитра»',
      price: 'от 1200₽',
      imageUrl: '/avatars/1.webp',
    },
    {
      id: 4,
      title: 'Фестиваль уличной еды',
      date: '20 июня в 12:00',
      location: 'Новая Голландия',
      price: 'Вход свободный',
      imageUrl: '/avatars/2.avif',
    },
    {
      id: 5,
      title: 'Выставка современного искусства',
      date: '25 июня в 10:00',
      location: 'Эрарта',
      price: 'от 700₽',
      imageUrl: '/avatars/1.webp',
    },
  ];

  // Convert events to EventCardType for SwipeCards
  const eventCards: EventCardType[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    price: event.price,
    imageUrl: event.imageUrl,
  }));

  return (
    <div className={styles.container}>
      <Header showLogo showLeftButton={false} showRightButton={false} />

      <div
        className={`${styles.storiesContainer} ${activeTab === 'poster' ? styles.visible : styles.hidden}`}
      >
        <StoriesWidget />
      </div>

      <div
        className={`${styles.eventsContainer} ${activeTab === 'swiper' ? styles.swiperMode : ''}`}
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

        {activeTab === 'poster' ? (
          // Render 5 EventCard components when "poster" tab is active
          events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              price={event.price}
              imageUrl={event.imageUrl}
            />
          ))
        ) : (
          // Render SwipeCards component when "swiper" tab is active
          <SwipeCards events={eventCards} />
        )}
      </div>

      <div className={styles.snackbarContainer}>
        <Snackbar>
          <SnackbarItem
            type="home"
            isActive={activeNavItem === 'home'}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick('home')}
          />
          <SnackbarItem
            type="search"
            isActive={activeNavItem === 'search'}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick('search')}
          />
          <SnackbarItem
            type="add"
            isActive={activeNavItem === 'add'}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick('add')}
          />
          <SnackbarItem
            type="ticket"
            isActive={activeNavItem === 'ticket'}
            activeItem={activeNavItem}
            onClick={() => handleNavItemClick('ticket')}
          />
          <SnackbarItem
            type="profile"
            isActive={activeNavItem === 'profile'}
            activeItem={activeNavItem}
            onClick={() => {
              handleNavItemClick('profile');
              logout();
            }}
          />
        </Snackbar>
      </div>
    </div>
  );
};
