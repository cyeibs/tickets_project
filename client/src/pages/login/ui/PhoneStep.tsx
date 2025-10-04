import React from 'react';
import { Button, PhoneInput } from '@shared/ui';
import styles from './LoginPage.module.scss';

interface PhoneStepProps {
  phone: string;
  error: string | null;
  isLoading: boolean;
  onPhoneChange: (value: string) => void;
  onContinue: () => void;
}

export const PhoneStep: React.FC<PhoneStepProps> = ({
  phone,
  error,
  isLoading,
  onPhoneChange,
  onContinue,
}) => {
  return (
    <>
      <PhoneInput
        value={phone}
        onChange={onPhoneChange}
        error={error || undefined}
      />
      <Button onClick={onContinue} disabled={isLoading} type="button">
        {isLoading ? 'Проверка...' : 'Продолжить'}
      </Button>
    </>
  );
};
