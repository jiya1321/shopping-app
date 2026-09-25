import smartphoneImg from "@assets/generated_images/smartphone_category_image.png";
import laptopImg from "@assets/generated_images/laptop_category_image.png";
import headphonesImg from "@assets/generated_images/headphones_category_image.png";
import appliancesImg from "@assets/generated_images/home_appliances_category_image.png";

// Import the actual OPPO K14x image
const oppoK14xImage = smartphoneImg;

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stockQuantity: number;
  status: "In Stock" | "Out of Stock" | "Inactive";
  lastUpdated: string;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  color?: string;
  ram?: string;
  storage?: string;
  description: string;
  specs: Record<string, string>;
  isNew?: boolean;
  isBestSeller?: boolean;
}

type CatalogItem = [name: string, price: number, originalPrice?: number];

const catalog: Record<string, CatalogItem[]> = {
  Mobiles: [
    ["OPPO K14x 5G — 4GB + 128GB — Icy Blue", 19999, 21999],
    ["OPPO K14x 5G — 4GB + 128GB — Prism Violet", 19999, 21999],
    ["OPPO K14x 5G — 6GB + 128GB — Icy Blue", 22999, 23999],
    ["OPPO K14x 5G — 6GB + 128GB — Prism Violet", 22999, 23999],
    ["Realme C83 5G — 4GB + 64GB — Blue", 17499, 19999],
    ["Realme C83 5G — 4GB + 64GB — Black", 17499, 19999],
    ["Realme C83 5G — 4GB + 128GB — Blue", 19499, 21999],
    ["Realme C83 5G — 4GB + 128GB — Black", 19499, 21999],
    ["Realme C85 5G — 4GB + 128GB — Black", 21999, 24999],
    ["Realme C85 5G — 4GB + 128GB — Brown", 21999, 24999],
    ["Realme C85 5G — 4GB + 128GB — Purple", 21999, 24999],
    ["Realme P4 Lite 5G — 4GB + 128GB — Blue", 18499, 19999],
    ["Realme P4 Lite 5G — 4GB + 128GB — White", 18499, 19999],
    ["Motorola G57 Power 5G — 8GB + 128GB", 19799]
  ],
  Laptops: [
    ["MacBook Pro 14 M3", 169990], ["Dell XPS 13 Plus", 62999, 69999], ["HP Pavilion Plus 14", 54990, 59990], ["HP Spectre x360 14", 124990],
    ["Dell Inspiron 14", 62999], ["Lenovo IdeaPad Slim 5", 49990, 54990], ["Lenovo Legion 5i", 99990, 109990], ["ASUS Vivobook 15", 57999],
    ["ASUS ROG Zephyrus G14", 139990, 149990], ["Acer Aspire 5", 44990], ["Acer Nitro V", 74990, 79990], ["Microsoft Surface Laptop 6", 124999],
    ["Apple MacBook Air 15 M3", 134990], ["Samsung Galaxy Book4", 74990], ["MSI Modern 14", 52990, 57990], ["MSI Katana 15", 89990],
    ["LG Gram 14", 114990, 124990], ["Infinix INBook Y2 Plus", 32990], ["Honor MagicBook X16", 42990], ["Lenovo Yoga 7", 89990, 94990]
  ],
  Accessories: [
    ["Sony WH-1000XM5", 7990, 9990], ["Bose QuietComfort Ultra", 14999], ["Apple AirPods Pro 2", 24900], ["Apple AirPods 3rd Gen", 14999],
    ["JBL Charge 5 Speaker", 5999, 6999], ["JBL Tune 770NC", 5999], ["boAt Airdopes 141", 1499], ["boAt Nirvana Ion Earbuds", 2199],
    ["Nothing Ear (a)", 7999, 8999], ["OnePlus Buds 3", 5499], ["Samsung Galaxy Buds3 Pro", 14999, 17999], ["Logitech MX Master 3S", 8995],
    ["Logitech K380 Keyboard", 2995], ["Amazon Basics USB-C Hub", 1999], ["Anker PowerCore 20K", 2499], ["Belkin 65W GaN Charger", 4499],
    ["Portronics Mport 7C", 1299], ["SanDisk Extreme 1TB SSD", 8999, 10999], ["Mi Smart Band 9", 3499], ["Apple Watch SE", 29900]
  ],
  "Home Appliances": [
    ["LG Smart Washer & Dryer", 36999, 44999], ["Samsung Smart Fridge", 42999, 52999], ["LG 655L French Door Refrigerator", 104990], ["Samsung 8kg EcoBubble Washer", 36999],
    ["LG 1.5 Ton Split AC", 44999, 49999], ["Voltas 1.5 Ton Inverter AC", 39999], ["Daikin 1.5 Ton Split AC", 48999], ["Whirlpool 265L Refrigerator", 29999],
    ["Godrej 236L Refrigerator", 26999], ["IFB 8kg Front Load Washer", 32990, 36990], ["Bosch 9kg Front Load Washer", 45990], ["Voltas Beko Dishwasher", 34990],
    ["Samsung 55 inch 4K Smart TV", 64999, 74999], ["LG 50 inch 4K Smart TV", 49999], ["Sony Bravia 55 inch 4K", 79999, 89999], ["OnePlus 43 inch 4K TV", 29999],
    ["Philips Air Fryer 6.2L", 7999], ["Prestige Induction Cooktop", 2499], ["Bajaj OTG 22L", 4999], ["Dyson V12 Cordless Vacuum", 54900, 59900]
  ],
  Televisions: [
    ["Samsung 55 inch Crystal 4K Smart TV", 54999, 74999], ["LG 50 inch UHD AI Smart TV", 46999, 59999], ["Sony Bravia 55 inch 4K Google TV", 74999, 89999], ["OnePlus 43 inch Y1S Pro 4K TV", 29999, 34999], ["TCL 55 inch QLED 4K TV", 42999, 52999], ["Hisense 43 inch 4K Vidaa TV", 26999], ["Mi 50 inch X Series 4K TV", 35999, 44999], ["Samsung 65 inch Neo QLED TV", 129999, 149999]
  ],
  Refrigerators: [
    ["LG 655L French Door Refrigerator", 104990, 124990], ["Samsung 653L Side-by-Side Refrigerator", 89999, 109999], ["Whirlpool 265L Frost Free Refrigerator", 29999, 34999], ["Godrej 236L Double Door Refrigerator", 26999, 30999], ["Haier 237L Convertible Refrigerator", 24999], ["Bosch 347L Frost Free Refrigerator", 52990, 59990]
  ],
  "Air Conditioners": [
    ["Voltas 1.5 Ton 5 Star Inverter AC", 39999, 49999], ["LG 1.5 Ton 5 Star Split AC", 44999, 54999], ["Daikin 1.5 Ton 5 Star Inverter AC", 48999, 58999], ["Blue Star 1.5 Ton Split AC", 41990, 49990], ["Panasonic 1.5 Ton Wi-Fi Inverter AC", 37999, 44999], ["Carrier 1.5 Ton Flexicool AC", 40999]
  ],
  "Washing Machines": [
    ["LG 8kg Front Load Washing Machine", 36999, 44999], ["Samsung 8kg EcoBubble Washing Machine", 32999, 39999], ["IFB 8kg Front Load Washing Machine", 32990, 36990], ["Bosch 9kg Front Load Washing Machine", 45990, 52990], ["Whirlpool 7.5kg Top Load Washing Machine", 22999, 27999], ["Panasonic 7kg Fully Automatic Washer", 18999]
  ],
  Headphones: [
    ["Sony WH-1000XM5 Wireless Headphones", 27990, 34990], ["JBL Tune 770NC ANC Headphones", 5999, 7999], ["boAt Rockerz 550 Over-Ear Headphones", 1999, 3999], ["Bose QuietComfort Ultra Headphones", 29999], ["Sennheiser Accentum Wireless Headphones", 8990, 11990], ["OnePlus Bullets Wireless Z2", 1999]
  ],
  Cameras: [
    ["Canon EOS R50 Mirrorless Camera", 64999, 74999], ["Sony Alpha ZV-E10 Camera", 59990, 69990], ["Nikon Z50 Mirrorless Camera", 69999, 79999], ["GoPro HERO12 Black", 34999, 44999], ["Canon EOS 1500D DSLR Camera", 39999, 49999], ["Fujifilm Instax Mini 12 Camera", 7999, 9999]
  ]
};

