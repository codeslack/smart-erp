// src/layouts/GlobalConfirmContainer.tsx

import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { closeConfirmDialog } from "@/store/confirmSlice";
import { showToast } from "@/store/notificationSlice";
import { useDeleteProductMutation } from "@/features/masters/products/api/productsApi";

import {
  useDeleteJournalMutation,
  usePostJournalVoucherMutation,
  useCancelJournalVoucherMutation,
} from "@/features/accounting/journals/api/journalsApi";

import {
  useApprovePurchaseMutation,
  useDeletePurchaseMutation,
  useApprovePurchaseOrderMutation,
} from "@/features/purchase/api"; // FIXED: Loaded Procurement RTK hooks

import { ConfirmModal } from "@/components/ConfirmModal";

export const GlobalConfirmContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, title, message, actionType, targetId } = useAppSelector(
    (state) => state.confirmDialog,
  );

  const [deleteProduct, { isLoading: isDp }] = useDeleteProductMutation();
  const [deleteJournal, { isLoading: isD }] = useDeleteJournalMutation();
  const [postVoucher, { isLoading: isP }] = usePostJournalVoucherMutation();
  const [cancelVoucher, { isLoading: isC }] = useCancelJournalVoucherMutation();

  const [approvePurchase, { isLoading: isAP }] = useApprovePurchaseMutation();
  const [deletePurchase, { isLoading: isDP }] = useDeletePurchaseMutation();
  const [approvePurchaseOrder, { isLoading: isAPO }] =
    useApprovePurchaseOrderMutation();

  const handleExecuteAction = async () => {
    if (!targetId || !actionType) return;

    const targetUuid = String(targetId);
    
    const isProduct = title.includes("Product");
    const isVoucher = title.includes("Voucher");
    const isOrder = title.includes("Order");

    try {
      if (actionType === "post") {
        // if (isVoucher) await postVoucher(targetId).unwrap();
        // else if (isOrder) await approvePurchaseOrder(targetId).unwrap();
        // else await approvePurchase(targetId).unwrap();
        // dispatch(
        //   showToast({
        //     message: "Transaction officially posted and logged successfully.",
        //     type: "success",
        //   }),
        // );
      } else if (actionType === "cancel" && isVoucher) {
        // await cancelVoucher(targetId).unwrap();
        // dispatch(
        //   showToast({
        //     message: "Journal voucher successfully voided.",
        //     type: "info",
        //   }),
        // );
      } else if (actionType === "delete") {
        if (isProduct) await deleteProduct(targetUuid).unwrap();
        // else if (isVoucher) await deleteJournal(targetId).unwrap();
        // else await deletePurchase(targetId).unwrap();
        dispatch(
          showToast({
            message: "Record permanently purged from system logs.",
            type: "success",
          }),
        );
      }
      dispatch(closeConfirmDialog());
    } catch {
      dispatch(
        showToast({
          message: "Operational processing failure on backend.",
          type: "failure",
        }),
      );
    }
  };

  return (
    <ConfirmModal
      show={isOpen}
      onClose={() => dispatch(closeConfirmDialog())}
      onConfirm={handleExecuteAction}
      isLoading={isDp || isD || isP || isC || isAP || isDP || isAPO}
      title={title}
      message={message}
    />
  );
};
