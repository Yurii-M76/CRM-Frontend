import { Button, ButtonGroup } from "@mantine/core";
import { FC } from "react";
import { Search } from "@/components/search/search";
import { resetSearch, setSearch } from "@/services/person/reducer";
import * as Icons from "../../../assets/icons";
import classes from "@components/table/table.module.css";

type TPersonsTableToolbar = {
  isLoading: boolean;
  isDisabled: boolean;
  openedAddForm?: () => void;
};

export const PersonsTableToolbar: FC<TPersonsTableToolbar> = ({
  isLoading,
  isDisabled,
  openedAddForm: onClickToOpenAddForm,
}) => {
  return (
    <>
      <div className={classes.tableToolbar}>
        <div className={classes.flexGroup}>
          <ButtonGroup>
            <Button
              variant="light"
              color="green"
              leftSection={<Icons.IconPlus className={classes.icon} />}
              onClick={onClickToOpenAddForm}
              disabled={isLoading}
            >
              Добавить
            </Button>
            <Button
              variant="default"
              rightSection={<Icons.IconUpload className={classes.icon} />}
              disabled
            >
              Загрузить
            </Button>
            <Button
              variant="default"
              rightSection={<Icons.IconDownload className={classes.icon} />}
              disabled
            >
              Скачать
            </Button>
          </ButtonGroup>
          <Search
            query={setSearch}
            reset={resetSearch}
            isDisabled={isDisabled}
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
