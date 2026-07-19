import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSponsors, crearSponsor, eliminarSponsor, NuevoSponsor } from "@/lib/api/sponsors";
import { uploadPublicFile } from "@/lib/api/storage";

export const useSponsors = () =>
  useQuery({ queryKey: ["sponsors"], queryFn: getSponsors, retry: false });

/** Sube el logo a Storage (carpeta sponsors/) y registra el patrocinador */
export const useCrearSponsor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, ...datos }: Omit<NuevoSponsor, "logo_url"> & { file: File }) => {
      const logo_url = await uploadPublicFile("sponsors", file);
      await crearSponsor({ ...datos, logo_url });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sponsors"] }),
  });
};

export const useEliminarSponsor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eliminarSponsor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sponsors"] }),
  });
};
