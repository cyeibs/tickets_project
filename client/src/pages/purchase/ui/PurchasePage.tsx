import { Button, EventCard, IconButton, TextField } from "@/shared/ui";
import styles from "./PurchasePage.module.scss";
import { AddIcon, MinusIcon } from "@/shared/assets/icons";
import { useCallback, useState } from "react";

export const PurchasePage = () => {
  const [ticketCount, setTicketCount] = useState(1);

  const decrementTickets = useCallback(() => {
    setTicketCount((prev) => Math.max(1, prev - 1));
  }, []);

  const incrementTickets = useCallback(() => {
    setTicketCount((prev) => prev + 1);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.purchaseContainer}>
        <EventCard
          title="VK Fest"
          date="12 июня в 12:00"
          short
          location="Парк 300-летия Петербурга"
          imageUrl="/tickets_project/avatars/1.webp"
          image={true}
        />

        <div className={styles.paymentContainer}>
          <span className={styles.paymentTitle}>Информация покупателя</span>
          <div className={styles.paymentContent}>
            <TextField
              label="Фамилия"
              placeholder="Заполните поле"
              className={styles.textField}
            />
            <TextField
              label="Имя"
              placeholder="Заполните поле"
              className={styles.textField}
            />

            <div className={styles.ticketsContainer}>
              <TextField
                label="Количество билетов"
                value={ticketCount.toString()}
                readOnly
                className={styles.ticketsField}
              />

              <IconButton
                icon={<MinusIcon />}
                onClick={decrementTickets}
                disabled={ticketCount <= 1}
              />
              <IconButton
                variant="accent"
                icon={<AddIcon />}
                onClick={incrementTickets}
              />
            </div>
          </div>
        </div>

        <div className={styles.detailsContainer}>
          <span className={styles.detailsTitle}>Детали заказа</span>
          <div className={styles.detailsContent}>
            <div className={styles.detailsItem}>
              <span className={styles.itemTitle}>Билеты</span>
              <span className={styles.itemValue}>{ticketCount * 1000} ₽</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.itemTitle}>Сервисный сбор</span>
              <span className={styles.itemValue}>
                {ticketCount * 1000 * 0.1} ₽
              </span>
            </div>
          </div>
          <div className={styles.detailsSeparator} />
          <div className={styles.detailsItem}>
            <span className={styles.itemTitle}>Итого</span>
            <span className={styles.itemValue}>
              {ticketCount * 1000 + ticketCount * 1000 * 0.1} ₽
            </span>
          </div>
          <Button accent className={styles.button}>
            Оплатить
          </Button>

          <span className={styles.detailsText}>
            Нажимая на кнопку, я предоставляю согласие на обработку своих
            персональных данных, а также подтверждаю ознакомление и согласие с
            Политикой конфиденциальности и Пользовательским соглашением
          </span>
        </div>
      </div>
    </div>
  );
};
