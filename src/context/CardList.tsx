import { createContext } from "react";
import { Entry } from "../types/generic";
import { Updater } from "use-immer";

export type GlobalContent = {
  cardList: Entry[];
  setCardList: Updater<Entry[]>
}

export const MyGlobalContext = createContext<GlobalContent>({
  cardList: [], // set a default value

})