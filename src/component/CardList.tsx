import { List, ListItem, ListItemDecorator, Typography } from "@mui/joy";
import { FC, useState } from "react"
import { Symbol } from "./Mana";
import { NumericCounter } from "./NumericCounter";

interface CardListProps {
  readonly data: any[]
}

export const CardList: FC<CardListProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(4);
  return (
    <List>
      <ListItem sx={{
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <div>
          <NumericCounter value={quantity} setValue={setQuantity} slots={{ box: {
            display: 'inline-block'
          }}} />
          {/* <NumericCounter /> */}
          <Typography display="inline-block" level="title-sm" fontFamily="Beleren"> Ball Lightning</Typography>
        </div>
        <ListItemDecorator>
          <Symbol kind={"R"} />
          <Symbol kind={"R"} />
          <Symbol kind={"R"} />
        </ListItemDecorator>
      </ListItem>
    </List>
  );
};
