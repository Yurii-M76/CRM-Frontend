import { Anchor, Badge, Collapse, Tooltip, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./collapsed-list.module.css";

type TCollapsedList<T> = {
  data: T[];
  limit: number;
  field: keyof T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CollapsedList = <T extends Record<string, any>>({
  data,
  limit,
  field,
}: TCollapsedList<T>) => {
  const [opened, { toggle }] = useDisclosure(false);
  if (!data.length) return "-";

  const length = data.length;

  const count = !opened && length > limit && (
    <div className={classes.countBadge}>
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
          <Box w={length > limit ? 168 : "100%"}>
            <li>{data[0][field]}</li>
          </Box>
          {data.slice(1, limit).map((item, index) => (
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
