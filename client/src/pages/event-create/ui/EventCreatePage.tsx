import { TickCircleIcon } from "@/shared/assets/icons";
import { GalleryAddIcon } from "@/shared/assets/icons/gallerty-add";
import { EventSwiperCard } from "@/shared/ui/EventSwiperCard";
import {
  Button,
  EventCard,
  Pills,
  StepperHorizontal,
  Tab,
  TabGroup,
  TextField,
  AutocompleteSelect,
} from "@shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./EventCreatePage.module.scss";
import {
  isValidDateFormat,
  isPastDate,
  isValidTimeFormat,
  formatDateInput,
  formatTimeInput,
} from "@shared/lib";

export const EventCreatePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1 fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Step 2 fields
  const [dateStart, setDateStart] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [categoryValue, setCategoryValue] = useState<string | null>(null);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Validators
  const getTitleError = (value: string) => {
    if (!value) return null;
    return value.trim().length < 3 ? "Минимум 3 символа" : null;
  };

  const getDescriptionError = (value: string) => {
    if (!value) return null;
    return value.trim().length < 10 ? "Минимум 10 символов" : null;
  };

  const getDateError = (value: string) => {
    if (!value) return null; // show no error until user starts typing
    if (!isValidDateFormat(value)) return "Формат даты ДД.ММ.ГГГГ";
    if (isPastDate(value)) return "Дата не может быть в прошлом";
    return null;
  };

  const getTimeError = (value: string) => {
    if (!value) return null; // show no error until user starts typing
    return isValidTimeFormat(value) ? null : "Формат времени ЧЧ:ММ";
  };

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
            title={title}
            description={description}
            titleError={titleError || undefined}
            descriptionError={descriptionError || undefined}
            onTitleChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              setTitleError(getTitleError(next));
            }}
            onDescriptionChange={(e) => {
              const next = e.target.value;
              setDescription(next);
              setDescriptionError(getDescriptionError(next));
            }}
          />
        );
      case 2:
        return (
          <Step2Content
            dateStart={dateStart}
            timeStart={timeStart}
            dateError={dateError || undefined}
            timeError={timeError || undefined}
            onDateChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              const formatted = formatDateInput(digits);
              setDateStart(formatted);
              setDateError(getDateError(formatted));
            }}
            onTimeChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              const formatted = formatTimeInput(digits);
              setTimeStart(formatted);
              setTimeError(getTimeError(formatted));
            }}
            categoryValue={categoryValue}
            categoryInput={categoryInput}
            onCategoryChange={(val) => setCategoryValue(val)}
            onCategoryInputChange={(val) => setCategoryInput(val)}
          />
        );
      case 3:
        return (
          <Step3Content
            uploadedImage={uploadedImage}
            onImageDelete={handleImageDelete}
            onAddPhotoClick={handleAddPhotoClick}
          />
        );
      default:
        return (
          <Step1Content
            title={title}
            description={description}
            titleError={titleError || undefined}
            descriptionError={descriptionError || undefined}
            onTitleChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              setTitleError(getTitleError(next));
            }}
            onDescriptionChange={(e) => {
              const next = e.target.value;
              setDescription(next);
              setDescriptionError(getDescriptionError(next));
            }}
          />
        );
    }
  };

  const handleNextStep = () => {
    // Validate Step 1 (title & description)
    if (currentStep === 1) {
      const tErr = title.trim().length < 3 ? "Минимум 3 символа" : null;
      const dErr =
        description.trim().length < 10 ? "Минимум 10 символов" : null;
      setTitleError(tErr);
      setDescriptionError(dErr);
      if (tErr || dErr) return;
    }

    // Validate Step 2 (date & time)
    if (currentStep === 2) {
      let isValid = true;

      const dErr = dateStart
        ? getDateError(dateStart)
        : "Формат даты ДД.ММ.ГГГГ";
      const tErr = timeStart ? getTimeError(timeStart) : "Формат времени ЧЧ:ММ";
      setDateError(dErr);
      setTimeError(tErr);
      if (dErr) isValid = false;
      if (tErr) isValid = false;
      if (!isValid) return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSubmit = () => {
    toast(
      <Pills
        icon={TickCircleIcon}
        primaryText="Ивент успешно создан!"
        secondaryText="Ю-ху!"
        iconColor="#AFF940"
      />
    );
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
        {currentStep < totalSteps && (
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
  title: string;
  description: string;
  titleError?: string;
  descriptionError?: string;
  onTitleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onDescriptionChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const Step1Content: React.FC<Step1ContentProps> = ({
  title,
  description,
  titleError,
  descriptionError,
  onTitleChange,
  onDescriptionChange,
}) => (
  <div className={styles.stepContent}>
    <span className={styles.stepTitle}>Заголовок и описание</span>
    <TextField
      label="Название"
      placeholder="Заполните поле"
      value={title}
      onChange={onTitleChange}
      error={titleError}
    />
    <TextField
      label="Описание"
      placeholder="Заполните поле"
      value={description}
      onChange={onDescriptionChange}
      error={descriptionError}
    />
  </div>
);

interface Step2ContentProps {
  dateStart: string;
  timeStart: string;
  dateError?: string;
  timeError?: string;
  onDateChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onTimeChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  categoryValue: string | null;
  categoryInput: string;
  onCategoryChange: (val: string | null) => void;
  onCategoryInputChange: (val: string) => void;
}

const Step2Content: React.FC<Step2ContentProps> = ({
  dateStart,
  timeStart,
  dateError,
  timeError,
  onDateChange,
  onTimeChange,
  categoryValue,
  categoryInput,
  onCategoryChange,
  onCategoryInputChange,
}) => (
  <div className={styles.stepContent}>
    <span className={styles.stepTitle}>Заголовок и описание</span>
    <AutocompleteSelect
      label="Категория"
      placeholder="Заполните поле"
      options={[
        { label: "Музыка", value: "music" },
        { label: "Спорт", value: "sport" },
        { label: "Кино", value: "movie" },
        { label: "Театр", value: "theatre" },
        { label: "Образование", value: "education" },
      ]}
      value={categoryValue || undefined}
      inputValue={categoryInput}
      onChange={onCategoryChange}
      onInputChange={onCategoryInputChange}
    />
    <TextField
      label="Дата начала"
      placeholder="ДД.ММ.ГГГГ"
      value={dateStart}
      onChange={onDateChange}
      error={dateError}
      inputMode="numeric"
    />
    <TextField
      label="Время начала"
      placeholder="ЧЧ:ММ"
      value={timeStart}
      onChange={onTimeChange}
      error={timeError}
      inputMode="numeric"
    />
    <TextField label="Локация" placeholder="Заполните поле" />
    <TextField label="Количество мест" placeholder="Заполните поле" />
    <TextField label="Стоимость" placeholder="Заполните поле" />
  </div>
);

interface Step3ContentProps {
  uploadedImage: string | null;
  onImageDelete: () => void;
  onAddPhotoClick: () => void;
}

const Step3Content: React.FC<Step3ContentProps> = ({
  uploadedImage,
  onImageDelete,
  onAddPhotoClick,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"poster" | "swiper">("poster");

  // Определение цветов для кружков
  const colors = [
    {
      id: 1,
      color: "#AFF940",
      textColor: "#212C3A",
      name: "prime-accent-color",
    },
    { id: 2, color: "#BBBAFF", textColor: "#212C3A", name: "alt-accent-color" },
    { id: 3, color: "#FFBABA", textColor: "#212C3A", name: "light-pink" },
    { id: 4, color: "#FFD3BA", textColor: "#212C3A", name: "dark-peach" },
    { id: 5, color: "#FFD700", textColor: "#212C3A", name: "gold" },
    { id: 6, color: "#FFFDBA", textColor: "#212C3A", name: "lemon-cream" },
    { id: 7, color: "#C8FFBA", textColor: "#212C3A", name: "light-green" },
    { id: 8, color: "#BAFFE9", textColor: "#212C3A", name: "pang" },
    { id: 9, color: "#BAF5FF", textColor: "#212C3A", name: "blue-blue-frost" },
    { id: 10, color: "#CFBAFF", textColor: "#212C3A", name: "bright-lilac" },
    { id: 11, color: "#F9BAFF", textColor: "#212C3A", name: "pink" },
    {
      id: 12,
      color: "#212C3A",
      textColor: "#FFFFFF",
      name: "prime-dark-color",
    },
    // { id: 13, color: "#393940", textColor: "#FFFFFF", name: "sec-dark-color" },
  ];

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

        <TabGroup key="tabs" title="События" className={styles.tabsContainer}>
          <Tab
            key="poster"
            accent={activeTab === "poster"}
            onClick={() => setActiveTab("poster")}
          >
            Афишой
          </Tab>
          <Tab
            key="swiper"
            accent={activeTab === "swiper"}
            onClick={() => setActiveTab("swiper")}
          >
            Свайпер
          </Tab>
        </TabGroup>

        {activeTab === "poster" && (
          <EventCard
            key={`${activeTab}-${activeIndex}-${
              uploadedImage ? "img" : "noimg"
            }`}
            title="Название"
            date="18 июля"
            price="100"
            location="Москва"
            imageUrl={uploadedImage || "/avatars/1.webp"}
            image={!!uploadedImage}
            backgroundColor={colors[activeIndex]?.color}
            textColor={colors[activeIndex]?.textColor}
          />
        )}
        {activeTab === "swiper" && (
          <EventSwiperCard
            key={`${activeTab}-${activeIndex}-${
              uploadedImage ? "img" : "noimg"
            }`}
            title="Название"
            date="18 июля"
            price="100"
            location="Москва"
            imageUrl={uploadedImage || "/avatars/1.webp"}
            image={!!uploadedImage}
            backgroundColor={colors[activeIndex]?.color}
            textColor={colors[activeIndex]?.textColor}
          />
        )}
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
                  onClick={() => handleCircleClick(index)}
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