const categoryImages: Record<string, string> = {
  Mobiles: smartphoneImg,
  Laptops: laptopImg,
  Accessories: headphonesImg,
  "Home Appliances": appliancesImg
};

const getProductSpecs = (name: string, category: string): Record<string, string> => {
  // Specific specs for mobile products
  if (name.includes("OPPO K14x 5G — 4GB + 128GB")) {
    return {
      Brand: "OPPO",
      Model: "K14x 5G",
      RAM: "4GB",
      Storage: "128GB",
      Category: category,
      Warranty: "1 year brand warranty",
      Delivery: "Free delivery across India",
      Display: "6.75\" HD+ LCD, 120Hz",
      Processor: "MediaTek Dimensity 6300 5G",
      Camera: "50MP Rear + 5MP Front",
      Battery: "6500mAh",
      Charging: "45W SUPERVOOC",
      OS: "ColorOS 15",
      Network: "5G"
    };
  }
  if (name.includes("OPPO K14x 5G — 6GB + 128GB")) {
    return {
      Brand: "OPPO",
      Model: "K14x 5G",
      RAM: "6GB",
      Storage: "128GB",
      Category: category,
      Warranty: "1 year brand warranty",
      Delivery: "Free delivery across India",
      Display: "6.75\" HD+ LCD, 120Hz",
      Processor: "MediaTek Dimensity 6300 5G",
      Camera: "50MP Rear + 5MP Front",
      Battery: "6500mAh",
      Charging: "45W SUPERVOOC",
      OS: "ColorOS 15",
      Network: "5G"
    };
  }
  if (name.includes("Realme C83 5G — 4GB + 64GB")) {
    return {
      Brand: "Realme",
      Model: "C83 5G",
      RAM: "4GB",
      Storage: "64GB",
      Category: category,
      Warranty: "1 year brand warranty",
      Delivery: "Free delivery across India",
      Display: "6.8\" HD+, 144Hz",
      Processor: "MediaTek Dimensity 6300 5G",
      Camera: "13MP Rear + 5MP Front",
      Battery: "7000mAh Titan",
      Charging: "15W Fast Charging",
      OS: "realme UI 7.0",
      Network: "5G"
    };
  }
  if (name.includes("Realme C83 5G — 4GB + 128GB")) {
    return {
      Brand: "Realme",
      Model: "C83 5G",
      RAM: "4GB",
      Storage: "128GB",
      Category: category,
      Warranty: "1 year brand warranty",
      Delivery: "Free delivery across India",
      Display: "6.8\" HD+, 144Hz",
      Processor: "MediaTek Dimensity 6300 5G",
      Camera: "13MP Rear + 5MP Front",
      Battery: "7000mAh Titan",
      Charging: "15W Fast Charging",
      OS: "realme UI 7.0",
      Network: "5G"
    };
  }
  if (name.includes("Realme C85 5G — 4GB + 128GB")) {
    return {
      Brand: "Realme",
      Model: "C85 5G",
      RAM: "4GB",
      Storage: "128GB",
      Category: category,
      Warranty: "1 year brand warranty",
      Delivery: "Free delivery across India",
      Display: "6.8\" HD+, 144Hz",
      Processor: "MediaTek Dimensity 6300 5G",
      Camera: "50MP Sony Rear + 8MP Front",
      Battery: "7000mAh Titan",
      Charging: "45W Fast Charging",
      OS: "realme UI",
      Network: "5G"
    };
  }
  if (name.includes("Realme P4 Lite 5G — 4GB + 128GB")) {
    return {
      Brand: "Realme",
      Model: "P4 Lite 5G",
      RAM: "4GB",
      Storage: "128GB",
      Category: category,
      Warranty: "1 year brand warranty",
      Delivery: "Free delivery across India",
      Display: "6.8\" HD+, 144Hz",
      Processor: "MediaTek Dimensity 6300 5G",
      Camera: "13MP Rear + 5MP Front",
      Battery: "7000mAh Titan",
      Charging: "15W Fast Charging",
      OS: "realme UI 7.0",
      Network: "5G"
    };
  }
  if (name.includes("Motorola G57 Power 5G — 8GB + 128GB")) {
    return {
      Brand: "Motorola",
      Model: "moto g57 power 5G",
      RAM: "8GB",
      Storage: "128GB",
      Category: category,
      Warranty: "1 year brand warranty",
      Delivery: "Free delivery across India",
      Display: "6.72\" Full HD+, 120Hz",
      Processor: "Snapdragon 6s Gen 4 5G",
      Camera: "50MP Sony LYTIA + 8MP Ultrawide",
      Battery: "7000mAh",
      Charging: "33W TurboPower",
      OS: "Android 16",
      Network: "5G"
    };
  }
  
  // Default specs for other products
  return {
    Category: category,
    Warranty: "1 year brand warranty",
    Delivery: "Free delivery across India"
  };
};

