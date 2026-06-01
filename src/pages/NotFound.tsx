import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Page Not Found — The Threshing Floor";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "The page you're looking for doesn't exist on The Threshing Floor. Return to the home page to continue.");
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Page Not Found — The Threshing Floor");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", "The page you're looking for doesn't exist on The Threshing Floor.");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", window.location.href);
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Page Not Found — The Threshing Floor</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="text-primary underline hover:text-primary/90" aria-label="Return to The Threshing Floor home page">
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
