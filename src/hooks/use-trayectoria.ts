import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  NewMilestone,
  NewAchievement,
} from "@/lib/api/trayectoria";

/* ── Hitos ── */
export const useMilestones = () =>
  useQuery({ queryKey: ["milestones"], queryFn: getMilestones });

export const useCreateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMilestone,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["milestones"] }),
  });
};

export const useUpdateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewMilestone }) =>
      updateMilestone(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["milestones"] }),
  });
};

export const useDeleteMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMilestone,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["milestones"] }),
  });
};

/* ── Logros ── */
export const useAchievements = () =>
  useQuery({ queryKey: ["achievements"], queryFn: getAchievements });

export const useCreateAchievement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAchievement,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
};

export const useUpdateAchievement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewAchievement }) =>
      updateAchievement(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
};

export const useDeleteAchievement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
};
