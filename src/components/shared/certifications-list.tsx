"use client";

import { Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface Certification {
  id: string;
  course: {
    title: string;
    imageSrc: string;
  };
  createdAt: Date;
}

interface CertificationsListProps {
  certifications: Certification[];
}

export const CertificationsList = ({
  certifications,
}: CertificationsListProps) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="mb-14">
      <h2 className="text-2xl font-black text-stone-700 dark:text-slate-200 tracking-tight uppercase mb-6 flex items-center gap-3">
        <Award className="h-6 w-6 text-amber-500" strokeWidth={2.5} />
        Certificações Oficiais
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <Link href={`/certificate/${cert.id}`} key={cert.id} target="_blank">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-stone-200 dark:border-slate-800 border-b-[6px] hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col items-center text-center">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none" />

              <div className="w-14 h-14 relative z-10 group-hover:scale-110 transition-transform mb-4 drop-shadow-sm">
                <Image
                  src={cert.course.imageSrc}
                  alt={cert.course.title}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="font-black text-stone-700 dark:text-slate-200 text-lg mb-1 relative z-10">
                {cert.course.title}
              </h3>
              <p className="text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest relative z-10">
                Emitido a {format(new Date(cert.createdAt), "dd/MM/yyyy")}
              </p>

              <div className="mt-4 text-xs font-bold text-sky-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Ver Diploma &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
