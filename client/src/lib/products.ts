import smartphoneImg from "@assets/generated_images/smartphone_category_image.png";
import laptopImg from "@assets/generated_images/laptop_category_image.png";
import headphonesImg from "@assets/generated_images/headphones_category_image.png";
import appliancesImg from "@assets/generated_images/home_appliances_category_image.png";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Galaxy S24 Ultra 5G",
    category: "Mobiles",
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 1240,
    image: smartphoneImg,
    description: "Experience the future with the Galaxy S24 Ultra. Featuring AI-powered camera, titanium frame, and the brightest display yet.",
    specs: {
      Processor: "Snapdragon 8 Gen 3",
      RAM: "12GB",
      Storage: "256GB/512GB",
      Battery: "5000mAh",
      Camera: "200MP Main"
    },
    isNew: true,
    isBestSeller: true
  },
  {
    id: 2,
    name: "MacBook Pro 14 M3",
    category: "Laptops",
    price: 1599,
    rating: 4.9,
    reviews: 850,
    image: laptopImg,
    description: "The most advanced Mac laptop ever. Mind-blowing performance with the M3 chip and up to 22 hours of battery life.",
    specs: {
      Processor: "Apple M3 Pro",
      RAM: "18GB",
      Storage: "512GB SSD",
      Display: "14-inch Liquid Retina XDR",
      Battery: "Up to 22 hours"
    },
    isBestSeller: true
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Accessories",
    price: 348,
    originalPrice: 399,
    rating: 4.7,
    reviews: 3400,
    image: headphonesImg,
    description: "Industry-leading noise canceling headphones with premium sound, crystal clear hands-free calling, and Alexa voice control.",
    specs: {
      Type: "Over-ear",
      Battery: "30 hours",
      Connectivity: "Bluetooth 5.2",
      "Noise Canceling": "Yes",
      Weight: "250g"
    }
  },
  {
    id: 4,
    name: "LG Smart Washer & Dryer",
    category: "Home Appliances",
    price: 899,
    originalPrice: 1199,
    rating: 4.6,
    reviews: 450,
    image: appliancesImg,
    description: "High-efficiency front load washer with Steam and Wi-Fi connectivity. Handle large loads with ease.",
    specs: {
      Capacity: "4.5 cu. ft.",
      Cycles: "12",
      "Smart Features": "LG ThinQ",
      Dimensions: "27 x 39 x 30 inches",
      Energy: "Energy Star Certified"
    }
  },
  {
    id: 5,
    name: "iPhone 15 Pro Max",
    category: "Mobiles",
    price: 1199,
    rating: 4.9,
    reviews: 2100,
    image: smartphoneImg,
    description: "Forged in titanium. Featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system.",
    specs: {
      Processor: "A17 Pro",
      RAM: "8GB",
      Storage: "256GB",
      Battery: "4422mAh",
      Camera: "48MP Main"
    },
    isBestSeller: true
  },
  {
    id: 6,
    name: "Dell XPS 13 Plus",
    category: "Laptops",
    price: 1399,
    originalPrice: 1699,
    rating: 4.5,
    reviews: 320,
    image: laptopImg,
    description: "Twice as powerful as before in the same size. Features a 13.4-inch 3.5K OLED touch display.",
    specs: {
      Processor: "Intel Core i7-1360P",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "13.4 OLED Touch",
      Weight: "2.71 lbs"
    },
    isNew: true
  },
  {
    id: 7,
    name: "Bose QuietComfort Ultra",
    category: "Accessories",
    price: 429,
    rating: 4.6,
    reviews: 560,
    image: headphonesImg,
    description: "World-class noise cancellation, quieter than ever before. Breakthrough spatial audio for more immersive listening.",
    specs: {
      Type: "Earbuds",
      Battery: "6 hours",
      Case: "Additional 18 hours",
      WaterResist: "IPX4",
      Color: "Black/White"
    },
    isNew: true
  },
  {
    id: 8,
    name: "Samsung Smart Fridge",
    category: "Home Appliances",
    price: 2199,
    originalPrice: 2899,
    rating: 4.7,
    reviews: 120,
    image: appliancesImg,
    description: "Family Hub™ refrigerator lets you manage your family's calendar, stream music, and see who's at the front door.",
    specs: {
      Capacity: "28 cu. ft.",
      Type: "French Door",
      "Ice Maker": "Dual Ice Maker",
      Display: "21.5 inch Touchscreen",
      Smart: "Wi-Fi Enabled"
    }
  }
];

export const categories = [
  { name: "Mobiles", image: smartphoneImg },
  { name: "Laptops", image: laptopImg },
  { name: "Accessories", image: headphonesImg },
  { name: "Home Appliances", image: appliancesImg }
];
