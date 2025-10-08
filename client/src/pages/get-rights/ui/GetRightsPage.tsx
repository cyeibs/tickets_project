import React, { useRef, useState } from "react";
import { Avatar, Button, StepperHorizontal, TextField } from "@shared/ui";
import styles from "./GetRightsPage.module.scss";
import { useNavigate } from "react-router-dom";
import { userApi } from "@entities/user";
import { GalleryAddIcon } from "@/shared/assets/icons";

export const GetRightsPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneDigits, setPhoneDigits] = useState(""); // 10 digits
  const [socialUrl, setSocialUrl] = useState("");
  const [inn, setInn] = useState("");
  const [ogrn, setOgrn] = useState("");
  const [kpp, setKpp] = useState("");
  const [licence, setLicence] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const formatPhoneNumber = (digits: string) => {
    if (!digits) return "";
    let s = "";
    if (digits.length > 0) {
      s += "(" + digits.slice(0, Math.min(3, digits.length));
      if (digits.length > 3) s += ") ";
    }
    if (digits.length > 3) {
      s += digits.slice(3, Math.min(6, digits.length));
      s += digits.length > 6 ? "-" : "";
    }
    if (digits.length > 6) {
      s += digits.slice(6, Math.min(8, digits.length));
      s += digits.length > 8 ? "-" : "";
    }
    if (digits.length > 8) {
      s += digits.slice(8, 10);
    }
    return s;
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div>
              <Avatar src={preview} size={100} backgroundColor="#39394040" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={preview ? handleImageDelete : handleAddPhotoClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    preview ? handleImageDelete() : handleAddPhotoClick();
                  }
                }}
                className={styles.button}
              >
                <GalleryAddIcon size={24} color="#ffffff" />
                <span style={{ marginLeft: 8 }}>
                  {preview ? "Удалить логотип" : "Добавить логотип"}
                </span>
              </button>
            </div>
            <TextField
              label="Название"
              placeholder='Например: ООО "Альфа"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />
            <TextField
              label="Описание"
              placeholder="Кратко опишите вашу деятельность"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              multiline
              rows={3}
              required
            />
            <TextField
              label="Телефон"
              placeholder="(999) 999-99-99"
              prefixElement={<span>+7</span>}
              value={formatPhoneNumber(phoneDigits)}
              onChange={(e) => {
                const digits = String(e.target.value)
                  .replace(/\D/g, "")
                  .slice(0, 10);
                setPhoneDigits(digits);
              }}
              error={errors.telephone}
              type="tel"
              inputMode="numeric"
              required
            />
            <TextField
              label="Соц. сети"
              placeholder="https://t.me/your_org"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              error={errors.socialUrl}
              required
            />
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <TextField
              label="ИНН"
              placeholder="Например: 7700000000"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              error={errors.inn}
              required
            />
            <TextField
              label="ОГРН"
              placeholder="Например: 1207700000000"
              value={ogrn}
              onChange={(e) => setOgrn(e.target.value)}
              error={errors.ogrn}
              required
            />
            <TextField
              label="КПП"
              placeholder="Например: 770001001"
              value={kpp}
              onChange={(e) => setKpp(e.target.value)}
              error={errors.kpp}
              required
            />
            <TextField
              label="Лицензия"
              placeholder="Номер лицензии или описание"
              value={licence}
              onChange={(e) => setLicence(e.target.value)}
              error={errors.licence}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  const validateStep = (step: number) => {
    const stepErrors: Record<string, string> = {};
    if (step === 1) {
      if (!name.trim()) stepErrors.name = "Обязательно";
      if (!description.trim()) stepErrors.description = "Обязательно";
      if (phoneDigits.length !== 10) stepErrors.telephone = "Введите телефон";
      if (!socialUrl.trim()) stepErrors.socialUrl = "Обязательно";
    } else if (step === 2) {
      if (!inn.trim()) stepErrors.inn = "Обязательно";
      if (!ogrn.trim()) stepErrors.ogrn = "Обязательно";
      if (!kpp.trim()) stepErrors.kpp = "Обязательно";
      if (!licence.trim()) stepErrors.licence = "Обязательно";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      if (!validateStep(currentStep)) return;
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepperContainer}>
        <StepperHorizontal
          steps={totalSteps}
          currentStep={currentStep}
          onStepClick={handleStepChange}
        />
      </div>
      <div className={styles.profileCard}>
        <div className={styles.profileCardContent}>{renderStepContent()}</div>
      </div>
      <div className={styles.actions}>
        {currentStep < totalSteps && (
          <Button accent className={styles.button} onClick={handleNextStep}>
            Продолжить
          </Button>
        )}

        {currentStep === totalSteps && (
          <Button
            accent
            className={styles.button}
            onClick={async () => {
              if (!validateStep(2)) return;
              try {
                setIsSubmitting(true);
                let avatarId: string | undefined;
                if (avatarFile) {
                  const { id } = await userApi.uploadAvatar(avatarFile);
                  avatarId = id;
                }
                await userApi.submitOrganizerApplication({
                  name,
                  description,
                  phoneDigits,
                  socialUrl,
                  inn,
                  ogrn,
                  kpp,
                  licence,
                  ...(avatarId ? { avatarId } : {}),
                });
                // navigate back or show success toast if available
                navigate(-1);
              } catch (e) {
                console.error(e);
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
        )}

        {currentStep > 1 && (
          <Button onClick={handlePrevStep} className={styles.button}>
            Назад
          </Button>
        )}
        {currentStep === 1 && (
          <Button onClick={handleCancel} className={styles.button}>
            Отменить
          </Button>
        )}
      </div>
    </div>
  );
};
