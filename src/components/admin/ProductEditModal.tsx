"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types/product";
import { Camera, Save, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, updates: Partial<Product>) => void;
}

export function ProductEditModal({
  product,
  isOpen,
  onClose,
  onSave,
}: ProductEditModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const categories = [
    { value: "control-panels", label: "Control Panels" },
    { value: "smart-lighting", label: "Smart Lighting" },
    { value: "security-cameras", label: "Security Cameras" },
    { value: "smart-speakers", label: "Smart Speakers" },
    { value: "smart-locks", label: "Smart Locks" },
    { value: "sensors-detectors", label: "Sensors & Detectors" },
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        brand: product.brand,
        model: product.model,
        stockCount: product.stockCount,
        inStock: product.inStock,
        warranty: product.warranty,
        features: product.features,
        specifications: product.specifications,
        badges: product.badges,
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof Product, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    for (const file of files) {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the removed URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    handleInputChange("features", newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [...(formData.features || []), ""];
    handleInputChange("features", newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = (formData.features || []).filter((_, i) => i !== index);
    handleInputChange("features", newFeatures);
  };

  const handleSpecificationChange = (key: string, value: string) => {
    const newSpecs = { ...(formData.specifications || {}) };
    if (value.trim()) {
      newSpecs[key] = value;
    } else {
      delete newSpecs[key];
    }
    handleInputChange("specifications", newSpecs);
  };

  const addSpecification = () => {
    const newSpecs = { ...(formData.specifications || {}), "": "" };
    handleInputChange("specifications", newSpecs);
  };

  const handleSave = async () => {
    if (!product) return;

    setSaving(true);
    try {
      // In a real app, you would upload images to a server here
      // For now, we'll just store the file names
      const imageUploads = imageFiles.map((file) => file.name);

      const updates = {
        ...formData,
        imageUploads: [...(product.imageUploads || []), ...imageUploads],
      };

      onSave(product.id, updates);
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand || ""}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "price",
                      Number.parseFloat(e.target.value),
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "originalPrice",
                      Number.parseFloat(e.target.value),
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="stockCount">Stock Count</Label>
                <Input
                  id="stockCount"
                  type="number"
                  value={formData.stockCount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "stockCount",
                      Number.parseInt(e.target.value),
                    )
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model || ""}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  value={formData.warranty || ""}
                  onChange={(e) =>
                    handleInputChange("warranty", e.target.value)
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                Add Feature
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.features || []).map((feature, index) => (
                <div
                  key={`feature-${index}-${feature.substring(0, 10)}`}
                  className="flex items-center space-x-2"
                >
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter feature..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specs" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Specifications</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecification}
              >
                Add Specification
              </Button>
            </div>
            <div className="space-y-2">
              {Object.entries(formData.specifications || {}).map(
                ([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-2">
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newSpecs = { ...(formData.specifications || {}) };
                        delete newSpecs[key];
                        newSpecs[e.target.value] = value;
                        handleInputChange("specifications", newSpecs);
                      }}
                      placeholder="Property name..."
                    />
                    <Input
                      value={value}
                      onChange={(e) =>
                        handleSpecificationChange(key, e.target.value)
                      }
                      placeholder="Value..."
                    />
                  </div>
                ),
              )}
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div>
              <Label>Upload Additional Images</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Current Images */}
            <div>
              <Label>Current Images</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="relative">
                  <img
                    src={product.image}
                    alt="Main product image"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-1 left-1 text-xs">Main</Badge>
                </div>
                {product.images?.slice(1).map((image, index) => (
                  <div
                    key={`product-image-${image.substring(image.lastIndexOf("/") + 1, image.lastIndexOf("/") + 11)}`}
                    className="relative"
                  >
                    <img
                      src={image}
                      alt={`Product image ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* New Images Preview */}
            {previewUrls.length > 0 && (
              <div>
                <Label>New Images</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {previewUrls.map((url, index) => (
                    <div
                      key={`preview-${url.substring(url.length - 10)}-${index}`}
                      className="relative"
                    >
                      <img
                        src={url}
                        alt={`New image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 p-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Badge className="absolute top-1 left-1 text-xs bg-green-500">
                        <Camera className="h-3 w-3" />
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#43abc3] hover:bg-[#3a9bb5]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
