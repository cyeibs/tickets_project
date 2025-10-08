import React, { useRef, useEffect } from "react";
import Stories from "react-insta-stories";
import styles from "./StoriesModal.module.scss";
import type { CompanyStories } from "../../../stories/model/types";

interface StoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyStories[];
  currentCompanyIndex: number;
  setCurrentCompanyIndex: (index: number) => void;
}

export const StoriesModal: React.FC<StoriesModalProps> = ({
  isOpen,
  onClose,
  companies,
  currentCompanyIndex,
  setCurrentCompanyIndex,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Focus the modal when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleGlobalKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.storiesOverlay}
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Stories viewer"
    >
      <div ref={modalRef} className={styles.storiesModal} tabIndex={-1}>
        <Stories
          defaultInterval={4001}
          width="100%"
          preloadCount={3}
          height="100%"
          progressContainerStyles={{
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
          loop
          keyboardNavigation
          stories={companies[currentCompanyIndex].stories}
          onAllStoriesEnd={() => {
            if (currentCompanyIndex < companies.length - 1) {
              setCurrentCompanyIndex(currentCompanyIndex + 1);
            } else {
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
};
