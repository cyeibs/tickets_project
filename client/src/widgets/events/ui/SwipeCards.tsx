import React, { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { EventSwiperCard } from "@/shared/ui/EventSwiperCard";
import styles from "./SwipeCards.module.scss";
import { useNavigate } from "react-router-dom";

export type EventCardType = {
  uuid: string;
  title: string;
  date: string;
  location: string;
  price: string;
  imageUrl?: string;
};

interface SwipeCardProps {
  uuid: string;
  title: string;
  date: string;
  location: string;
  price: string;
  imageUrl?: string;
  setCards: Dispatch<SetStateAction<EventCardType[]>>;
  cards: EventCardType[];
  onButtonClick: () => void;
  onPositiveSwipe?: () => void;
  onNegativeSwipe?: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  uuid,
  title,
  date,
  location,
  price,
  imageUrl,
  setCards,
  cards,
  onButtonClick,
  onPositiveSwipe,
  onNegativeSwipe,
}) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const cardRef = useRef<HTMLDivElement>(null);

  const isFront = uuid === cards[cards.length - 1].uuid;

  const rotate = useTransform(() => {
    return `${rotateRaw.get()}deg`;
  });

  const handleDragEnd = () => {
    const distance = x.get();
    const isPositive = distance > 50;
    if (Math.abs(distance) > 50) {
      setCards((pv) => pv.filter((v) => v.uuid !== uuid));
      if (isPositive) onPositiveSwipe?.();
      else onNegativeSwipe?.();
    }
  };

  const preventDefaultTouchMove = (e: React.TouchEvent) => {
    if (isFront) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const element = cardRef.current;
    if (!element || !isFront) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (isFront) {
        e.preventDefault();
      }
    };

    element.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isFront]);

  return (
    <motion.div
      key={uuid}
      ref={cardRef}
      className={styles.cardWrapper}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
      onTouchMove={preventDefaultTouchMove}
    >
      <EventSwiperCard
        title={title}
        date={date}
        location={location}
        price={price}
        imageUrl={imageUrl || ""}
        image={!!imageUrl}
        isFront={isFront}
        onButtonClick={onButtonClick}
      />
    </motion.div>
  );
};

export const SwipeCards: React.FC<{
  events: EventCardType[];
  onPositiveSwipe?: (eventId: string, eventUuid?: string) => void;
  onNegativeSwipe?: (eventId: string, eventUuid?: string) => void;
}> = ({ events, onPositiveSwipe, onNegativeSwipe }) => {
  const [cards, setCards] = useState<EventCardType[]>(events);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefaultTouch = (e: TouchEvent) => {
      e.preventDefault();
    };

    container.addEventListener("touchstart", (e) => e.stopPropagation());
    container.addEventListener("touchmove", preventDefaultTouch, {
      passive: false,
    });

    return () => {
      container.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, []);

  console.log(cards);
  return (
    <div
      ref={containerRef}
      className={styles.container}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {cards.map((card) => (
        <SwipeCard
          key={card.uuid}
          cards={cards}
          onButtonClick={() => {
            navigate(`/event/${card.uuid}`);
          }}
          onPositiveSwipe={() => onPositiveSwipe?.(card.uuid, card.uuid)}
          onNegativeSwipe={() => onNegativeSwipe?.(card.uuid, card.uuid)}
          setCards={setCards}
          {...card}
        />
      ))}
    </div>
  );
};
