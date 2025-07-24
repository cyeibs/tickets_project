import React from "react";
import { CheckIcon } from "@shared/assets/icons";
import styles from "./StepperHorizontal.module.scss";

export interface StepperHorizontalProps {
  steps: number;
  currentStep: number;
  labels?: string[];
  className?: string;
  onStepClick?: (step: number) => void;
}

export const StepperHorizontal: React.FC<StepperHorizontalProps> = ({
  steps,
  currentStep,
  labels,
  className,
  onStepClick,
}) => {
  const handleStepClick = (step: number) => {
    if (onStepClick && step <= currentStep + 1) {
      onStepClick(step);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, step: number) => {
    if (
      (e.key === "Enter" || e.key === " ") &&
      step <= currentStep + 1 &&
      onStepClick
    ) {
      onStepClick(step);
    }
  };

  return (
    <div className={`${styles.stepper} ${className || ""}`}>
      {/* Connectors */}
      {Array.from({ length: steps - 1 }, (_, index) => {
        const isPrevious = index + 2 <= currentStep;
        return (
          <div
            key={`connector-${index + 1}`}
            className={`${styles.connector} ${
              isPrevious ? styles.connectorCompleted : ""
            }`}
            style={{
              left: `calc(${(index / (steps - 1)) * 100}% + 16px)`,
              right: `calc(${100 - ((index + 1) / (steps - 1)) * 100}% + 16px)`,
            }}
          />
        );
      })}

      {/* Steps */}
      {Array.from({ length: steps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isPrevious = stepNumber < currentStep;
        const isClickable = stepNumber <= currentStep + 1;

        return (
          <div key={`step-${stepNumber}`} className={styles.stepContainer}>
            <button
              className={`${styles.step} ${isActive ? styles.active : ""} ${
                isPrevious ? styles.completed : ""
              }`}
              onClick={() => isClickable && handleStepClick(stepNumber)}
              onKeyDown={(e) => handleKeyDown(e, stepNumber)}
              disabled={!isClickable}
              aria-label={`Step ${stepNumber}${
                labels?.[index] ? `: ${labels[index]}` : ""
              }`}
              type="button"
            >
              {isPrevious ? (
                <CheckIcon size={24} color="#23222A" />
              ) : (
                <span>
                  {stepNumber < 10 && labels?.length ? "" : "0"}
                  {stepNumber}
                </span>
              )}
            </button>
            {labels && labels[index] && (
              <div
                className={`${styles.label} ${
                  isActive ? styles.activeLabel : ""
                }`}
              >
                {labels[index]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
