import { Button } from "@mantine/core";
import { FC } from "react";
import { resetSearch, setSearch } from "@/services/person/reducer";
import { Search } from "@/components/forms";
import * as Icons from "@assets/icons";
import classes from "@components/table/table.module.css";

type TPersonsTableToolbar = {
  isLoading: boolean;
  isDisabled?: boolean;
  openedAddForm?: () => void;
};

const PersonsTableToolbar: FC<TPersonsTableToolbar> = ({
  isLoading,
  openedAddForm: onClickToOpenAddForm,
}) => {
  return (
    <>
      <div className={classes.tableToolbar}>
        <div className={classes.flexGroup}>
          <Button.Group>
            <Button
              variant="light"
              color="green"
              leftSection={<Icons.IconPlus className={classes.icon} />}
              onClick={onClickToOpenAddForm}
              disabled={isLoading}
              m={0}
            >
              Добавить
            </Button>
            <Button
              variant="default"
              rightSection={<Icons.IconUpload className={classes.icon} />}
              disabled
              m={0}
            >
              Загрузить
            </Button>
            <Button
              variant="default"
              rightSection={<Icons.IconDownload className={classes.icon} />}
              disabled
              m={0}
            >
              Скачать
            </Button>
          </Button.Group>
          <Search
            query={setSearch}
            reset={resetSearch}
            isDisabled={isLoading}
          />
        </div>
        <div className={classes.flexGroup}>
          <Button
            variant="default"
            rightSection={<Icons.IconFliter className={classes.icon} />}
            disabled
          >
            Фильтры
          </Button>
        </div>
      </div>
    </>
  );
};

export default PersonsTableToolbar;
