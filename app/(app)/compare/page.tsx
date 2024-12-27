"use client";
import { useState } from "react";
import { SearchResult } from "@/types/PersonSearch";
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
import { removeEmojis } from "@/lib/utils";

const Compare = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<SearchResult[]>([]);
  const { data: availableCandidates = [] } = useShortlistedCandidates();
  const { activeProject } = useProject();

  const toggleCandidateSelection = (candidate: SearchResult) => {
    if (!candidate.profile) return;

    setSelectedCandidates(prev => {
      const isSelected = prev.some(c => c.profile?.public_identifier === candidate.profile?.public_identifier);
      if (isSelected) {
        return prev.filter(c => c.profile?.public_identifier !== candidate.profile?.public_identifier);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, candidate];
    });
  };

  const getCandidateName = (candidate: SearchResult) => {
    const profile = candidate.profile;
    if (!profile) return 'Unknown';
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown';
  };

  // Generate radar chart data for skills comparison
  const getSkillsData = () => {
    const commonSkills = [
      'JavaScript', 'React', 'TypeScript', 'Node.js', 
      'Python', 'SQL', 'AWS', 'System Design',
      'Problem Solving', 'Communication'
    ];

    return commonSkills.map(skill => {
      const data: { [key: string]: any } = { skill };
      selectedCandidates.forEach(candidate => {
        const name = getCandidateName(candidate);
        // Generate a random score between 60-100 for each skill
        data[name] = Math.floor(Math.random() * 40) + 60;
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
        const name = getCandidateName(candidate);
        data[name] = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      });
      return data;
    });
  };

  // Generate comparison metrics
  const getComparisonMetrics = () => {
    return [
      {
        category: "Current Role",
        metrics: selectedCandidates.map(c => ({
          id: c.profile?.public_identifier,
          name: getCandidateName(c),
          value: c.profile?.experiences?.[0]?.title || 'Not specified'
        }))
      },
      {
        category: "Company",
        metrics: selectedCandidates.map(c => ({
          id: c.profile?.public_identifier,
          name: getCandidateName(c),
          value: c.profile?.experiences?.[0]?.company || 'Not specified'
        }))
      },
      {
        category: "Education",
        metrics: selectedCandidates.map(c => ({
          id: c.profile?.public_identifier,
          name: getCandidateName(c),
          value: c.profile?.education?.map(e => `${e.degree_name || ''} ${e.field_of_study ? `in ${e.field_of_study}` : ''}`).join(", ") || 'Not specified'
        }))
      },
      {
        category: "Languages",
        metrics: selectedCandidates.map(c => ({
          id: c.profile?.public_identifier,
          name: getCandidateName(c),
          value: c.profile?.languages?.join(", ") || 'Not specified'
        }))
      },
      {
        category: "Certifications",
        metrics: selectedCandidates.map(c => ({
          id: c.profile?.public_identifier,
          name: getCandidateName(c),
          value: c.profile?.certifications?.map(cert => cert.name).filter(Boolean).join(", ") || 'Not specified'
        }))
      }
    ];
  };

  return (
    <div className="relative min-h-screen">
      <div className="pr-80">
        <div className="container py-8 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Compare Candidates</h1>
          </div>

          <div className="space-y-8">
            {selectedCandidates.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <p>Select candidates from the sidebar to start comparing</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Selected Candidates Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCandidates.map((candidate) => {
                    const profile = candidate.profile;
                    if (!profile) return null;

                    const name = getCandidateName(candidate);
                    const initials = removeEmojis(name)
                      .split(" ")
                      .map(n => n[0])
                      .filter(Boolean)
                      .join("")
                      .toUpperCase();

                    return (
                      <Card key={profile.public_identifier}>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="h-16 w-16 ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all mb-3">
                              <AvatarImage src={profile.profile_pic_url || ''} alt={name} />
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium">
                                {initials || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {profile.headline || profile.experiences?.[0]?.title || 'No title'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Skills Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getSkillsData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {selectedCandidates.map((candidate, index) => {
                          const name = getCandidateName(candidate);
                          return (
                            <Radar
                              key={candidate.profile?.public_identifier}
                              name={name}
                              dataKey={name}
                              stroke={`hsl(${index * 120}, 70%, 50%)`}
                              fill={`hsl(${index * 120}, 70%, 50%)`}
                              fillOpacity={0.3}
                            />
                          );
                        })}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Cultural Fit Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cultural Fit Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getCulturalFitData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="aspect" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {selectedCandidates.map((candidate, index) => {
                          const name = getCandidateName(candidate);
                          return (
                            <Radar
                              key={candidate.profile?.public_identifier}
                              name={name}
                              dataKey={name}
                              stroke={`hsl(${index * 120}, 70%, 50%)`}
                              fill={`hsl(${index * 120}, 70%, 50%)`}
                              fillOpacity={0.3}
                            />
                          );
                        })}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

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
                            <TableHead key={candidate.profile?.public_identifier}>
                              {getCandidateName(candidate)}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getComparisonMetrics().map(({ category, metrics }) => (
                          <TableRow key={category}>
                            <TableCell className="font-medium">{category}</TableCell>
                            {metrics.map(({ id, value }) => (
                              <TableCell key={`${category}-${id}`}>{value}</TableCell>
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
            {availableCandidates.map((candidate) => {
              const profile = candidate.profile;
              if (!profile) return null;

              const name = getCandidateName(candidate);
              const initials = removeEmojis(name)
                .split(" ")
                .map(n => n[0])
                .filter(Boolean)
                .join("")
                .toUpperCase();

              return (
                <Card 
                  key={profile.public_identifier}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedCandidates.some(c => c.profile?.public_identifier === profile.public_identifier) 
                      ? 'border-primary' 
                      : ''
                  }`}
                  onClick={() => toggleCandidateSelection(candidate)}
                >
                  <CardContent className="p-3">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all mb-2">
                        <AvatarImage src={profile.profile_pic_url || ''} alt={name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium">
                          {initials || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium truncate max-w-[180px]">{name}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {profile.headline || profile.experiences?.[0]?.title || 'No title'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Compare;