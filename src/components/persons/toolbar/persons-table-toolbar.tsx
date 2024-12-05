import { Button, ButtonGroup } from "@mantine/core";
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { Search } from "@/components/search/search";
import { resetSearch, setSearch } from "@/services/person/reducer";
import { FC } from "react";
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
      <div className={classes.table_toolbar}>
        <div className={classes.flexGroup}>
          <ButtonGroup>
            <Button
              variant="light"
              color="green"
              leftSection={<IconPlus size={14} />}
              onClick={onClickToOpenAddForm}
              disabled={isLoading}
            >
              Добавить
            </Button>
            <Button
              variant="default"
              rightSection={<IconUpload size={14} />}
              disabled
            >
              Загрузить
            </Button>
            <Button
              variant="default"
              rightSection={<IconDownload size={14} />}
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
            rightSection={<IconFilter size={14} />}
            disabled
          >
            Фильтры
          </Button>
        </div>
      </div>
    </>
  );
};
