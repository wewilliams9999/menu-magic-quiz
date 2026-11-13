
import { Instagram, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div className="space-y-3">
            <Link to="/" className="inline-block">
              <h3 className="text-xl font-bold text-red-500">Nash Menus</h3>
            </Link>
            <p className="text-sm text-zinc-400">
              Discover the best restaurants in Nashville
            </p>
            <div className="flex space-x-3 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="border-red-500 hover:border-red-600 hover:bg-red-50/10 text-red-400 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-950/30 dark:text-red-400"
              >
                <a 
                  href="https://www.instagram.com/nashvillemenus/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nash Menus on Instagram"
                  className="flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  <span>@nashvillemenus</span>
                </a>
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-100">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-zinc-400 hover:text-red-400 transition-colors">The Entrance</Link>
              </li>
              <li>
                <Link to="/booth" className="text-zinc-400 hover:text-red-400 transition-colors">Sound Booth</Link>
              </li>
            </ul>
          </div>
          
          {/* Additional Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-100">Contact</h4>
            <p className="text-sm text-zinc-400">
              Have suggestions or want your restaurant featured?
            </p>
            <a 
              href="mailto:Nashvillemenus@gmail.com" 
              className="text-sm text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
            >
              Nashvillemenus@gmail.com
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 mx-auto max-w-2xl text-center">
          <h4 className="font-semibold text-zinc-100">Behind NashMenus</h4>
          <p className="mt-2 text-sm text-zinc-400">There are so many incredible places to eat in Nashville, but even for locals, figuring out where to go tonight can feel overwhelming. We built NashMenus to make that choice easy, with the details that matter, from room noise to parking.</p>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-800 text-xs text-center text-zinc-500">
          <p>© {currentYear} Nash Menus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
