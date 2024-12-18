import { BaseMessage } from "@langchain/core/messages";
import { PeopleSearchQueryParams } from "./searchTypes";

export type OptimizedQuery = PeopleSearchQueryParams;

export interface MessagesState {
    messages: BaseMessage[];
}

export interface AgentState extends MessagesState {
    messages: BaseMessage[];
    requirements_complete?: boolean;
    collected_requirements?: string[];
    optimized_query?: OptimizedQuery;
}
