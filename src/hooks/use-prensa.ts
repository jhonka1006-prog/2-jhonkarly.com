import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPressNotes,
  createPressNote,
  deletePressNote,
  getPressPhotos,
  createPressPhoto,
  deletePressPhoto,
} from "@/lib/api/prensa";

/* ── Notas de prensa ── */

export const usePressNotes = () =>
  useQuery({ queryKey: ["press_notes"], queryFn: getPressNotes });

export const useCreatePressNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPressNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["press_notes"] }),
  });
};

export const useDeletePressNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePressNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["press_notes"] }),
  });
};

/* ── Galería de fotos ── */

export const usePressPhotos = () =>
  useQuery({ queryKey: ["press_photos"], queryFn: getPressPhotos });

export const useCreatePressPhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPressPhoto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["press_photos"] }),
  });
};

export const useDeletePressPhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePressPhoto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["press_photos"] }),
  });
};
