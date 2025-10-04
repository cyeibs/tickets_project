import React, { useState } from "react";
import { Button, StepperHorizontal, TextField } from "@shared/ui";
import styles from "./GetRightsPage.module.scss";
import { useNavigate } from "react-router-dom";

export const GetRightsPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const navigate = useNavigate();

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Content />;
      case 2:
        return <Step2Content />;
      default:
        return <Step1Content />;
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
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
          <Button accent className={styles.button} onClick={handleNextStep}>
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
    <TextField label="Название" placeholder="Заполните поле" />
    <TextField label="Описание" placeholder="Заполните поле" />
    <TextField label="Телефон" placeholder="Заполните поле" />
    <TextField label="Соц. сети" placeholder="Заполните поле" />
  </div>
);

const Step2Content = () => (
  <div className={styles.stepContent}>
    <TextField label="ИНН" placeholder="Заполните поле" />
    <TextField label="ОГРН" placeholder="Заполните поле" />
    <TextField label="КПП" placeholder="Заполните поле" />
    <TextField label="Лицензия" placeholder="Заполните поле" />
  </div>
);