const getProductId = (name: string, category: string, categoryIndex: number, itemIndex: number): number => {
  // Specific IDs for mobile products with colors
  if (category === "Mobiles") {
    const mobileIds: Record<string, number> = {
      "OPPO K14x 5G — 4GB + 128GB — Icy Blue": 1,
      "OPPO K14x 5G — 4GB + 128GB — Prism Violet": 2,
      "OPPO K14x 5G — 6GB + 128GB — Icy Blue": 3,
      "OPPO K14x 5G — 6GB + 128GB — Prism Violet": 4,
      "Realme C83 5G — 4GB + 64GB — Blue": 5,
      "Realme C83 5G — 4GB + 64GB — Black": 6,
      "Realme C83 5G — 4GB + 128GB — Blue": 7,
      "Realme C83 5G — 4GB + 128GB — Black": 8,
      "Realme C85 5G — 4GB + 128GB — Black": 9,
      "Realme C85 5G — 4GB + 128GB — Brown": 10,
      "Realme C85 5G — 4GB + 128GB — Purple": 11,
      "Realme P4 Lite 5G — 4GB + 128GB — Blue": 12,
      "Realme P4 Lite 5G — 4GB + 128GB — White": 13,
      "Motorola G57 Power 5G — 8GB + 128GB": 14
    };
    return mobileIds[name] || categoryIndex * 20 + itemIndex + 1;
  }
  return categoryIndex * 20 + itemIndex + 1;
};

