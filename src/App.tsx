import { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Main } from "./pages/Main";
import { useImmer } from "use-immer";
import { Entry } from "./types/generic";
import { CardListContext } from "./context/CardList";
import { Print } from "./pages/Print";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Main />
    ),
  },
  {
    path: "print",
    element: <Print />
  },
]);

export const App: FC = () => {
  const [cardList, setCardList] = useImmer<Entry[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <CardListContext.Provider value={{cardList, setCardList}}>
        <RouterProvider router={router} />
      </CardListContext.Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
