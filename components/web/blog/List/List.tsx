import {
  ListBlock,
  ListItem as ListItemData,
  NestedList,
  Typography,
} from "@/lib/schemas/blocks";

import { InlineContent } from "../InlineContent";
import { itemVariants, listVariants } from "./variants";

type ListDecoration = Typography["textDecoration"];

type ListRootProps = {
  ordered: boolean;
  items: ListItemData[];
  decoration: ListDecoration;
  nested?: boolean;
};

function ListRoot({
  ordered,
  items,
  decoration,
  nested = false,
}: ListRootProps) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag className={listVariants({ ordered, nested, decoration })}>
      {items.map((item, index) => (
        <ListItem key={index} item={item} decoration={decoration} />
      ))}
    </Tag>
  );
}

type ListItemProps = {
  item: ListItemData;
  decoration: ListDecoration;
};

function ListItem({ item, decoration }: ListItemProps) {
  return (
    <li className={itemVariants({ decoration })}>
      {item.content.length > 0 ? <InlineContent nodes={item.content} /> : null}
      {item.nested ? (
        <NestedListRoot list={item.nested} decoration={decoration} />
      ) : null}
    </li>
  );
}

function NestedListRoot({
  list,
  decoration,
}: {
  list: NestedList;
  decoration: ListDecoration;
}) {
  return (
    <ListRoot
      ordered={list.ordered}
      items={list.items}
      decoration={decoration}
      nested
    />
  );
}

type ListProps = {
  block: ListBlock;
};

export function List({ block }: ListProps) {
  return (
    <ListRoot
      ordered={block.ordered}
      items={block.items}
      decoration={block.typography.textDecoration}
    />
  );
}
