import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  OrderStatus,
} from "@/lib/api/pedidos";

export const useMyOrders = (userId: string | undefined) =>
  useQuery({
    queryKey: ["orders", "mine", userId],
    queryFn: () => getMyOrders(userId!),
    enabled: !!userId,
  });

export const useAllOrders = () =>
  useQuery({ queryKey: ["orders", "all"], queryFn: getAllOrders });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};
