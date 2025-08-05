import React, { useState, useId } from "react";
import { Button, Pills, TextField } from "@shared/ui";
import styles from "./EventRatingModal.module.scss";
import { toast } from "react-toastify";
import { TickCircleIcon } from "@/shared/assets/icons";

interface EventRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventRatingModal: React.FC<EventRatingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const modalTitleId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle sending the support request
    console.log("Support request:", { subject, message });
    // Reset form and close modal
    setSubject("");
    setMessage("");

    onClose();

    toast(
      <Pills
        icon={TickCircleIcon}
        primaryText="Спасибо за ваш отзыв!"
        secondaryText="Ю-ху!"
        iconColor="#AFF940"
      />
    );
  };

  if (!isOpen) return null;

  return (
    <button
      className={styles.overlay}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      aria-label="Close modal"
      type="button"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            value={message}
            multiline
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Место для вашего отзыва"
            required
          />
          <div className={styles.buttons}>
            <Button type="submit" accent className={styles.button}>
              Оценить
            </Button>
            <Button type="button" onClick={onClose} className={styles.button}>
              Отменить
            </Button>
          </div>
        </form>
      </div>
    </button>
  );
};
