import { BaseMessage } from "@langchain/core/messages";
import { PeopleSearchQueryParams } from "@/types/PersonSearch";

export type OptimizedQuery = PeopleSearchQueryParams;

export interface MessagesState {
    messages: BaseMessage[];
}

export interface AgentState extends MessagesState {
    messages: BaseMessage[];
    requirements_complete?: boolean;
    collected_requirements?: string[];
    optimized_query?: OptimizedQuery;
    logs?: {
        message: string;
        done: boolean;
    }[];
}
