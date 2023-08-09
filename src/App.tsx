import { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Route } from "wouter";
import { Main } from "./pages/Main";
import { useImmer } from "use-immer";
import { Entry } from "./types/generic";
import { CardListContext } from "./context/CardList";
import { Print } from "./pages/Print";

const queryClient = new QueryClient();

export const App: FC = () => {
  const [cardList, setCardList] = useImmer<Entry[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <CardListContext.Provider value={{cardList, setCardList}}>
        <Route path="/">
          <Main />
        </Route>
        <Route path="/print">
          <Print />
        </Route>
      </CardListContext.Provider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
