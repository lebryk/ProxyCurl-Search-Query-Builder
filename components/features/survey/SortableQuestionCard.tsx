import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SurveyQuestionCard, type SurveyQuestion } from "./SurveyQuestionCard";

interface Props {
  question: SurveyQuestion;
  onUpdate: (question: SurveyQuestion) => void;
  onDelete: (id: string) => void;
}

export function SortableQuestionCard({ question, onUpdate, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: question.id,
    data: question
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : undefined
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <SurveyQuestionCard
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}
