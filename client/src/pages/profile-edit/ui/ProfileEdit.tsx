import React, { useEffect, useRef, useState } from "react";
import styles from "./ProfileEdit.module.scss";
import { Avatar, Button, TextField } from "@shared/ui";
import { GalleryAddIcon } from "@/shared/assets/icons";
import { useAuth } from "@/features/auth";
import { userApi } from "@/entities/user";

export const ProfileEditPage: React.FC = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const parts = (user.name ?? "").split(" ");
      // naive split: assume first token is first name, last token is last name
      // Keep previous order used on signup (first last middle)
      setFirstName(parts[0] ?? "");
      setMiddleName(parts.length > 2 ? parts.slice(1, -1).join(" ") : "");
      setLastName(parts.length > 1 ? parts[parts.length - 1] : "");
      if (user.avatar) setPreview(user.avatar);
    }
  }, [user]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAddPhotoClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    setAvatarFile(file);
  };
  const handleImageDelete = () => {
    setAvatarFile(null);
    setPreview(null);
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Пожалуйста, введите фамилию и имя");
      return;
    }
    setError(null);
    try {
      setIsLoading(true);
      // If avatarFile present, upload first via API instance (respects baseURL and auth)
      let avatarId: string | null | undefined = undefined;
      if (avatarFile) {
        const { id } = await userApi.uploadAvatar(avatarFile);
        avatarId = id;
      }

      // Patch profile via userApi
      await userApi.updateMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        middleName: middleName.trim() || undefined,
        ...(avatarId ? { avatarId } : {}),
      });
      window.history.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <Avatar
          src={preview}
          size={100}
          uploading={preview === null}
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
          onClick={preview ? handleImageDelete : handleAddPhotoClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              preview ? handleImageDelete() : handleAddPhotoClick();
            }
          }}
        >
          <GalleryAddIcon size={24} color="#ffffff" />
          <span className={styles.uploadButtonText}>
            {preview ? "Удалить фото" : "Добавить фото"}
          </span>
        </button>
      </div>

      <TextField
        label="Фамилия"
        placeholder="Иванов"
        value={lastName}
        onChange={(e) => setLastName((e.target as HTMLInputElement).value)}
        error={error || undefined}
        required
      />
      <TextField
        label="Имя"
        placeholder="Иван"
        value={firstName}
        onChange={(e) => setFirstName((e.target as HTMLInputElement).value)}
        error={error || undefined}
        required
      />
      <TextField
        label="Отчество (необязательно)"
        placeholder="Иванович"
        value={middleName}
        onChange={(e) => setMiddleName((e.target as HTMLInputElement).value)}
      />

      <div className={styles.buttonGroup}>
        <Button onClick={handleSave} disabled={isLoading} type="button" accent>
          Сохранить
        </Button>
        <Button onClick={() => window.history.back()} type="button">
          Отменить
        </Button>
      </div>
    </div>
  );
};
