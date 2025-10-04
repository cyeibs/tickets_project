import { AutocompleteSelect, TextField } from "@/shared/ui";
import { useState } from "react";
import { formatDateInput, isValidDateFormat, isPastDate } from "@shared/lib";
import styles from "./FiltersPage.module.scss";

export const FiltersPage = () => {
  const [cityValue, setCityValue] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [dateError, setDateError] = useState<string | undefined>(undefined);

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const digits = e.target.value.replace(/\D/g, "");
    const formatted = formatDateInput(digits);
    setDate(formatted);

    if (!formatted) {
      setDateError(undefined);
      return;
    }
    if (!isValidDateFormat(formatted)) {
      setDateError("Формат даты ДД.ММ.ГГГГ");
      return;
    }
    if (isPastDate(formatted)) {
      setDateError("Дата не может быть в прошлом");
      return;
    }
    setDateError(undefined);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.actions}>
          <AutocompleteSelect
            label="Город"
            placeholder="Заполните поле"
            options={[
              { label: "Москва", value: "moscow" },
              { label: "Санкт-Петербург", value: "spb" },
              { label: "Казань", value: "kazan" },
              { label: "Екатеринбург", value: "ekb" },
              { label: "Новосибирск", value: "novosibirsk" },
            ]}
            value={cityValue || undefined}
            inputValue={cityInput}
            onChange={setCityValue}
            onInputChange={setCityInput}
          />
          <TextField
            label="Дата"
            placeholder="ДД.ММ.ГГГГ"
            value={date}
            onChange={handleDateChange}
            error={dateError}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
};
