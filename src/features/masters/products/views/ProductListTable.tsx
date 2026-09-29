// src/features/masters/products/views/ProductListTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Badge,
  Button,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/currency";
import type { Product } from "../types/productTypes";

interface TableProps {
  products: Product[];
  onDelete: (uuid: string) => void;
}

export const ProductListTable: React.FC<TableProps> = ({
  products,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <Table hoverable>
        <TableHead className="bg-gray-100 dark:bg-gray-700">
          <TableRow>
            <TableHeadCell>Product Details</TableHeadCell>
            <TableHeadCell>SKU / Type</TableHeadCell>
            <TableHeadCell>Category / Brand</TableHeadCell>
            <TableHeadCell>Pricing (Sale/Cost)</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell className="text-right">Actions</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                No matching product records located.
              </TableCell>
            </TableRow>
          ) : (
            products.map((prod) => (
              <TableRow key={prod.uuid} className="bg-white dark:bg-gray-800">
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{prod.name}</span>
                    <span className="text-xs text-gray-400">{prod.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm">{prod.sku}</span>
                    <span className="text-xs text-gray-500">
                      {prod.product_type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {prod.category_name || "—"} /{" "}
                    <span className="text-gray-500">{prod.brand_name || "—"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(prod.selling_price)}
                    <div className="text-xs font-normal text-gray-400">
                      Cost: {formatCurrency(prod.purchase_price)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    color={prod.is_active ? "success" : "failure"}
                    className="w-fit"
                  >
                    {prod.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="xs"
                      color="light"
                      onClick={() =>
                        navigate(`/masters/products/${prod.uuid}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => onDelete(prod.uuid)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
