import { Anchor, Badge, Collapse, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./collapsed-list.module.css";

type TCollapsedList<T> = {
  data: T[];
  limit: number;
  field: keyof T;
};

const CollapsedList = <T extends Record<string, any>>({
  data,
  limit,
  field,
}: TCollapsedList<T>) => {
  const [opened, { toggle }] = useDisclosure(false);
  if (!data.length) return "-";

  const length = data.length;

  const count = !opened && length > 1 && (
    <div className={classes.count}>
      <Tooltip label="Количество в списке">
        <Badge size="md" variant="default">
          {length}
        </Badge>
      </Tooltip>
    </div>
  );

  const more = length > limit && (
    <Anchor onClick={toggle}>{!opened ? "[развернуть]" : "[свернуть]"}</Anchor>
  );

  const list = (
    <div className={classes.collapsed}>
      <div>
        <ul className={classes.list}>
          {data.slice(0, limit).map((item, index) => (
            <li key={index}>{item[field]}</li>
          ))}
          <Collapse
            in={opened}
            transitionDuration={300}
            transitionTimingFunction="linear"
          >
            {data.slice(limit, 100).map((item, index) => (
              <li key={index}>{item[field]}</li>
            ))}
          </Collapse>
        </ul>
        {more}
      </div>
      {count}
    </div>
  );

  return list;
};

export default CollapsedList;
