import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  Download,
  FileSpreadsheet,
  LogOut,
  PackageCheck,
  PackageX,
  Pencil,
  RefreshCw,
  Upload,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/lib/products";
import { formatINR } from "@/lib/currency";
import {
  exportCurrentInventory,
  getStockLabel,
  InventoryImportPreview,
  isProductAvailable,
  downloadInventoryTemplate,
  parseInventoryWorkbook,
} from "@/lib/inventory";
import { isAdminAuthenticated, signOutAdmin } from "@/lib/adminAuth";
import { useInventory } from "@/context/InventoryContext";
import { useToast } from "@/hooks/use-toast";

type EditDraft = {
  name: string;
  brand: string;
  category: string;
  color: string;
  ram: string;
  storage: string;
  price: string;
  originalPrice: string;
  stockQuantity: string;
  sku: string;
  image: string;
  description: string;
  status: Product["status"];
};

const createDraft = (product: Product): EditDraft => ({
  name: product.name,
  brand: product.brand,
  category: product.category,
  color: product.color || "",
  ram: product.ram || "",
  storage: product.storage || "",
  price: String(product.price),
  originalPrice: product.originalPrice ? String(product.originalPrice) : "",
  stockQuantity: String(product.stockQuantity),
  sku: product.sku,
  image: product.image,
  description: product.description,
  status: product.status,
});

