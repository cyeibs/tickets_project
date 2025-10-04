import React, { useState, useId } from "react";
import { Button, Pills, TextField } from "@shared/ui";
import styles from "./SupportModal.module.scss";
import { toast } from "react-toastify";
import { TickCircleIcon } from "@/shared/assets/icons";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
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
        primaryText="уже изучаем!"
        secondaryText="Ю-ху!"
        iconColor="#AFF940"
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      aria-label="Close modal"
      role="presentation"
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
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Тема обращения"
            required
          />
          <TextField
            value={message}
            multiline
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Описание проблемы"
            required
          />
          <div className={styles.buttons}>
            <Button type="submit" accent className={styles.button}>
              Отправить
            </Button>
            <Button type="button" onClick={onClose} className={styles.button}>
              Отменить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
