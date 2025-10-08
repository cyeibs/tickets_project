import React, { useRef, useState } from "react";
import { Avatar, Button, TextField } from "@shared/ui";
import styles from "./LoginPage.module.scss";
import { GalleryAddIcon } from "@/shared/assets/icons";

interface NameStepProps {
  firstName: string;
  lastName: string;
  middleName: string;
  error: string | null;
  isLoading: boolean;
  onFirstNameChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onLastNameChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onMiddleNameChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAvatarChange: (file: File | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NameStep: React.FC<NameStepProps> = ({
  firstName,
  lastName,
  middleName,
  error,
  isLoading,
  onFirstNameChange,
  onLastNameChange,
  onMiddleNameChange,
  onAvatarChange,
  onSave,
  onCancel,
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onAvatarChange(file);
    }
  };

  const handleImageDelete = () => {
    setUploadedImage(null);
    onAvatarChange(null);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={styles.avatarContainer}>
        <Avatar
          src={uploadedImage}
          size={100}
          uploading={uploadedImage === null ? true : false}
          backgroundColor="#39394040"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className={styles.hiddenInput}
        />
        <button
          type="button"
          className={styles.uploadButton}
          onClick={uploadedImage ? handleImageDelete : handleAddPhotoClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              uploadedImage ? handleImageDelete() : handleAddPhotoClick();
            }
          }}
        >
          <GalleryAddIcon size={24} color="#ffffff" />
          <span className={styles.uploadButtonText}>
            {uploadedImage ? "Удалить фото" : "Добавить фото"}
          </span>
        </button>
      </div>
      <TextField
        label="Фамилия"
        placeholder="Иванов"
        value={lastName}
        onChange={onLastNameChange}
        error={error || undefined}
        required
      />
      <TextField
        label="Имя"
        placeholder="Иван"
        value={firstName}
        onChange={onFirstNameChange}
        error={error || undefined}
        required
      />
      <TextField
        label="Отчество (необязательно)"
        placeholder="Иванович"
        value={middleName}
        onChange={onMiddleNameChange}
      />
      <div className={styles.buttonGroup}>
        <Button onClick={onSave} disabled={isLoading} type="button" accent>
          Сохранить
        </Button>
        <Button onClick={onCancel} type="button">
          Отменить
        </Button>
      </div>
    </>
  );
};
