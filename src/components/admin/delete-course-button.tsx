"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash, Loader2 } from "lucide-react";
import { deleteCourse } from "@/actions/admin";
import { Button } from "@/components/ui/button";

type Props = {
  courseId: number;
  courseTitle: string;
};

export const DeleteCourseButton = ({ courseId, courseTitle }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Tens a certeza que queres eliminar o curso "${courseTitle}"?

Esta ação é irreversível e irá apagar todas as unidades, lições e desafios associados.`,
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteCourse(courseId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Erro ao eliminar o curso. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      title="Eliminar curso"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Trash className="w-5 h-5" />
      )}
    </Button>
  );
};
