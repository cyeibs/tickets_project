import { AutocompleteSelect, Button, TextField } from "@/shared/ui";
import { useEffect, useMemo, useState } from "react";
import { formatDateInput, isValidDateFormat, isPastDate } from "@shared/lib";
import styles from "./FiltersPage.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const FiltersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const [cityValue, setCityValue] = useState<string | null>(
    urlParams.get("cityId")
  );
  const [cityInput, setCityInput] = useState<string>("");
  const [date, setDate] = useState<string>(urlParams.get("date") || "");
  const [dateError, setDateError] = useState<string | undefined>(undefined);

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => userApi.getCities(),
  });

  useEffect(() => {
    setCityValue(urlParams.get("cityId"));
    setDate(urlParams.get("date") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

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

  const applyFilters = () => {
    const params = new URLSearchParams(location.search);
    if (cityValue) params.set("cityId", cityValue);
    else params.delete("cityId");
    if (date) params.set("date", date);
    else params.delete("date");
    navigate({ pathname: "/search", search: params.toString() });
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.actions}>
          <AutocompleteSelect
            label="Город"
            placeholder="Заполните поле"
            options={cities.map((c) => ({ label: c.name, value: c.id }))}
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
      <div className={styles.profileContainer}>
        <div className={styles.actions}>
          <Button accent className={styles.button} onClick={applyFilters}>
            Применить фильтры
          </Button>
        </div>
      </div>
    </div>
  );
};
