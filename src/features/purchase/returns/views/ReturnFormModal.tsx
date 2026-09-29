// src/features/purchase/invoices/views/PurchaseFormModal.tsx
import React, { useState } from 'react';
import { useCreatePurchaseMutation } from '../../api';
import { useGetSuppliersQuery } from '../../../masters/suppliers/api/suppliersApi';
import { useGetProductsQuery } from '../../../masters/products/api/productsApi';
import { useGetWarehousesQuery } from '../../../masters/warehouses/api/warehousesApi';
import { PurchaseFormItems } from '@/features/purchase/invoices/views/PurchaseFormItems';
import { Modal, ModalHeader, ModalBody, Button, Label, TextInput, Select, Spinner } from 'flowbite-react';
import { ShoppingBag } from 'lucide-react';

export const ReturnFormModal: React.FC<{ show: boolean; onClose: () => void }> = ({ show, onClose }) => {
  const [suppId, setSuppId] = useState(''), [pDate, setPDate] = useState(new Date().toISOString().split('T')[0]), [notes, setNotes] = useState('');
  const [lines, setLines] = useState<any[]>([{ product_id: 0, warehouse_id: 0, quantity: 1, unit_cost: 0 }]);

  const { data: suppliers } = useGetSuppliersQuery({ page: 1, search: '' }), { data: prods } = useGetProductsQuery({ page: 1, search: '' }), { data: whs } = useGetWarehousesQuery({ page: 1, search: '' });
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  const grossCalculated = lines.reduce((acc, curr) => acc + (curr.quantity * curr.unit_cost), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // FIXED: Strips timezone text formatting tags safely to provide clean standard MySQL layout strings: YYYY-MM-DD
      const formattedMysqlDate = new Date(pDate).toISOString().split('T')[0];

      await createPurchase({
        supplier_id: Number(suppId), 
        purchase_date: formattedMysqlDate, 
        notes: notes.trim() || null, 
        // FIXED: Remapped local form state hook array 'lines' onto the precise payload key 'items' expected by Laravel controller validations!
        items: lines.map(i => ({ 
          product_id: Number(i.product_id), 
          warehouse_id: Number(i.warehouse_id), 
          quantity: Number(i.quantity), 
          unit_cost: Number(i.unit_cost) 
        })) 
      }).unwrap();
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b p-4"><span className="text-lg font-bold flex items-center gap-2"><ShoppingBag className="text-primary-600" /> Book Purchase Invoice</span></ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div><Label>Select Supplier</Label><Select value={suppId} onChange={(e) => setSuppId(e.target.value)} required><option value="">Select Supplier...</option>{suppliers?.data.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
          <div><Label>Purchase Date</Label><TextInput type="date" value={pDate} onChange={(e) => setPDate(e.target.value)} required /></div>
          <div><Label>Notes</Label><TextInput placeholder="Remarks..." value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <PurchaseFormItems items={lines} setItems={setLines} products={prods?.data || []} warehouses={whs?.data || []} />
          <div className="p-2.5 bg-gray-50 border rounded-lg text-xs font-mono font-bold flex justify-between text-gray-500"><span>Gross Total:</span><span className="text-gray-900 font-sans font-bold">₹{grossCalculated.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
          <div className="flex gap-2 border-t pt-3"><Button color="gray" size="sm" className="w-full" onClick={onClose} disabled={isLoading}>Cancel</Button><Button type="submit" color="blue" size="sm" className="w-full" disabled={isLoading}>{isLoading ? <Spinner size="sm" /> : 'Post Invoice'}</Button></div>
        </form>
      </ModalBody>
    </Modal>
  );
};
