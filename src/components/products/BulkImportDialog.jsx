import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet } from "lucide-react";
import { productsApi, uploadApi } from "@/services/api";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function BulkImportDialog({ open, onOpenChange, onImported }) {
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | importing | done | error
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileType = file.name.split('.').pop().toLowerCase();
      
      if (fileType === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const products = results.data.map(row => ({
              name: row.name || row.Name || row.product_name,
              sku: row.sku || row.SKU || `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              category: row.category || row.Category || '',
              supplier: row.supplier || row.Supplier || '',
              purchase_price: parseFloat(row.purchase_price || row.PurchasePrice || 0),
              selling_price: parseFloat(row.selling_price || row.SellingPrice || 0),
              stock_quantity: parseInt(row.stock_quantity || row.StockQuantity || 0),
              min_stock_alert: parseInt(row.min_stock_alert || row.MinStockAlert || 10),
              barcode: row.barcode || row.Barcode || '',
              status: row.status || row.Status || 'active'
            })).filter(p => p.name);
            resolve(products);
          },
          error: reject
        });
      } 
      else if (fileType === 'xlsx' || fileType === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);
            
            const products = rows.map(row => ({
              name: row.name || row.Name || row.product_name,
              sku: row.sku || row.SKU || `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              category: row.category || row.Category || '',
              supplier: row.supplier || row.Supplier || '',
              purchase_price: parseFloat(row.purchase_price || row.PurchasePrice || 0),
              selling_price: parseFloat(row.selling_price || row.SellingPrice || 0),
              stock_quantity: parseInt(row.stock_quantity || row.StockQuantity || 0),
              min_stock_alert: parseInt(row.min_stock_alert || row.MinStockAlert || 10),
              barcode: row.barcode || row.Barcode || '',
              status: row.status || row.Status || 'active'
            })).filter(p => p.name);
            
            resolve(products);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      } 
      else {
        reject(new Error('Unsupported file type. Please upload CSV or Excel file.'));
      }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError("");
    
    try {
      // First upload the file (optional - if you want to store it)
      setStatus("processing");
      
      // Parse the file locally
      const products = await parseFile(file);
      
      if (products.length === 0) {
        setError("No valid products found in file");
        setStatus("error");
        return;
      }

      setStatus("importing");
      
      // Bulk create products
      await productsApi.bulkCreate(products);
      
      setResults({ count: products.length });
      setStatus("done");
    } catch (err) {
      console.error("Import failed:", err);
      setError(err.message || "Failed to import products");
      setStatus("error");
    }
  };

  const handleClose = () => {
    if (status === "done") onImported();
    setStatus("idle");
    setResults(null);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          {status === "idle" && (
            <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-accent/50 transition-colors">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-sm">Upload CSV or Excel file</p>
                <p className="text-xs text-muted-foreground mt-1">Columns: name, sku, category, supplier, purchase_price, selling_price, stock_quantity</p>
              </div>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
          {(status === "uploading" || status === "processing" || status === "importing") && (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-sm mt-3 text-muted-foreground">
                {status === "uploading" ? "Uploading file..." : 
                 status === "processing" ? "Processing data..." : 
                 "Importing products..."}
              </p>
            </div>
          )}
          {status === "done" && results && (
            <div className="text-center py-8">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-semibold">Import Complete!</p>
              <p className="text-sm text-muted-foreground mt-1">{results.count} products imported successfully</p>
            </div>
          )}
          {status === "error" && (
            <div className="text-center py-8">
              <p className="text-destructive font-medium">Import Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {status === "done" ? "Done" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}