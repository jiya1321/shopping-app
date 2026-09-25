import smartphoneImage from "@assets/generated_images/smartphone_category_image.png";
import laptopImage from "@assets/generated_images/laptop_category_image.png";
import headphonesImage from "@assets/generated_images/headphones_category_image.png";
import appliancesImage from "@assets/generated_images/home_appliances_category_image.png";
import heroImage from "@assets/generated_images/modern_electronics_store_hero_banner.png";
import motorolaImage from "@assets/generated_images/motrola g57 power 5g 8-128 green.png";
import oppoBlueImage from "@assets/generated_images/oppo 4-128 icy blue.png";
import oppoPurpleImage from "@assets/generated_images/oppo 4-128 purple.png";
import realmeC83BlueImage from "@assets/generated_images/realme c83 4-64 blue.png";
import realmeC83BlackImage from "@assets/generated_images/realme c83 464 black.png";
import realmeC85BlackImage from "@assets/generated_images/realme c85 4-128 black.png";
import realmeC85BrownImage from "@assets/generated_images/realme c85 4-128 brown - Copy.png";
import realmeC85PurpleImage from "@assets/generated_images/realme c85 4-128 purplr - Copy.png";
import realmeP4BlueImage from "@assets/generated_images/realme p4 lite 4-128 blue.png";
import realmeP4WhiteImage from "@assets/generated_images/realme p4 lite 4-128 white.png";

const generatedImages: Record<string, string> = {
  "headphones_category_image.png": headphonesImage,
  "home_appliances_category_image.png": appliancesImage,
  "laptop_category_image.png": laptopImage,
  "modern_electronics_store_hero_banner.png": heroImage,
  "motrola g57 power 5g 8-128 green.png": motorolaImage,
  "oppo 4-128 icy blue.png": oppoBlueImage,
  "oppo 4-128 purple.png": oppoPurpleImage,
  "realme c83 4-64 blue.png": realmeC83BlueImage,
  "realme c83 464 black.png": realmeC83BlackImage,
  "realme c85 4-128 black.png": realmeC85BlackImage,
  "realme c85 4-128 brown - copy.png": realmeC85BrownImage,
  "realme c85 4-128 purplr - copy.png": realmeC85PurpleImage,
  "realme p4 lite 4-128 blue.png": realmeP4BlueImage,
  "realme p4 lite 4-128 white.png": realmeP4WhiteImage,
  "smartphone_category_image.png": smartphoneImage,
};

export const categoryImages: Record<string, string> = {
  Mobiles: smartphoneImage,
  Laptops: laptopImage,
  Televisions: appliancesImage,
  Refrigerators: appliancesImage,
  "Air Conditioners": appliancesImage,
  "Washing Machines": appliancesImage,
  Headphones: headphonesImage,
  Cameras: appliancesImage,
  Accessories: headphonesImage,
  "Mixer Grinder": appliancesImage,
  Irons: appliancesImage,
  Chimney: appliancesImage,
  "Gas Stoves": appliancesImage,
  Chulha: appliancesImage,
  Rowanna: appliancesImage,
  "Home Appliances": appliancesImage,
};

export const fallbackImage = appliancesImage;
export { heroImage };

export const getCategoryImage = (category: string) =>
  categoryImages[category] || fallbackImage;

export const getGeneratedImage = (fileName: string) =>
  generatedImages[fileName.toLowerCase()] || fallbackImage;

export const resolveImageSource = (
  source: string | null | undefined,
  fallback = fallbackImage,
) => {
  if (!source) return fallback;
  if (source.startsWith("data:") || source.startsWith("blob:")) return source;

  let decodedSource = source;
  try {
    decodedSource = decodeURIComponent(source);
  } catch {
    return source;
  }

  const path = decodedSource.split(/[?#]/, 1)[0].replaceAll("\\", "/");
  const fileName = path.split("/").pop()?.toLowerCase();
  if (!fileName) return fallback;

  const exactMatch = generatedImages[fileName];
  if (exactMatch) return exactMatch;

  for (const [knownFileName, image] of Object.entries(generatedImages)) {
    const extensionIndex = knownFileName.lastIndexOf(".");
    const stem = knownFileName.slice(0, extensionIndex);
    const extension = knownFileName.slice(extensionIndex);
    if (fileName.startsWith(`${stem}-`) && fileName.endsWith(extension)) {
      return image;
    }
  }

  if (
    path.startsWith("/attached_assets/") ||
    path.startsWith("/generated_images/") ||
    path.startsWith("/assets/") ||
    path.startsWith("/@fs/")
  ) {
    return fallback;
  }

  return source;
};