const getProductImages = (name: string, category: string, defaultImage: string): string[] => {
  // Generate product-specific image galleries for mobile products with colors
  if (category === "Mobiles") {
    const imageGalleries: Record<string, string[]> = {
      "OPPO K14x 5G — 4GB + 128GB — Icy Blue": [
        "/attached_assets/generated_images/oppo 4-128 icy blue.png"
      ],
      "OPPO K14x 5G — 4GB + 128GB — Prism Violet": [
        "/attached_assets/generated_images/oppo 4-128 purple.png"
      ],
      "OPPO K14x 5G — 6GB + 128GB — Icy Blue": [
        "/attached_assets/generated_images/oppo 4-128 icy blue.png"
      ],
      "OPPO K14x 5G — 6GB + 128GB — Prism Violet": [
        "/attached_assets/generated_images/oppo 4-128 purple.png"
      ],
      "Realme C83 5G — 4GB + 64GB — Blue": [
        "/attached_assets/generated_images/realme c83 4-64 blue.png"
      ],
      "Realme C83 5G — 4GB + 64GB — Black": [
        "/attached_assets/generated_images/realme c83 464 black.png"
      ],
      "Realme C83 5G — 4GB + 128GB — Blue": [
        "/attached_assets/generated_images/realme c83 4-64 blue.png"
      ],
      "Realme C83 5G — 4GB + 128GB — Black": [
        "/attached_assets/generated_images/realme c83 464 black.png"
      ],
      "Realme C85 5G — 4GB + 128GB — Black": [
        "/attached_assets/generated_images/realme c85 4-128 black.png"
      ],
      "Realme C85 5G — 4GB + 128GB — Brown": [
        "/attached_assets/generated_images/realme c85 4-128 brown - Copy.png"
      ],
      "Realme C85 5G — 4GB + 128GB — Purple": [
        "/attached_assets/generated_images/realme c85 4-128 purplr - Copy.png"
      ],
      "Realme P4 Lite 5G — 4GB + 128GB — Blue": [
        "/attached_assets/generated_images/realme p4 lite 4-128 blue.png"
      ],
      "Realme P4 Lite 5G — 4GB + 128GB — White": [
        "/attached_assets/generated_images/realme p4 lite 4-128 white.png"
      ],
      "Motorola G57 Power 5G — 8GB + 128GB": [
        // TODO: Replace with actual Motorola G57 Power 5G image from attached_assets/generated_images
        "/attached_assets/generated_images/motrola g57 power 5g 8-128 green.png"
      ]
    };
    
    const gallery = imageGalleries[name];
    if (gallery) {
      return gallery;
    }
  }
  
  // For non-mobile products or mobiles without specific galleries, return single image
  return [defaultImage];
};

