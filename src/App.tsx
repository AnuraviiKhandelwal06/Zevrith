import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { InvestigationSessionProvider } from "./hooks/useInvestigationSession";
import Home from "./pages/Home";
import Results from "./pages/Results";
import History from "./pages/History";
import Methodology from "./pages/Methodology";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <InvestigationSessionProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="results" element={<Results />} />
            <Route path="history" element={<History />} />
            <Route path="methodology" element={<Methodology />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </InvestigationSessionProvider>
    </BrowserRouter>
  );
}
