import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Music from "./pages/Music";
import NotFound from "./pages/NotFound";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { PersistentPlayerBar } from "@/components/music/PersistentPlayerBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MusicPlayerProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/music" element={<Music />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PersistentPlayerBar />
        </MusicPlayerProvider>
      </Toaster>
    </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