const getProductMainImage = (name: string, category: string, defaultImage: string): string => {
  // Use specific main image for OPPO K14x 4GB + 128GB
  if (category === "Mobiles" && name === "OPPO K14x 5G — 4GB + 128GB") {
    return oppoK14xImage;
  }
  return defaultImage;
};

const getProductColor = (name: string, category: string): string | undefined => {
  // Extract color from product name for mobile products
  if (category === "Mobiles") {
    if (name.includes("—")) {
      const parts = name.split("—");
      if (parts.length >= 3) {
        return parts[2].trim();
      }
    }
  }
  return undefined;
};

const createSku = (name: string, id: number) =>
  `${name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toUpperCase()
    .slice(0, 36)}-${id}`;

export const products: Product[] = Object.entries(catalog).flatMap(([category, items], categoryIndex) =>
  items.map(([name, price, originalPrice], itemIndex) => {
    const defaultImage = categoryImages[category] || appliancesImg;
    const images = getProductImages(name, category, defaultImage);
    const id = getProductId(name, category, categoryIndex, itemIndex);
    const specs = getProductSpecs(name, category);

    return {
      id,
      name,
      brand: specs.Brand || name.split(" ")[0],
      category,
      price,
      originalPrice,
      sku: createSku(name, id),
      stockQuantity: 8 + ((id * 7) % 23),
      status: "In Stock" as const,
      lastUpdated: new Date().toISOString(),
      rating: Number((4.4 + ((itemIndex + categoryIndex) % 6) / 10).toFixed(1)),
      reviews: 120 + (categoryIndex * 400) + (itemIndex * 83),
      image: images[0],
      images,
      color: getProductColor(name, category),
      ram: specs.RAM,
      storage: specs.Storage,
      description: `${name} with dependable performance, modern features, and GST-inclusive pricing from Krishna Electronics.`,
      specs,
      isNew: itemIndex < 3,
      isBestSeller: itemIndex % 5 === 0
    };
  })
);

export const categories = [
  { name: "Mobiles", image: smartphoneImg },
  { name: "Laptops", image: laptopImg },
  { name: "Televisions", image: appliancesImg },
  { name: "Refrigerators", image: appliancesImg },
  { name: "Air Conditioners", image: appliancesImg },
  { name: "Washing Machines", image: appliancesImg },
  { name: "Headphones", image: headphonesImg },
  { name: "Cameras", image: appliancesImg },
  { name: "Accessories", image: headphonesImg }
];
