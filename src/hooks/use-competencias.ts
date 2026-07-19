import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCompetitions,
  createCompetition,
  deleteCompetition,
} from "@/lib/api/competencias";

export const useCompetitions = () =>
  useQuery({ queryKey: ["competitions"], queryFn: getCompetitions });

export const useCreateCompetition = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCompetition,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["competitions"] }),
  });
};

export const useDeleteCompetition = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCompetition,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["competitions"] }),
  });
};
