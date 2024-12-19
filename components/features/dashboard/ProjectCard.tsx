import { type Project } from "@/types/project";
import { FileSearch, Search, Star, ClipboardCheck, Scale, Send } from "lucide-react";

const ProgressStep = ({ icon: Icon, progress }: { icon: any; progress: number }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`p-2 rounded-lg ${progress > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="h-1 w-8 bg-gray-200 rounded">
      <div 
        className="h-full bg-blue-600 rounded" 
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export const ProjectCard = ({ project }: { project: Project }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
        <p className="text-sm text-gray-500">{project.position}</p>
      </div>
      <span className="text-sm text-gray-400">Created: {new Date(project.created_at).toLocaleDateString()}</span>
    </div>
    
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <ProgressStep icon={FileSearch} progress={project.project_progress?.query_builder || 0} />
        <ProgressStep icon={Search} progress={project.project_progress?.candidate_search || 0} />
        <ProgressStep icon={Star} progress={project.project_progress?.shortlist || 0} />
        <ProgressStep icon={ClipboardCheck} progress={project.project_progress?.culture_fit || 0} />
        <ProgressStep icon={Scale} progress={project.project_progress?.comparison || 0} />
        <ProgressStep icon={Send} progress={project.project_progress?.outreach || 0} />
      </div>
    </div>
  </div>
);