import { TextField } from "@/shared/ui";
import styles from "./FiltersPage.module.scss";

export const FiltersPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.actions}>
          <TextField label="Город" placeholder="Заполните поле" />
          <TextField label="Дата" placeholder="Заполните поле" />
        </div>
      </div>
    </div>
  );
};
