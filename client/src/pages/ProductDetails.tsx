import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { useState } from "react";

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:id");
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);

  if (!match) return null;

  const product = products.find(p => p.id === parseInt(params.id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => setLocation("/shop")}>Back to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for(let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setLocation("/cart");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="bg-white p-8 border rounded-xl flex items-center justify-center sticky top-24 h-fit">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-w-full max-h-[500px] object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-600 font-medium hover:underline cursor-pointer">Visit the {product.category} Store</span>
                <div className="flex items-center gap-1 text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                      className={i < Math.floor(product.rating) ? "text-secondary" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-gray-500 ml-1">{product.rating} ({product.reviews} ratings)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">All prices include VAT.</p>
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Specs Table */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="contents">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="qty" className="font-medium text-gray-700">Quantity:</label>
                <select 
                  id="qty" 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border rounded-md p-2 w-20"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCart}
                  size="lg" 
                  className="flex-1 bg-secondary text-primary hover:bg-secondary/90 font-bold rounded-full"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  size="lg" 
                  className="flex-1 bg-orange-600 text-white hover:bg-orange-700 font-bold rounded-full"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-full"><Truck size={20} className="text-primary"/></div>
                <span>Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-full"><RotateCcw size={20} className="text-primary"/></div>
                <span>30 Days Return</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-full"><Shield size={20} className="text-primary"/></div>
                <span>2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
