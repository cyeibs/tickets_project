import { TickCircleIcon } from "@/shared/assets/icons";
import { GalleryAddIcon } from "@/shared/assets/icons/gallerty-add";
import { StoriesCard } from "@/shared/ui/StoriesCard";
import { Button, Pills, StepperHorizontal, TextField } from "@shared/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./StoryCreatePage.module.scss";

export const StoryCreatePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

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
        return <Step1Content />;
      case 2:
        return (
          <Step2Content
            uploadedImage={uploadedImage}
            onImageDelete={handleImageDelete}
            onAddPhotoClick={handleAddPhotoClick}
          />
        );
      default:
        return <Step1Content />;
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    toast(
      <Pills
        icon={TickCircleIcon}
        primaryText="История успешно создана!"
        secondaryText="Ю-ху!"
        iconColor="#AFF940"
      />
    );
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
const Step1Content = () => (
  <div className={styles.stepContent}>
    <span className={styles.stepTitle}>Заголовок и описание</span>
    <TextField label="Заголовок" placeholder="Заполните поле" />
    <TextField label="Описание" placeholder="Заполните поле" />
  </div>
);

interface Step2ContentProps {
  uploadedImage: string | null;
  onImageDelete: () => void;
  onAddPhotoClick: () => void;
}

const Step2Content: React.FC<Step2ContentProps> = ({
  uploadedImage,
  onImageDelete,
  onAddPhotoClick,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

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

        <StoriesCard
          title="Название"
          imageUrl={uploadedImage || "/avatars/1.webp"}
          image={!!uploadedImage}
          size="large"
          description="Небольшое описание в одну строку, которое обр...Небольшое описание в одну строку, которое обр..."
          date="18 июля"
          time="18:00"
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
