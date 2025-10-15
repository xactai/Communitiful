import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/AppLayout";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageContainer className="justify-center">
      <div className="text-center space-y-6 p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm max-w-md mx-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full">
            <AlertTriangle size={24} className="text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-destructive">404</h1>
            <h2 className="text-lg sm:text-xl font-semibold">Page Not Found</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = "/"}
            className="w-full"
            size="touch"
          >
            <Home size={16} className="mr-2" />
            Return to Home
          </Button>
          
          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
