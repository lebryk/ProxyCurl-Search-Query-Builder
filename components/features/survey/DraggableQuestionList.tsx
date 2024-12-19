import React from "react";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { SortableQuestionCard } from "./SortableQuestionCard";
import type { SurveyQuestion } from "./SurveyQuestionCard";

interface Props {
  questions: SurveyQuestion[];
  onQuestionsReorder: (questions: SurveyQuestion[]) => void;
  onUpdateQuestion: (question: SurveyQuestion) => void;
  onDeleteQuestion: (id: string) => void;
}

export function DraggableQuestionList({
  questions,
  onQuestionsReorder,
  onUpdateQuestion,
  onDeleteQuestion,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      
      onQuestionsReorder(arrayMove(questions, oldIndex, newIndex));
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={questions}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {questions.map((question) => (
            <SortableQuestionCard
              key={question.id}
              question={question}
              onUpdate={onUpdateQuestion}
              onDelete={onDeleteQuestion}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
