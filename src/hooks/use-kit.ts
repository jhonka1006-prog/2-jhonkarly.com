import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getKitFiles, upsertKitFile, KitKind } from "@/lib/api/kit";
import { uploadPublicFile } from "@/lib/api/storage";

export const useKitFiles = () =>
  useQuery({ queryKey: ["press_kit_files"], queryFn: getKitFiles });

/** Sube el archivo a Storage y actualiza (o crea) el slot del kit */
export const useReplaceKitFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ kind, file }: { kind: KitKind; file: File }) => {
      const url = await uploadPublicFile("kit", file);
      await upsertKitFile(kind, url, file.name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["press_kit_files"] }),
  });
};
