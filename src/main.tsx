import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import './index.css';
import { Route } from "wouter";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Route path="/"><App /></Route>
			<Route path="/print"><div>print</div></Route>
			
			<ReactQueryDevtools />
		</QueryClientProvider>
	</React.StrictMode>
);
