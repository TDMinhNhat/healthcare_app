import { useMutation } from "@tanstack/react-query";
import { Platform } from "react-native";
import { detect } from "../services/detectService";

const useDetect = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (photoPath: string) => {
      const formData = new FormData();
      formData.append("image", {
        uri: `file://${photoPath}`,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
      return await detect(formData);
    },
  });

  return {
    detectFace: mutateAsync,
    isPending,
    error,
  };
};

export default useDetect;
