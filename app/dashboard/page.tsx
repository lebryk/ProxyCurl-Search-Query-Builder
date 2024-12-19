"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "@/components/features/dashboard/ProjectCard";
import { DashboardStats } from "@/components/features/dashboard/DashboardStats";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const Index = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { data: projects, isLoading, error } = useProjects();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/auth/login");
      }
    });

    checkUser();
    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading projects",
        description: error.message,
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
            <p className="text-gray-500">Track your recruitment progress across all projects</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="px-4 py-2"
            >
              Filter
            </Button>
            <Button 
              variant="default"
              className="px-4 py-2"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="mt-2 text-sm text-gray-500">Get started by creating your first recruitment project.</p>
            </div>
          )}
        </div>

        <DashboardStats />
      </div>
    </div>
  );
};

export default Index;