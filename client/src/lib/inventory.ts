import { Product, products as catalogProducts } from "@/lib/products";

export const INVENTORY_STORAGE_KEY = "krishna-inventory";

export const INVENTORY_COLUMNS = [
  "Product ID",
  "Product Name",
  "Brand",
  "Category",
  "Color",
  "RAM",
  "Storage",
  "Price",
  "Original Price",
  "Discount",
  "Stock Quantity",
  "SKU",
  "Image",
  "Description",
  "Status",
] as const;

const REQUIRED_COLUMNS = [
  "Product ID",
  "Product Name",
  "Category",
  "Price",
  "Stock Quantity",
  "SKU",
  "Status",
] as const;

export type InventoryImportError = {
  row: number;
  message: string;
};

export type InventoryImportPreview = {
  products: Product[];
  found: number;
  updated: number;
  added: number;
  errors: InventoryImportError[];
};

type InventoryRow = Record<(typeof INVENTORY_COLUMNS)[number], unknown>;

const text = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const number = (value: unknown) => {
  if (typeof value === "number") return value;
  const parsed = Number(text(value).replace(/[₹,%\s]/g, "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const normaliseStatus = (
  value: unknown,
  stockQuantity: number,
): Product["status"] => {
  const status = text(value).toLowerCase();
  if (status === "inactive") return "Inactive";
  return stockQuantity > 0 ? "In Stock" : "Out of Stock";
};

export const calculateDiscount = (product: Pick<Product, "price" | "originalPrice">) =>
  product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

export const getStockLabel = (product: Pick<Product, "stockQuantity" | "status">) => {
  if (product.status === "Inactive" || product.stockQuantity <= 0) return "Out of Stock";
  if (product.stockQuantity <= 5) return `Only ${product.stockQuantity} left`;
  return "In Stock";
};

export const isProductAvailable = (product: Pick<Product, "stockQuantity" | "status">) =>
  product.status === "In Stock" && product.stockQuantity > 0;

export const normaliseInventory = (saved: Product[]) => {
  const savedById = new Map(saved.map((product) => [product.id, product]));
  const merged = catalogProducts.map((product) => ({
    ...product,
    ...savedById.get(product.id),
  }));

  return [
    ...merged,
    ...saved.filter(
      (product) =>
        !catalogProducts.some(
          (catalogProduct) =>
            catalogProduct.id === product.id ||
            (product.sku && catalogProduct.sku === product.sku),
        ),
    ),
  ].map((product) => ({
    ...product,
    status:
      product.status === "Inactive"
        ? "Inactive" as const
        : product.stockQuantity > 0
          ? "In Stock" as const
          : "Out of Stock" as const,
  }));
};

export const loadInventory = () => {
  try {
    const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!stored) return catalogProducts;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? normaliseInventory(parsed as Product[]) : catalogProducts;
  } catch {
    return catalogProducts;
  }
};

const toInventoryRow = (product: Product) => ({
  "Product ID": product.id,
  "Product Name": product.name,
  Brand: product.brand,
  Category: product.category,
  Color: product.color || "",
  RAM: product.ram || product.specs.RAM || "",
  Storage: product.storage || product.specs.Storage || "",
  Price: product.price,
  "Original Price": product.originalPrice || "",
  Discount: calculateDiscount(product),
  "Stock Quantity": product.stockQuantity,
  SKU: product.sku,
  Image: product.image,
  Description: product.description,
  Status: product.status,
});

const downloadWorkbook = async (products: Product[], fileName: string) => {
  const { default: writeExcelFile } = await import("write-excel-file/browser");
  const header = INVENTORY_COLUMNS.map((column) => ({
    value: column,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    backgroundColor: "#172554",
  }));
  const rows = products.map((product) => {
    const row = toInventoryRow(product);
    return INVENTORY_COLUMNS.map((column) => ({ value: row[column] }));
  });
  const columns = INVENTORY_COLUMNS.map((column) => ({
    width: column === "Product Name" || column === "Description" ? 42 : 18,
  }));

  await writeExcelFile([header, ...rows], {
    sheet: "Inventory",
    columns,
    stickyRowsCount: 1,
  }).toFile(fileName);
};

export const downloadInventoryTemplate = () =>
  downloadWorkbook(catalogProducts, "krishna-inventory-template.xlsx");

export const exportCurrentInventory = (products: Product[]) =>
  downloadWorkbook(products, "krishna-current-inventory.xlsx");

export const parseInventoryWorkbook = async (
  file: File,
  currentProducts: Product[],
): Promise<InventoryImportPreview> => {
  const { readSheet } = await import("read-excel-file/browser");
  const rows = await readSheet(file);
  if (rows.length === 0) throw new Error("The Excel file does not contain a worksheet.");

  const headers = new Map<string, number>();
  rows[0].forEach((cell, column) => {
    headers.set(text(cell), column);
  });

  const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.has(column));
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  const byId = new Map(currentProducts.map((product) => [product.id, product]));
  const bySku = new Map(currentProducts.map((product) => [product.sku.toLowerCase(), product]));
  const nextProducts = [...currentProducts];
  const errors: InventoryImportError[] = [];
  const matchedIds = new Set<number>();
  let found = 0;
  let updated = 0;
  let added = 0;

  rows.slice(1).forEach((worksheetRow, rowIndex) => {
    const rowNumber = rowIndex + 2;
    const row = Object.fromEntries(
      INVENTORY_COLUMNS.map((column) => [
        column,
        headers.has(column) ? worksheetRow[headers.get(column)!] ?? null : null,
      ]),
    ) as InventoryRow;
    if (INVENTORY_COLUMNS.every((column) => !text(row[column]))) return;
    found += 1;

    const id = number(row["Product ID"]);
    const name = text(row["Product Name"]);
    const sku = text(row.SKU);
    const price = number(row.Price);
    const originalPrice = text(row["Original Price"])
      ? number(row["Original Price"])
      : undefined;
    const stockQuantity = number(row["Stock Quantity"]);
    const rowErrors: string[] = [];

    if (!Number.isInteger(id) || id <= 0) rowErrors.push("Product ID must be a positive integer");
    if (!name) rowErrors.push("Product Name is required");
    if (!sku) rowErrors.push("SKU is required");
    if (!Number.isFinite(price) || price < 0) rowErrors.push("Price must be zero or greater");
    if (originalPrice !== undefined && (!Number.isFinite(originalPrice) || originalPrice < price)) {
      rowErrors.push("Original Price must be equal to or greater than Price");
    }
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      rowErrors.push("Stock Quantity must be a non-negative integer");
    }

    const existingById = Number.isInteger(id) ? byId.get(id) : undefined;
    const existingBySku = sku ? bySku.get(sku.toLowerCase()) : undefined;
    if (existingById && existingBySku && existingById.id !== existingBySku.id) {
      rowErrors.push("Product ID and SKU match different products");
    }
    const existing = existingById || existingBySku;
    if (existing && matchedIds.has(existing.id)) {
      rowErrors.push("The same product appears more than once");
    }
    if (!existing && nextProducts.some((product) => product.id === id || product.sku.toLowerCase() === sku.toLowerCase())) {
      rowErrors.push("Product ID or SKU is duplicated");
    }

    if (rowErrors.length > 0) {
      errors.push({ row: rowNumber, message: rowErrors.join("; ") });
      return;
    }

    const category = text(row.Category);
    const image = text(row.Image);
    const description = text(row.Description);
    const brand = text(row.Brand);
    const ram = text(row.RAM);
    const storage = text(row.Storage);
    const color = text(row.Color);
    const lastUpdated = new Date().toISOString();
    const product: Product = {
      ...(existing || {
        id,
        name,
        category,
        brand: brand || name.split(" ")[0],
        sku,
        price,
        stockQuantity,
        status: "In Stock",
        lastUpdated,
        rating: 0,
        reviews: 0,
        image: image || "/favicon.png",
        description: description || name,
        specs: {},
      }),
      id: existing?.id ?? id,
      name,
      brand: brand || existing?.brand || name.split(" ")[0],
      category: category || existing?.category || "Accessories",
      color: color || undefined,
      ram: ram || undefined,
      storage: storage || undefined,
      price,
      originalPrice,
      stockQuantity,
      sku,
      image: image || existing?.image || "/favicon.png",
      images: image ? [image] : existing?.images,
      description: description || existing?.description || name,
      status: normaliseStatus(row.Status, stockQuantity),
      lastUpdated,
      specs: {
        ...(existing?.specs || {}),
        ...(brand ? { Brand: brand } : {}),
        ...(ram ? { RAM: ram } : {}),
        ...(storage ? { Storage: storage } : {}),
        ...(category ? { Category: category } : {}),
      },
    };

    if (existing) {
      matchedIds.add(existing.id);
      const index = nextProducts.findIndex((current) => current.id === existing.id);
      nextProducts[index] = product;
      updated += 1;
    } else {
      nextProducts.push(product);
      byId.set(product.id, product);
      bySku.set(product.sku.toLowerCase(), product);
      added += 1;
    }
  });

  return { products: nextProducts, found, updated, added, errors };
};
