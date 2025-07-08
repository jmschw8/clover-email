import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./api/queryClient";
import EmailDashboard from "./features/email/EmailDashboard";
import Navbar from "./components/global/Navbar";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<Navbar />
				<EmailDashboard />
			</QueryClientProvider>
		</StrictMode>
	);
}
