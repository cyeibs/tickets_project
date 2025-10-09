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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./EventEditPage.module.scss";
import {
  isValidDateFormat,
  isPastDate,
  isValidTimeFormat,
  formatDateInput,
  formatTimeInput,
  parseDate,
} from "@shared/lib";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { useAuth } from "@/features/auth";

export const EventEditPage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // load event
  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    enabled: !!eventId,
    queryFn: () => userApi.getEventById(eventId as string),
  });

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
  const [cityValue, setCityValue] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState<string>("");
  const [location, setLocation] = useState("");
  const [maxQuantity, setMaxQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const navigate = useNavigate();
  // Dictionaries
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => userApi.getCategories(),
  });
  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => userApi.getCities(),
  });
  const { data: colorsDict = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: () => userApi.getColors(),
  });

  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  // Prefill when event loads
  useEffect(() => {
    if (!event) return;
    setTitle(event.title || "");
    setDescription(event.description || "");
    // dd.mm.yyyy already in event.date; store as raw formatted
    setDateStart(event.date || "");
    setTimeStart(event.time || "");
    setCategoryValue(event.raw.categoryId);
    setCityValue(event.raw.cityId);
    setLocation(event.location || "");
    setMaxQuantity(String(event.raw.maxQuantity ?? ""));
    setPrice(String(event.price ?? ""));
    setSelectedColorId(event.raw.colorId);
    if (event.imageUrl) setUploadedImage(event.imageUrl);
  }, [event]);

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
    setUploadedFile(null);
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
              const digits = e.target.value.replace(/[^\d:]/g, "");
              const formatted = formatTimeInput(digits);
              setTimeStart(formatted);
              setTimeError(getTimeError(formatted));
            }}
            categoryValue={categoryValue}
            categoryInput={categoryInput}
            onCategoryChange={(val) => {
              setCategoryValue(val);
              setCategoryError(null);
            }}
            onCategoryInputChange={(val) => setCategoryInput(val)}
            categoryOptions={categories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
            categoryError={categoryError || undefined}
            cityValue={cityValue}
            cityInput={cityInput}
            onCityChange={(val) => {
              setCityValue(val);
              setCityError(null);
            }}
            onCityInputChange={(val) => setCityInput(val)}
            cityOptions={cities.map((c) => ({ label: c.name, value: c.id }))}
            cityError={cityError || undefined}
            locationValue={location}
            onLocationChange={(e) => {
              setLocation(e.target.value);
              setLocationError(null);
            }}
            locationError={locationError || undefined}
            maxQuantity={maxQuantity}
            onMaxQuantityChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setMaxQuantity(digits);
              const num = Number(digits);
              setQuantityError(
                !digits || num <= 0 ? "Укажите кол-во мест (>0)" : null
              );
            }}
            maxQuantityError={quantityError || undefined}
            price={price}
            onPriceChange={(e) => {
              const digits = e.target.value.replace(/[^\d.]/g, "");
              const normalized = digits.replace(/\.(?=.*\.)/g, "");
              setPrice(normalized);
              const num = Number(normalized);
              setPriceError(
                !normalized || num <= 0 ? "Укажите стоимость (>0)" : null
              );
            }}
            priceError={priceError || undefined}
          />
        );
      case 3:
        return (
          <Step3Content
            uploadedImage={uploadedImage}
            onImageDelete={handleImageDelete}
            onAddPhotoClick={() => fileInputRef.current?.click()}
            colors={colorsDict}
            onColorChange={(id) => setSelectedColorId(id)}
            titlePreview={title}
            datePreview={(() => {
              const d = parseDate(dateStart);
              if (!d || !timeStart) return undefined;
              const dd = String(d.getDate()).padStart(2, "0");
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const yyyy = d.getFullYear();
              return `${dd}.${mm}.${yyyy} в ${timeStart}`;
            })()}
            pricePreview={price ? `${Number(price).toFixed(0)}₽` : undefined}
            locationPreview={location || undefined}
          />
        );
      default:
        return null;
    }
  };

  const handleNextStep = () => {
    // Validate Step 1
    if (currentStep === 1) {
      const tErr = title.trim().length < 3 ? "Минимум 3 символа" : null;
      const dErr =
        description.trim().length < 10 ? "Минимум 10 символов" : null;
      setTitleError(tErr);
      setDescriptionError(dErr);
      if (tErr || dErr) return;
    }

    // Validate Step 2 basic fields (date & time)
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

    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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

  const updateEventMutation = useMutation({
    mutationFn: async () => {
      if (!user?.organizationId) {
        throw new Error("Доступно только организаторам");
      }
      if (!eventId) throw new Error("Некорректный id события");

      let posterId: string | undefined | null = undefined;
      if (uploadedFile) {
        const uploaded = await userApi.uploadFile(uploadedFile);
        posterId = uploaded.id;
      } else if (uploadedImage === null) {
        // if user removed image
        posterId = null;
      }

      const d = parseDate(dateStart);
      if (!d) throw new Error("Некорректная дата");
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const eventDate = `${yyyy}-${mm}-${dd}`;

      const payload: any = {
        organizationId: user.organizationId,
        name: title.trim(),
        description: description.trim() || undefined,
        categoryId: categoryValue as string,
        cityId: cityValue as string,
        eventDate,
        startTime: timeStart,
        location: location.trim(),
        maxQuantity: Number(maxQuantity),
        price: Number(price),
        colorId: (selectedColorId || colorsDict[0]?.id) as string,
      };
      if (posterId !== undefined) payload.posterId = posterId;

      return await userApi.updateEvent(eventId, payload);
    },
    onSuccess: () => {
      toast(
        <Pills
          icon={TickCircleIcon}
          primaryText="Ивент обновлен!"
          secondaryText="Готово"
          iconColor="#AFF940"
        />
      );
      navigate(-1);
    },
    onError: (e: any) => {
      toast.error(e?.message || "Ошибка при обновлении события");
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError("Заполните название");
      setCurrentStep(1);
      return;
    }
    if (!categoryValue) {
      setCategoryError("Выберите категорию");
      setCurrentStep(2);
      return;
    }
    if (!cityValue) {
      setCityError("Выберите город");
      setCurrentStep(2);
      return;
    }
    if (!location.trim()) {
      setLocationError("Укажите локацию");
      setCurrentStep(2);
      return;
    }
    if (!maxQuantity || Number(maxQuantity) <= 0) {
      setQuantityError("Укажите кол-во мест (>0)");
      setCurrentStep(2);
      return;
    }
    if (!price || Number(price) <= 0) {
      setPriceError("Укажите стоимость (>0)");
      setCurrentStep(2);
      return;
    }
    updateEventMutation.mutate();
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
            Сохранить
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
  categoryOptions: Array<{ label: string; value: string }>;
  categoryError?: string;
  cityValue: string | null;
  cityInput: string;
  onCityChange: (val: string | null) => void;
  onCityInputChange: (val: string) => void;
  cityOptions: Array<{ label: string; value: string }>;
  cityError?: string;
  locationValue: string;
  onLocationChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  locationError?: string;
  maxQuantity: string;
  onMaxQuantityChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  maxQuantityError?: string;
  price: string;
  onPriceChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  priceError?: string;
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
  categoryOptions,
  categoryError,
  cityValue,
  cityInput,
  onCityChange,
  onCityInputChange,
  cityOptions,
  cityError,
  locationValue,
  onLocationChange,
  locationError,
  maxQuantity,
  onMaxQuantityChange,
  maxQuantityError,
  price,
  onPriceChange,
  priceError,
}) => (
  <div className={styles.stepContent}>
    <span className={styles.stepTitle}>Параметры события</span>
    <AutocompleteSelect
      label="Категория"
      placeholder="Заполните поле"
      options={categoryOptions}
      value={categoryValue || undefined}
      inputValue={categoryInput}
      onChange={onCategoryChange}
      onInputChange={onCategoryInputChange}
      error={categoryError}
    />
    <AutocompleteSelect
      label="Город"
      placeholder="Заполните поле"
      options={cityOptions}
      value={cityValue || undefined}
      inputValue={cityInput}
      onChange={onCityChange}
      onInputChange={onCityInputChange}
      error={cityError}
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
    <TextField
      label="Локация"
      placeholder="Заполните поле"
      value={locationValue}
      onChange={onLocationChange}
      error={locationError}
    />
    <TextField
      label="Количество мест"
      placeholder="Заполните поле"
      value={maxQuantity}
      onChange={onMaxQuantityChange}
      error={maxQuantityError}
      inputMode="numeric"
    />
    <TextField
      label="Стоимость"
      placeholder="Заполните поле"
      value={price}
      onChange={onPriceChange}
      error={priceError}
      inputMode="decimal"
    />
  </div>
);

interface Step3ContentProps {
  uploadedImage: string | null;
  onImageDelete: () => void;
  onAddPhotoClick: () => void;
  colors: Array<{ id: string; name: string; color: string; textColor: string }>;
  onColorChange: (id: string) => void;
  titlePreview: string;
  datePreview?: string;
  pricePreview?: string;
  locationPreview?: string;
}

const Step3Content: React.FC<Step3ContentProps> = ({
  uploadedImage,
  onImageDelete,
  onAddPhotoClick,
  colors,
  onColorChange,
  titlePreview,
  datePreview,
  pricePreview,
  locationPreview,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"poster" | "swiper">("poster");

  const activeColor = colors[activeIndex];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCircleClick = (index: number) => {
    if (!isDragging) {
      setActiveIndex(index);
      const color = colors[index];
      if (color) onColorChange(color.id);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") handleCircleClick(index);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
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
            title={titlePreview || "Название"}
            date={datePreview}
            price={pricePreview}
            location={locationPreview}
            imageUrl={uploadedImage || "/avatars/1.webp"}
            image={!!uploadedImage}
            backgroundColor={activeColor?.color}
            textColor={activeColor?.textColor}
          />
        )}
        {activeTab === "swiper" && (
          <EventSwiperCard
            key={`${activeTab}-${activeIndex}-${
              uploadedImage ? "img" : "noimg"
            }`}
            title={titlePreview || "Название"}
            date={datePreview}
            price={pricePreview}
            location={locationPreview}
            imageUrl={uploadedImage || "/avatars/1.webp"}
            image={!!uploadedImage}
            backgroundColor={activeColor?.color}
            textColor={activeColor?.textColor}
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
