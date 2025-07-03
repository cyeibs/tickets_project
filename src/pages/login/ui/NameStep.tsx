import React from 'react';
import { Button, TextField } from '@shared/ui';
import styles from './LoginPage.module.scss';

interface NameStepProps {
  name: string;
  error: string | null;
  isLoading: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NameStep: React.FC<NameStepProps> = ({
  name,
  error,
  isLoading,
  onNameChange,
  onSave,
  onCancel,
}) => {
  return (
    <>
      <TextField
        label="ФИО"
        placeholder="Женя Антонова"
        value={name}
        onChange={onNameChange}
        error={error || undefined}
      />
      <div className={styles.buttonGroup}>
        <Button onClick={onSave} disabled={isLoading} type="button" accent>
          Сохранить
        </Button>
        <Button onClick={onCancel} type="button">
          Отменить
        </Button>
      </div>
    </>
  );
};
