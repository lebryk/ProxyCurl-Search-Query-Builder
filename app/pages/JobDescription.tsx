import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SearchQueryBuilder } from "@/components/job-description/SearchQueryBuilder";
import { CompanyProfileSection } from "@/components/job-description/CompanyProfileSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchWeightsTab } from "@/components/job-description/SearchWeightsTab";
import { ChatSection } from "@/components/chat/ChatSection";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { useProject } from "@/contexts/ProjectContext";
import { SearchQueryForm } from "@/components/job-description/SearchQueryForm";

// Initial search weights data
const initialSearchWeights = [
  { fieldId: 'jobTitles', label: 'Job Titles', weight: 90, isObligatory: true },
  { fieldId: 'skills', label: 'Skills', weight: 100, isObligatory: true },
  { fieldId: 'experience', label: 'Experience', weight: 80, isObligatory: false },
  { fieldId: 'education', label: 'Education', weight: 70, isObligatory: false },
  { fieldId: 'companies', label: 'Companies', weight: 60, isObligatory: false },
  { fieldId: 'languages', label: 'Languages', weight: 50, isObligatory: false },
  { fieldId: 'location', label: 'Location', weight: 40, isObligatory: false },
  { fieldId: 'industry', label: 'Industry', weight: 30, isObligatory: false },
];

const JobDescription = () => {
  const { activeProject } = useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [accordionState, setAccordionState] = useState<string[]>(['chat']);
  const [activeTab, setActiveTab] = useState("description");
  const [activeProfile, setActiveProfile] = useState<any | null>(null);
  const [searchWeights, setSearchWeights] = useState(initialSearchWeights);

  const handleChatSubmit = (message: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Please select a project to continue</p>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={65} minSize={30}>
        <main className="h-screen overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <SearchQueryBuilder />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Job Description</TabsTrigger>
                <TabsTrigger value="weights">Score Weights</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <CompanyProfileSection />
                <SearchQueryForm />
              </TabsContent>

              <TabsContent value="weights">
                <SearchWeightsTab
                  searchWeights={searchWeights}
                  onWeightsChange={setSearchWeights}
                  activeProfile={activeProfile}
                  onProfileChange={setActiveProfile}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </ResizablePanel>
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={35} minSize={20}>
        <div className="flex flex-col h-[100dvh]">
          <div className="flex-1 min-h-0">
            <Accordion 
              type="multiple" 
              value={accordionState}
              onValueChange={setAccordionState}
              className="h-full flex flex-col"
            >
              <AccordionItem value="help" className="border-none shrink-0">
                <AccordionTrigger className="hover:bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-sm">How to Use This Page</span>
                    </div>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        accordionState.includes('help') ? "" : "-rotate-90"
                      )} 
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3">
                  <div className="h-[200px] overflow-y-auto pr-2">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        Create precise search queries with the help of our AI assistant. Simply start a chat on the right to get guidance through the entire process.
                      </p>
                      <p>
                        You can paste your current job description, and the AI will help you extract relevant criteria like skills, experience, and qualifications.
                        Creating an accurate search query is crucial for finding the best-matching candidates.
                      </p>
                      <p>
                        The more detailed your search criteria, the better matches you'll find. Our AI assistant will help you optimize your search parameters
                        to ensure you don't miss any qualified candidates while maintaining high relevance in the results.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <div className="flex-1 min-h-0">
                <ChatSection
                  messages={messages}
                  onSubmit={handleChatSubmit}
                />
              </div>
            </Accordion>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default JobDescription;