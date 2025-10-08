import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, StepperHorizontal, TextField } from "@shared/ui";
import styles from "./OrganizerProfileEditPage.module.scss";
import { useNavigate } from "react-router-dom";
import { userApi } from "@entities/user";
import { GalleryAddIcon } from "@/shared/assets/icons";
import { useAuth } from "@/features/auth";

export const OrganizerProfileEditPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const navigate = useNavigate();
  const { user } = useAuth();
  const organizationId = user?.organizationId || null;

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneDigits, setPhoneDigits] = useState(""); // 10 digits
  const [socialUrl, setSocialUrl] = useState("");
  const [inn, setInn] = useState("");
  const [ogrn, setOgrn] = useState("");
  const [kpp, setKpp] = useState("");
  const [licence, setLicence] = useState("");

  // Initial values for diffing
  const [initial, setInitial] = useState<{
    name: string;
    description: string;
    phoneDigits: string;
    socialUrl: string;
    inn: string;
    ogrn: string;
    kpp: string;
    licence: string;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<
    string | undefined
  >(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!organizationId) return;
    userApi
      .getOrganization(organizationId)
      .then((org) => {
        setName(org.name || "");
        setDescription(org.description || "");
        setExistingAvatarUrl(org.avatarUrl);
        setSocialUrl(org.socialUrl || "");
        setInn(org.inn || "");
        setOgrn(org.ogrn || "");
        setKpp(org.kpp || "");
        setLicence(org.licence || "");
        // try to infer phone digits from server telephone
        // expecting format +7XXXXXXXXXX
        const digits = (org.telephone || "").replace(/\D/g, "").slice(-10);
        setPhoneDigits(digits);
        setInitial({
          name: org.name || "",
          description: org.description || "",
          phoneDigits: digits,
          socialUrl: org.socialUrl || "",
          inn: org.inn || "",
          ogrn: org.ogrn || "",
          kpp: org.kpp || "",
          licence: org.licence || "",
        });
      })
      .catch(() => {});
  }, [organizationId]);

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

  const onSubmit = async () => {
    if (!organizationId) return;
    // Determine what changed
    const avatarChanged = !!avatarFile;
    const nonAvatarChanged = initial
      ? !(
          initial.name === name &&
          initial.description === description &&
          initial.phoneDigits === phoneDigits &&
          initial.socialUrl === socialUrl &&
          initial.inn === inn &&
          initial.ogrn === ogrn &&
          initial.kpp === kpp &&
          initial.licence === licence
        )
      : true; // if no initial, treat as changed to be safe
    try {
      setIsSubmitting(true);

      // Avatar-only update should be immediate
      if (avatarChanged && !nonAvatarChanged) {
        const { id } = await userApi.uploadAvatar(avatarFile!);
        await userApi.updateOrganizationAvatar(organizationId, id);
        navigate(-1);
        return;
      }

      // If there are non-avatar changes, validate required fields
      if (nonAvatarChanged && !validateStep(2)) {
        return;
      }

      // Otherwise create application for update
      let avatarId: string | undefined;
      if (avatarChanged) {
        const { id } = await userApi.uploadAvatar(avatarFile);
        avatarId = id;
      }
      await userApi.submitOrganizationUpdateApplication({
        organizationId,
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
      navigate(-1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div>
              <Avatar
                src={preview || existingAvatarUrl || undefined}
                size={100}
                backgroundColor="#39394040"
              />
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
                  {preview ? "Удалить логотип" : "Изменить логотип"}
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
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Сохранить"}
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
