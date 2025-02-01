import { Button } from "@mantine/core";
import { FC, ReactNode } from "react";
import * as Icons from "@assets/icons";
import classes from "./table-toolbar.module.css";

type TButtons = {
  addButton: boolean;
  downloadButton: boolean;
  uploadButton: boolean;
  filterButton: boolean;
};

type TDisabledButtons = {
  addButton?: boolean;
  downloadButton?: boolean;
  uploadButton?: boolean;
  filterButton?: boolean;
};

type TTableToolbar = {
  isLoading: boolean;
  buttons: TButtons;
  disabledButtons?: TDisabledButtons;
  openedSaveForm?: () => void;
  openedFiltersForm?: () => void;
  search?: ReactNode;
};

const TableToolbar: FC<TTableToolbar> = ({
  isLoading,
  openedSaveForm,
  openedFiltersForm,
  buttons,
  disabledButtons,
  search,
}) => {
  const addButton = buttons.addButton && (
    <Button
      variant="light"
      color="green"
      leftSection={<Icons.IconPlus className={classes.icon} />}
      onClick={openedSaveForm}
      disabled={isLoading || disabledButtons?.addButton}
      m={0}
      title="Добавить"
    >
      Добавить
    </Button>
  );

  const downloadButton = buttons.downloadButton && (
    <Button
      variant="default"
      rightSection={<Icons.IconUpload className={classes.icon} />}
      disabled={disabledButtons?.downloadButton}
      m={0}
    >
      Загрузить
    </Button>
  );

  const uploadButton = buttons.uploadButton && (
    <Button
      variant="default"
      rightSection={<Icons.IconDownload className={classes.icon} />}
      disabled={disabledButtons?.uploadButton}
      m={0}
    >
      Скачать
    </Button>
  );

  const isLeftButtonsGroup = Object.values(buttons).some(
    (value) => value === true
  );

  const leftButtonsGroup = isLeftButtonsGroup && (
    <Button.Group>
      {addButton}
      {downloadButton}
      {uploadButton}
    </Button.Group>
  );

  const filterButton = buttons.filterButton && (
    <Button
      variant="outline"
      rightSection={<Icons.IconFliter className={classes.icon} />}
      disabled={disabledButtons?.filterButton}
      onClick={openedFiltersForm}
    >
      Фильтры
    </Button>
  );

  const isRightButtonsGroup = Object.values(buttons).some(
    (value) => value === true
  );

  const rightButtonsGroup = isRightButtonsGroup && (
    <Button.Group>{filterButton}</Button.Group>
  );

  return (
    <>
      <div className={classes.tableToolbar}>
        <div className={classes.leftSection}>
          {leftButtonsGroup}
          {search}
        </div>
        <div className={classes.rightSection}>{rightButtonsGroup}</div>
      </div>
    </>
  );
};

export default TableToolbar;