export default function AdminInventory() {
  const [, setLocation] = useLocation();
  const { products, lastUpdated, replaceInventory, updateProduct } = useInventory();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<InventoryImportPreview | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockOnly, setStockOnly] = useState(false);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (!isAdminAuthenticated()) setLocation("/admin");
  }, [setLocation]);

  const metrics = useMemo(
    () => ({
      totalProducts: products.length,
      totalStock: products.reduce((total, product) => total + product.stockQuantity, 0),
      outOfStock: products.filter((product) => !isProductAvailable(product)).length,
    }),
    [products],
  );

  const openEditor = (product: Product, onlyStock = false) => {
    setEditingProduct(product);
    setDraft(createDraft(product));
    setStockOnly(onlyStock);
    setEditError("");
  };

  const closeEditor = () => {
    setEditingProduct(null);
    setDraft(null);
    setEditError("");
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsReading(true);
    setUploadError("");
    setPreview(null);
    setFileName(file.name);
    try {
      setPreview(await parseInventoryWorkbook(file, products));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to read the Excel file.");
    } finally {
      setIsReading(false);
    }
  };

  const applyImport = () => {
    if (!preview) return;
    replaceInventory(preview.products);
    toast({
      title: "Inventory updated",
      description: `${preview.updated} products updated and ${preview.added} products added.`,
    });
    setPreview(null);
    setFileName("");
  };

  const saveEdit = () => {
    if (!editingProduct || !draft) return;
    const price = Number(draft.price);
    const originalPrice = draft.originalPrice ? Number(draft.originalPrice) : undefined;
    const stockQuantity = Number(draft.stockQuantity);
    if (!Number.isFinite(price) || price < 0) {
      setEditError("Price must be zero or greater.");
      return;
    }
    if (originalPrice !== undefined && (!Number.isFinite(originalPrice) || originalPrice < price)) {
      setEditError("Original price must be equal to or greater than price.");
      return;
    }
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setEditError("Stock must be a non-negative whole number.");
      return;
    }
    if (!draft.name.trim() || !draft.sku.trim() || !draft.category.trim()) {
      setEditError("Product name, SKU, and category are required.");
      return;
    }
    if (
      products.some(
        (product) =>
          product.id !== editingProduct.id &&
          product.sku.toLowerCase() === draft.sku.trim().toLowerCase(),
      )
    ) {
      setEditError("SKU must be unique.");
      return;
    }

    updateProduct(editingProduct.id, {
      name: draft.name.trim(),
      brand: draft.brand.trim() || draft.name.trim().split(" ")[0],
      category: draft.category.trim(),
      color: draft.color.trim() || undefined,
      ram: draft.ram.trim() || undefined,
      storage: draft.storage.trim() || undefined,
      price,
      originalPrice,
      stockQuantity,
      sku: draft.sku.trim(),
      image: draft.image.trim() || editingProduct.image,
      images: draft.image.trim() ? [draft.image.trim()] : editingProduct.images,
      description: draft.description.trim() || draft.name.trim(),
      status: draft.status,
      specs: {
        ...editingProduct.specs,
        Brand: draft.brand.trim() || draft.name.trim().split(" ")[0],
        Category: draft.category.trim(),
        ...(draft.ram.trim() ? { RAM: draft.ram.trim() } : {}),
        ...(draft.storage.trim() ? { Storage: draft.storage.trim() } : {}),
      },
    });
    toast({
      title: stockOnly ? "Stock updated" : "Product updated",
      description: `${draft.name} now has ${stockQuantity} units available.`,
    });
    closeEditor();
  };

  if (!isAdminAuthenticated()) return null;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
              Krishna Electronics Admin
            </p>
            <h1 className="text-xl font-bold">Inventory Management</h1>
          </div>
          <Button
            variant="outline"
            className="border-slate-600 bg-transparent text-white hover:bg-slate-800 hover:text-white"
            onClick={() => {
              signOutAdmin();
              setLocation("/admin");
            }}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 md:px-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Last Updated"
            value={lastUpdated ? new Date(lastUpdated).toLocaleString("en-IN") : "Not available"}
            icon={<RefreshCw size={20} />}
          />
          <MetricCard
            label="Total Products"
            value={metrics.totalProducts.toLocaleString("en-IN")}
            icon={<Boxes size={20} />}
          />
          <MetricCard
            label="Total Stock Units"
            value={metrics.totalStock.toLocaleString("en-IN")}
            icon={<PackageCheck size={20} />}
          />
          <MetricCard
            label="Out of Stock Products"
            value={metrics.outOfStock.toLocaleString("en-IN")}
            icon={<PackageX size={20} />}
          />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold">Excel Inventory</h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload one complete .xlsx inventory file and review changes before applying.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={handleFile}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isReading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Upload size={16} />
                {isReading ? "Reading Excel..." : "Upload Excel"}
              </Button>
              <Button variant="outline" onClick={() => void downloadInventoryTemplate()}>
                <FileSpreadsheet size={16} />
                Download Excel Template
              </Button>
              <Button variant="outline" onClick={() => void exportCurrentInventory(products)}>
                <Download size={16} />
                Export Current Inventory
              </Button>
            </div>
          </div>

          {uploadError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {uploadError}
            </p>
          )}

          {preview && (
            <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50/60 p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="font-bold">Import preview: {fileName}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <PreviewMetric label="Products found" value={preview.found} />
                    <PreviewMetric label="Will be updated" value={preview.updated} />
                    <PreviewMetric label="New products" value={preview.added} />
                    <PreviewMetric label="Rows with errors" value={preview.errors.length} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPreview(null);
                      setFileName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyImport}
                    disabled={preview.updated + preview.added === 0}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
              {preview.errors.length > 0 && (
                <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-red-200 bg-white p-3">
                  {preview.errors.map((error) => (
                    <p key={`${error.row}-${error.message}`} className="text-sm text-red-700">
                      Row {error.row}: {error.message}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold">Current Inventory</h2>
            <p className="text-sm text-slate-500">
              Price and stock changes are reflected immediately in the customer store.
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="min-w-72">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt=""
                          className="h-12 w-12 rounded border bg-white object-contain p-1"
                        />
                        <div>
                          <p className="line-clamp-2 font-semibold">{product.name}</p>
                          <p className="text-xs text-slate-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-48 break-all text-xs">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-semibold">{formatINR(product.price)}</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    <TableCell>
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isProductAvailable(product)
                            ? product.stockQuantity <= 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {getStockLabel(product)}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-slate-500">
                      {new Date(product.lastUpdated).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditor(product)}>
                          <Pencil size={14} />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800"
                          onClick={() => openEditor(product, true)}
                        >
                          Update Stock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>

      <Dialog open={Boolean(editingProduct)} onOpenChange={(open) => !open && closeEditor()}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{stockOnly ? "Update Stock" : "Edit Inventory Product"}</DialogTitle>
            <DialogDescription>{editingProduct?.name}</DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              {!stockOnly && (
                <>
                  <Field label="Product Name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} className="sm:col-span-2" />
                  <Field label="Brand" value={draft.brand} onChange={(brand) => setDraft({ ...draft, brand })} />
                  <Field label="Category" value={draft.category} onChange={(category) => setDraft({ ...draft, category })} />
                  <Field label="Color" value={draft.color} onChange={(color) => setDraft({ ...draft, color })} />
                  <Field label="RAM" value={draft.ram} onChange={(ram) => setDraft({ ...draft, ram })} />
                  <Field label="Storage" value={draft.storage} onChange={(storage) => setDraft({ ...draft, storage })} />
                  <Field label="SKU" value={draft.sku} onChange={(sku) => setDraft({ ...draft, sku })} />
                  <Field label="Price" type="number" value={draft.price} onChange={(price) => setDraft({ ...draft, price })} />
                  <Field label="Original Price" type="number" value={draft.originalPrice} onChange={(originalPrice) => setDraft({ ...draft, originalPrice })} />
                </>
              )}
              <Field
                label="Stock Quantity"
                type="number"
                value={draft.stockQuantity}
                onChange={(stockQuantity) => setDraft({ ...draft, stockQuantity })}
                className={stockOnly ? "sm:col-span-2" : ""}
                autoFocus={stockOnly}
              />
              {!stockOnly && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      value={draft.status}
                      onChange={(event) =>
                        setDraft({ ...draft, status: event.target.value as Product["status"] })
                      }
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option>In Stock</option>
                      <option disabled>Out of Stock</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <Field label="Image" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} className="sm:col-span-2" />
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <textarea
                      id="edit-description"
                      value={draft.description}
                      onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                      rows={3}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    />
                  </div>
                </>
              )}
              {editError && (
                <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
                  {editError}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeEditor}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <span className="rounded-lg bg-orange-100 p-2.5 text-orange-700">{icon}</span>
      </div>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-sm">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  autoFocus = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const id = `edit-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? 1 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
      />
    </div>
  );
}
