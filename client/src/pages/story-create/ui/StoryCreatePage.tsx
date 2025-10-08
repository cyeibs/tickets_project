import { TickCircleIcon } from "@/shared/assets/icons";
import { GalleryAddIcon } from "@/shared/assets/icons/gallerty-add";
import { StoriesCard } from "@/shared/ui/StoriesCard";
import {
  Button,
  Pills,
  StepperHorizontal,
  TextField,
  AutocompleteSelect,
} from "@shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./StoryCreatePage.module.scss";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { useAuth } from "@/features/auth";

export const StoryCreatePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Step 1 fields: select event, lock title, editable description
  const [eventValue, setEventValue] = useState<string | null>(null);
  const [eventInput, setEventInput] = useState<string>("");
  const [eventError, setEventError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datePreview, setDatePreview] = useState<string | undefined>(undefined);
  const [timePreview, setTimePreview] = useState<string | undefined>(undefined);

  // Colors
  const { data: storyColors = [] } = useQuery({
    queryKey: ["story-colors"],
    queryFn: () => userApi.getStoryColors(),
  });
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  // Organizer events
  const { data: myEvents = [] } = useQuery({
    queryKey: ["organization-events-for-stories", user?.organizationId],
    enabled: !!user?.organizationId,
    queryFn: () =>
      userApi.getOrganizationEvents(user!.organizationId as string),
  });

  // Selected event details for description
  const { data: selectedEventDetails } = useQuery({
    queryKey: ["event", eventValue],
    enabled: !!eventValue,
    queryFn: () => userApi.getEventById(eventValue as string),
  });

  // When event changes, lock title, set date/time for preview
  useEffect(() => {
    if (!eventValue) return;
    const ev = myEvents.find((e) => e.id === eventValue);
    if (ev) {
      setTitle(ev.title);
      const dt = ev.date;
      setDatePreview(dt);
      setTimePreview(ev.time);
    }
  }, [eventValue, myEvents]);

  // Prefill description from event details
  useEffect(() => {
    if (!eventValue) return;
    if (selectedEventDetails) {
      setDescription(selectedEventDetails.description || "");
    }
  }, [eventValue, selectedEventDetails]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleImageDelete = () => {
    setUploadedImage(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Content
            eventValue={eventValue}
            eventInput={eventInput}
            onEventChange={(val) => {
              setEventValue(val);
              setEventError(null);
            }}
            onEventInputChange={(val) => setEventInput(val)}
            eventOptions={myEvents.map((e) => ({
              label: e.title,
              value: e.id,
            }))}
            eventError={eventError || undefined}
            title={title}
            description={description}
            onDescriptionChange={(e) => setDescription(e.target.value)}
          />
        );
      case 2:
        return (
          <Step2Content
            uploadedImage={uploadedImage}
            onImageDelete={handleImageDelete}
            onAddPhotoClick={handleAddPhotoClick}
            colors={storyColors}
            onColorChange={(id) => setSelectedColorId(id)}
            titlePreview={title}
            descriptionPreview={description || undefined}
          />
        );
      default:
        return (
          <Step1Content
            eventValue={eventValue}
            eventInput={eventInput}
            onEventChange={(val) => {
              setEventValue(val);
              setEventError(null);
            }}
            onEventInputChange={(val) => setEventInput(val)}
            eventOptions={myEvents.map((e) => ({
              label: e.title,
              value: e.id,
            }))}
            eventError={eventError || undefined}
            title={title}
            description={description}
            onDescriptionChange={(e) => setDescription(e.target.value)}
          />
        );
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!eventValue) {
        setEventError("Выберите событие");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const createStoryMutation = useMutation({
    mutationFn: async () => {
      if (!user?.organizationId)
        throw new Error("Доступно только организаторам");
      if (!eventValue) throw new Error("Выберите событие");
      const colorId = (selectedColorId || storyColors[0]?.id) as string;

      let posterId: string | undefined;
      if (uploadedFile) {
        const uploaded = await userApi.uploadFile(uploadedFile);
        posterId = uploaded.id;
      }

      return await userApi.createOrganizationStory({
        organizationId: user.organizationId,
        eventId: eventValue,
        description: description.trim() || undefined,
        colorId,
        ...(posterId ? { posterId } : {}),
      });
    },
    onSuccess: () => {
      toast(
        <Pills
          icon={TickCircleIcon}
          primaryText="История успешно создана!"
          secondaryText="Ю-ху!"
          iconColor="#AFF940"
        />
      );
      navigate(-1);
    },
    onError: (e: any) => {
      toast.error(e?.message || "Ошибка при создании истории");
    },
  });

  const handleSubmit = () => {
    if (!eventValue) {
      setEventError("Выберите событие");
      setCurrentStep(1);
      return;
    }
    createStoryMutation.mutate();
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className={styles.hiddenInput}
      />
      <div className={styles.actions}>
        {currentStep === 1 && (
          <Button accent className={styles.button} onClick={handleNextStep}>
            Продолжить
          </Button>
        )}

        {currentStep === totalSteps && (
          <Button accent className={styles.button} onClick={handleSubmit}>
            Отправить
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

// Placeholder components for each step
interface Step1ContentProps {
  eventValue: string | null;
  eventInput: string;
  onEventChange: (val: string | null) => void;
  onEventInputChange: (val: string) => void;
  eventOptions: Array<{ label: string; value: string }>;
  eventError?: string;
  title: string;
  description: string;
  onDescriptionChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const Step1Content: React.FC<Step1ContentProps> = ({
  eventValue,
  eventInput,
  onEventChange,
  onEventInputChange,
  eventOptions,
  eventError,
  title,
  description,
  onDescriptionChange,
}) => (
  <div className={styles.stepContent}>
    <span className={styles.stepTitle}>Заголовок и описание</span>
    <AutocompleteSelect
      label="Событие"
      placeholder="Выберите событие"
      options={eventOptions}
      value={eventValue || undefined}
      inputValue={eventInput}
      onChange={onEventChange}
      onInputChange={onEventInputChange}
      error={eventError}
    />
    <TextField
      label="Название"
      placeholder="Название"
      value={title}
      onChange={() => {}}
    />
    <TextField
      label="Описание"
      placeholder="Заполните поле"
      value={description}
      onChange={onDescriptionChange}
    />
  </div>
);

interface Step2ContentProps {
  uploadedImage: string | null;
  onImageDelete: () => void;
  onAddPhotoClick: () => void;
  colors: Array<{ id: string; name: string; color: string; textColor: string }>;
  onColorChange: (id: string) => void;
  titlePreview: string;
  descriptionPreview?: string;
  datePreview?: string;
  timePreview?: string;
}

const Step2Content: React.FC<Step2ContentProps> = ({
  uploadedImage,
  onImageDelete,
  onAddPhotoClick,
  colors,
  onColorChange,
  titlePreview,
  descriptionPreview,
  datePreview,
  timePreview,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // notify parent about default color
    if (colors[0]) onColorChange(colors[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Множитель скорости скролла
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCircleClick = (index: number) => {
    if (!isDragging) {
      setActiveIndex(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      handleCircleClick(index);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className={styles.stepContent3}>
      <div className={styles.stepContent3Item}>
        <span className={styles.stepTitle}>Превью</span>

        <StoriesCard
          title={titlePreview || "Название"}
          imageUrl={uploadedImage || "/avatars/1.webp"}
          image={!!uploadedImage}
          size="large"
          date={datePreview}
          time={timePreview}
          description={descriptionPreview}
          backgroundColor={colors[activeIndex]?.color}
          textColor={colors[activeIndex]?.textColor}
        />
      </div>

      <div className={styles.step3Buttom}>
        <div className={styles.swiperContainer}>
          <span className={styles.swiperTitle}>Цвет подложки</span>
          <ul
            className={styles.scrollContainer}
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            aria-label="Навигация по слайдам"
          >
            {colors.map((colorItem, index) => (
              <li key={colorItem.id}>
                <button
                  type="button"
                  className={`${styles.circle}`}
                  style={{
                    backgroundColor: colorItem.color,
                    transform:
                      index === activeIndex ? "scale(1.2)" : "scale(1)",
                  }}
                  onClick={() => {
                    handleCircleClick(index);
                    onColorChange(colorItem.id);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  aria-label={`Цвет ${colorItem.name}`}
                  tabIndex={0}
                >
                  {index === activeIndex && (
                    <div className={styles.tickIconWrapper}>
                      <TickCircleIcon size={24} color="#FFFFFF" />
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className={styles.uploadButton}
          onClick={uploadedImage ? onImageDelete : onAddPhotoClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              uploadedImage ? onImageDelete() : onAddPhotoClick();
            }
          }}
        >
          <GalleryAddIcon size={24} color="#ffffff" />
          <span className={styles.uploadButtonText}>
            {uploadedImage ? "Удалить фото" : "Добавить фото"}
          </span>
        </button>
      </div>
    </div>
  );
};
