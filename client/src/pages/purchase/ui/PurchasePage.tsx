import { Button, EventCard, IconButton, TextField } from "@/shared/ui";
import styles from "./PurchasePage.module.scss";
import { AddIcon, MinusIcon } from "@/shared/assets/icons";
import { useCallback, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const PurchasePage = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const eventId = routeId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [ticketCount, setTicketCount] = useState(1);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [firstNameError, setFirstNameError] = useState<string | undefined>();

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    enabled: !!eventId,
    queryFn: () => userApi.getEventById(eventId),
  });

  const eventPrice = event?.price ?? 0;
  const ticketsSum = useMemo(
    () => ticketCount * eventPrice,
    [ticketCount, eventPrice]
  );
  const serviceFee = useMemo(() => ticketsSum * 0.1, [ticketsSum]);
  const total = useMemo(
    () => ticketsSum + serviceFee,
    [ticketsSum, serviceFee]
  );

  const canPay =
    !!event &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    ticketCount >= 1;

  const createPurchase = useMutation({
    mutationFn: async () => {
      return userApi.createPurchase({
        eventId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        quantity: ticketCount,
        statusCode: "paid",
      });
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["myPurchases"] });
      if (res && Array.isArray(res.ticketIds) && res.ticketIds[0]) {
        navigate(`/ticket/${res.ticketIds[0]}`);
      } else {
        navigate("/ticket");
      }
    },
  });

  const decrementTickets = useCallback(() => {
    setTicketCount((prev) => Math.max(1, prev - 1));
  }, []);

  const incrementTickets = useCallback(() => {
    setTicketCount((prev) => prev + 1);
  }, []);

  const handlePayClick = useCallback(() => {
    let hasError = false;
    if (!lastName.trim()) {
      setLastNameError("Заполните фамилию");
      hasError = true;
    } else {
      setLastNameError(undefined);
    }
    if (!firstName.trim()) {
      setFirstNameError("Заполните имя");
      hasError = true;
    } else {
      setFirstNameError(undefined);
    }
    if (hasError) return;
    if (!createPurchase.isPending) createPurchase.mutate();
  }, [lastName, firstName, createPurchase]);

  return (
    <div className={styles.container}>
      <div className={styles.purchaseContainer}>
        <EventCard
          title={event?.title || ""}
          date={event ? `${event.date} в ${event.time}` : undefined}
          short
          location={event?.location}
          imageUrl={event?.imageUrl}
          image={!!event?.imageUrl}
          price={event ? `${event.price} ₽` : undefined}
        />

        <div className={styles.paymentContainer}>
          <span className={styles.paymentTitle}>Информация покупателя</span>
          <div className={styles.paymentContent}>
            <TextField
              label="Фамилия"
              placeholder="Заполните поле"
              className={styles.textField}
              value={lastName}
              required
              error={lastNameError}
              onChange={(e) => {
                setLastName(String(e.target.value));
                if (lastNameError) setLastNameError(undefined);
              }}
            />
            <TextField
              label="Имя"
              placeholder="Заполните поле"
              className={styles.textField}
              value={firstName}
              required
              error={firstNameError}
              onChange={(e) => {
                setFirstName(String(e.target.value));
                if (firstNameError) setFirstNameError(undefined);
              }}
            />

            <div className={styles.ticketsContainer}>
              <TextField
                label="Количество билетов"
                value={ticketCount.toString()}
                readOnly
                required
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
              <span className={styles.itemValue}>
                {Math.round(ticketsSum)} ₽
              </span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.itemTitle}>Сервисный сбор</span>
              <span className={styles.itemValue}>
                {Math.round(serviceFee)} ₽
              </span>
            </div>
          </div>
          <div className={styles.detailsSeparator} />
          <div className={styles.detailsItem}>
            <span className={styles.itemTitle}>Итого</span>
            <span className={styles.itemValue}>{Math.round(total)} ₽</span>
          </div>
          <Button
            accent
            className={styles.button}
            disabled={!event || createPurchase.isPending}
            onClick={handlePayClick}
          >
            {createPurchase.isPending ? "Оплата..." : "Оплатить"}
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
