import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X, Phone, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { cartCount } = useCart();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const NavLinks = () => (
    <>
      <Link href="/" className={`text-sm font-medium transition-colors hover:text-secondary ${location === "/" ? "text-secondary" : "text-white"}`}>
        Home
      </Link>
      <Link href="/shop" className={`text-sm font-medium transition-colors hover:text-secondary ${location === "/shop" ? "text-secondary" : "text-white"}`}>
        Shop All
      </Link>
      <Link href="/about" className={`text-sm font-medium transition-colors hover:text-secondary ${location === "/about" ? "text-secondary" : "text-white"}`}>
        About Us
      </Link>
      <Link href="/contact" className={`text-sm font-medium transition-colors hover:text-secondary ${location === "/contact" ? "text-secondary" : "text-white"}`}>
        Contact Us
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary shadow-md">
      {/* Top Bar - Contact Info */}
      <div className="hidden md:flex w-full bg-slate-900 py-1 px-4 justify-between items-center text-[11px] text-gray-300">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Phone size={12} /> +1 (555) 123-4567</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> 123 Tech Street, Silicon Valley</span>
        </div>
        <div className="flex gap-4">
          <span>Free Shipping on Orders Over $500</span>
          <span>24/7 Customer Support</span>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight mr-6">
          <span className="text-secondary">Krishna</span>Electronics
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Input
            type="search"
            placeholder="Search for products..."
            className="w-full bg-white text-black pr-10 rounded-md focus-visible:ring-secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-3 text-primary hover:text-secondary transition-colors">
            <Search className="h-5 w-5" />
          </button>
        </form>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:text-secondary hover:bg-transparent">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-primary">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu & Cart */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-transparent">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-primary">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-transparent">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary text-white border-l-slate-700">
              <div className="flex flex-col gap-6 mt-8">
                <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-white text-black pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-2 top-2.5 text-primary">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
                <nav className="flex flex-col gap-4">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-secondary">Home</Link>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-secondary">Shop All</Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-secondary">About Us</Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-secondary">Contact Us</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile Categories Bar (Optional, similar to Amazon app) */}
      <div className="md:hidden flex overflow-x-auto bg-slate-800 py-2 px-4 gap-4 text-xs text-white scrollbar-hide">
        <Link href="/shop?category=Mobiles" className="whitespace-nowrap">Mobiles</Link>
        <Link href="/shop?category=Laptops" className="whitespace-nowrap">Laptops</Link>
        <Link href="/shop?category=Accessories" className="whitespace-nowrap">Accessories</Link>
        <Link href="/shop?category=Home Appliances" className="whitespace-nowrap">Appliances</Link>
      </div>
    </header>
  );
}
