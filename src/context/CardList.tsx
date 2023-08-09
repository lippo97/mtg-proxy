import { createContext } from "react";
import { Entry } from "../types/generic";
import { Updater } from "use-immer";

export type CardListContextType = {
  cardList: Entry[];
  setCardList: Updater<Entry[]>
}

export const CardListContext = createContext<CardListContextType | undefined>(undefined);