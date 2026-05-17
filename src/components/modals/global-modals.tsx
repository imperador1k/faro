"use client";

import dynamic from "next/dynamic";
import { useLessonModalStore } from "@/store/use-lesson-modal-store";
import { useHeartsModalStore } from "@/store/use-hearts-modal-store";

const LessonStartModal = dynamic(() => import("@/components/modals/lesson-start-modal").then(mod => mod.LessonStartModal), { ssr: false });
const HeartsModal = dynamic(() => import("@/components/modals/hearts-modal").then(mod => mod.HeartsModal), { ssr: false });
const ProModal = dynamic(() => import("@/components/modals/pro-modal").then(mod => mod.ProModal), { ssr: false });

export const GlobalModals = () => {
    const { isOpen: isLessonOpen, lesson, closeModal: closeLessonModal } = useLessonModalStore();
    const { isOpen: isHeartsOpen, closeModal: closeHeartsModal } = useHeartsModalStore();

    return (
        <>
            <LessonStartModal 
                lesson={lesson} 
                isOpen={isLessonOpen} 
                onClose={closeLessonModal} 
            />
            <HeartsModal />
            <ProModal />
        </>
    );
};
