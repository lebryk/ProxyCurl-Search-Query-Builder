"use client";
import { useState } from "react";
import type { Candidate } from "@/types/candidate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, MapPin, GraduationCap, Languages, Award, Brain } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useProject } from "@/contexts/ProjectContext";
import { useShortlistedCandidates } from "@/hooks/useShortlistedCandidates";


const Compare = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const { data: availableCandidates = [] } = useShortlistedCandidates();
  const { activeProject } = useProject();

  const toggleCandidateSelection = (candidate: Candidate) => {
    setSelectedCandidates(prev => {
      const isSelected = prev.some(c => c.id === candidate.id);
      if (isSelected) {
        return prev.filter(c => c.id !== candidate.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, candidate];
    });
  };

  // Generate radar chart data for skills comparison
  const getSkillsData = () => {
    const allSkills = new Set<string>();
    selectedCandidates.forEach(candidate => {
      candidate.skills.forEach(skill => allSkills.add(skill));
    });

    return Array.from(allSkills).map(skill => {
      const data: { [key: string]: any } = { skill };
      selectedCandidates.forEach(candidate => {
        data[candidate.name] = candidate.skills.includes(skill) ? 100 : 0;
      });
      return data;
    });
  };

  // Generate cultural fit data (mock data - in real app would come from assessments)
  const getCulturalFitData = () => {
    const aspects = ['Team Collaboration', 'Innovation', 'Leadership', 'Communication', 'Adaptability'];
    return aspects.map(aspect => {
      const data: { [key: string]: any } = { aspect };
      selectedCandidates.forEach(candidate => {
        data[candidate.name] = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      });
      return data;
    });
  };

  // Generate comparison metrics
  const getComparisonMetrics = () => {
    return [
      {
        category: "Experience",
        metrics: selectedCandidates.map(c => ({
          name: c.name,
          value: c.experience
        }))
      },
      {
        category: "Education",
        metrics: selectedCandidates.map(c => ({
          name: c.name,
          value: c.education.map(e => `${e.degree} in ${e.field}`).join(", ")
        }))
      },
      {
        category: "Languages",
        metrics: selectedCandidates.map(c => ({
          name: c.name,
          value: c.languages.join(", ")
        }))
      },
      {
        category: "Certifications",
        metrics: selectedCandidates.map(c => ({
          name: c.name,
          value: c.certifications.join(", ")
        }))
      },
      {
        category: "Match Score",
        metrics: selectedCandidates.map(c => ({
          name: c.name,
          value: `${c.score}%`
        }))
      }
    ];
  };

  const COLORS = ['#2563eb', '#16a34a', '#9333ea'];

  return (
    <div className="relative flex-1">
      <div className="pr-80">
        <div className="h-full p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Compare Candidates</h1>
              <div className="flex gap-2">
                {selectedCandidates.map((candidate, index) => (
                  <Badge 
                    key={candidate.id}
                    variant="outline"
                    className="gap-2 px-3 py-1"
                    style={{ borderColor: COLORS[index] }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    {candidate.name}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedCandidates.length === 0 ? (
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="text-muted-foreground">
                    <Award className="w-12 h-12 mb-2 mx-auto opacity-20" />
                    <h3 className="text-lg font-medium">No candidates selected</h3>
                    <p>Select candidates from the sidebar to start comparing them</p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-8 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Skills Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={getSkillsData()}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="skill" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            {selectedCandidates.map((candidate, index) => (
                              <Radar
                                key={candidate.id}
                                name={candidate.name}
                                dataKey={candidate.name}
                                stroke={COLORS[index]}
                                fill={COLORS[index]}
                                fillOpacity={0.2}
                              />
                            ))}
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cultural Fit Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Cultural Fit Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={getCulturalFitData()}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="aspect" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            {selectedCandidates.map((candidate, index) => (
                              <Radar
                                key={candidate.id}
                                name={candidate.name}
                                dataKey={candidate.name}
                                stroke={COLORS[index]}
                                fill={COLORS[index]}
                                fillOpacity={0.2}
                              />
                            ))}
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Candidate Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedCandidates.map((candidate) => (
                    <Card key={candidate.id}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                            <AvatarFallback>{`${candidate.first_name?.[0] || ''}${candidate.last_name?.[0] || ''}`}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{candidate.name}</CardTitle>
                            <div className="text-sm text-muted-foreground">{candidate.title}</div>
                            <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Building className="h-3.5 w-3.5" />
                                <span>{candidate.company}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{candidate.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 5).map((skill) => (
                            <Badge 
                              key={skill} 
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 5 && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              +{candidate.skills.length - 5}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Detailed Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          {selectedCandidates.map(candidate => (
                            <TableHead key={candidate.id}>{candidate.name}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getComparisonMetrics().map(({ category, metrics }) => (
                          <TableRow key={category}>
                            <TableCell className="font-medium">{category}</TableCell>
                            {metrics.map(({ name, value }) => (
                              <TableCell key={name}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed top-0 right-0 w-80 border-l bg-background h-full flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="font-semibold">Select Candidates to Compare</h2>
          <p className="text-sm text-muted-foreground">Select up to 3 candidates</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {availableCandidates.map((candidate) => (
              <Card 
                key={candidate.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedCandidates.some(c => c.id === candidate.id) ? 'border-primary' : ''
                }`}
                onClick={() => toggleCandidateSelection(candidate)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                      <AvatarFallback>{`${candidate.first_name?.[0] || ''}${candidate.last_name?.[0] || ''}`}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Compare;