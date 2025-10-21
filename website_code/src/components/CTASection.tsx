import { Button } from "@/components/ui/button";
import { Building2, Bell, ArrowRight, Heart } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy-primary mb-6">
            Bring Comfort to{" "}
            <span className="text-success-green">Every Waiting Room</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Join healthcare institutions worldwide in transforming the waiting experience 
            from isolation to connection, from anxiety to comfort.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* For Hospitals */}
          <div className="gradient-card p-8 lg:p-12 rounded-3xl shadow-card hover:shadow-float transition-smooth animate-fade-in-up group">
            <div className="bg-navy-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce">
              <Building2 className="h-8 w-8 text-navy-primary" />
            </div>
            
            <h3 className="font-heading text-2xl font-semibold text-navy-primary mb-4">
              For Healthcare Institutions
            </h3>
            
            <p className="text-text-secondary mb-8 leading-relaxed">
              Enhance your patient experience with our empathy-driven solution. 
              Show families you care about their emotional well-being, not just treatment.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-navy-primary rounded-full"></div>
                <span className="text-text-secondary">Easy QR code implementation</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-navy-primary rounded-full"></div>
                <span className="text-text-secondary">Improved satisfaction scores</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-navy-primary rounded-full"></div>
                <span className="text-text-secondary">HIPAA compliant & secure</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-navy-primary rounded-full"></div>
                <span className="text-text-secondary">Real-time analytics dashboard</span>
              </li>
            </ul>
            
            <Button variant="default" size="lg" className="w-full group">
              <Building2 className="h-5 w-5" />
              Partner With Us
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* For Individuals */}
          <div className="gradient-card p-8 lg:p-12 rounded-3xl shadow-card hover:shadow-float transition-smooth animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
            <div className="bg-success-green/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce">
              <Heart className="h-8 w-8 text-success-green" />
            </div>
            
            <h3 className="font-heading text-2xl font-semibold text-navy-primary mb-4">
              For Patient Companions
            </h3>
            
            <p className="text-text-secondary mb-8 leading-relaxed">
              Be the first to know when Companions Anonymous arrives at hospitals in your area. 
              Never wait alone again.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-text-secondary">Early access notifications</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-text-secondary">Tips for waiting room wellness</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-text-secondary">Community support resources</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-text-secondary">Share your story</span>
              </li>
            </ul>
            
            <Button variant="success" size="lg" className="w-full group">
              <Bell className="h-5 w-5" />
              Stay Updated
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-neutral-light px-8 py-4 rounded-full shadow-soft">
            <Heart className="h-5 w-5 text-success-green" />
            <span className="text-navy-primary font-medium">
              Because waiting should never feel lonely
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;