import { Mail, Shield, FileText } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Companions Anonymous logo" className="h-6 w-6" />
              <span className="font-heading text-xl font-semibold">Companions Anonymous</span>
            </div>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Creating temporary anonymous chat rooms for patient companions, 
              transforming isolation into connection during life's most challenging moments.
            </p>
            <div className="text-success-green-light font-medium text-lg">
              "Because waiting should never feel lonely."
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#about" className="hover:text-success-green-light transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-success-green-light transition-colors">Careers</a></li>
              <li><a href="#press" className="hover:text-success-green-light transition-colors">Press Kit</a></li>
              <li><a href="#blog" className="hover:text-success-green-light transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#help" className="hover:text-success-green-light transition-colors">Help Center</a></li>
              <li><a href="#contact" className="hover:text-success-green-light transition-colors">Contact Us</a></li>
              <li><a href="#security" className="hover:text-success-green-light transition-colors">Security</a></li>
              <li><a href="#status" className="hover:text-success-green-light transition-colors">System Status</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-white/80 text-sm">
              <span>© {currentYear} Companions Anonymous. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="#privacy" className="hover:text-success-green-light transition-colors flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </a>
                <a href="#terms" className="hover:text-success-green-light transition-colors flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Mail className="h-4 w-4" />
              <a href="mailto:hello@companionsanonymous.health" className="hover:text-success-green-light transition-colors">
                hello@companionsanonymous.health
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
