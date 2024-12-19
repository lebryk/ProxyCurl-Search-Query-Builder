export interface Project {
  id: string;
  user_id: string;
  name: string;
  position: string;
  created_at: string;
  updated_at: string;
  project_progress?: {
    id: string;
    project_id: string;
    query_builder: number;
    candidate_search: number;
    shortlist: number;
    culture_fit: number;
    comparison: number;
    outreach: number;
    updated_at: string;
  };
}