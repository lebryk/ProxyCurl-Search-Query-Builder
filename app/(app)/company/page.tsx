"use client";
import { Building, Users, Globe, Briefcase, TrendingUp, Brain, Users2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useCompanyMembership } from "@/hooks/useCompanyMembership";
import type { Database } from "@/types/supabase";

type CompanyProfile = Database["public"]["Tables"]["company_profiles"]["Row"];
type CompanyMember = Database["public"]["Tables"]["company_members"]["Row"];

interface CompanyMetrics {
  revenueGrowth: number;
  teamGrowth: number;
  brandSentiment: number;
}

const Company = () => {
  const { data, isLoading, error } = useCompanyMembership();
  const company = data?.company as CompanyProfile | undefined;

  if (isLoading) {
    return (
      <div className="flex-1 h-full">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-8 animate-pulse">
            <div className="h-48 md:h-64 rounded-lg bg-muted"></div>
            <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20">
              <div className="w-32 h-32 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 w-48 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex-1 h-full">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="text-center text-muted-foreground">
              Failed to load company data
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Calculate metrics
  const metrics: CompanyMetrics = {
    revenueGrowth: company.revenue_growth_percentage || 0,
    teamGrowth: company.team_growth_percentage || 0,
    brandSentiment: company.brand_sentiment || 0,
  };

  // Get size range text
  const getSizeRangeText = (range: number | null) => {
    switch (range) {
      case 1:
        return "1-10 employees";
      case 2:
        return "11-50 employees";
      case 3:
        return "51-200 employees";
      case 4:
        return "201-1000 employees";
      case 5:
        return "1000+ employees";
      default:
        return "Unknown size";
    }
  };

  return (
    <div className="relative flex-1">
      <div className="h-full">
        <div className="h-full p-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section with Cover Image */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
              <img
                src={company.cover_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                alt="Company Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Company Header Section */}
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="container flex items-center h-20 gap-4">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-background bg-white">
                    <img
                      src={company.logo_url || "https://images.unsplash.com/photo-1518770660439-4636190af475"}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{company.name}</h1>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{company.headquarters || `${company.headquarters_city}, ${company.headquarters_country}`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{company.employee_count_min}-{company.employee_count_max} employees</span>
                    </div>
                    {company.website_url && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a href={company.website_url} className="text-primary hover:underline">
                          {company.website_url.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Section */}
            <div className="container py-6">
              <div className="relative flex-1 pt-6">
                {/* Company Information Tabs */}
                <Tabs defaultValue="about" className="space-y-6">
                  <div className="sticky top-20 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
                    <TabsList className="w-full grid grid-cols-2 p-1">
                      <TabsTrigger 
                        value="about" 
                        className="data-[state=active]:bg-background"
                      >
                        About
                      </TabsTrigger>
                      <TabsTrigger 
                        value="insights"
                        className="data-[state=active]:bg-background"
                      >
                        Company Insights
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="about" className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* About Section - spans 2 columns */}
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p>{company.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="font-medium">Industry</div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Briefcase className="h-4 w-4" />
                                <span>{company.industry}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium">Company size</div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{company.employee_count_min}-{company.employee_count_max} employees</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Specialties Section - spans 1 column */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Specialties</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {company.specialties?.map((specialty, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Locations Section - full width */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Locations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="font-medium">Headquarters</div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="h-4 w-4" />
                              <span>{company.headquarters || `${company.headquarters_city}, ${company.headquarters_country}`}</span>
                            </div>
                          </div>
                          {company.other_locations && company.other_locations.length > 0 && (
                            <div className="space-y-2">
                              <div className="font-medium">Other Locations</div>
                              <div className="space-y-1 text-muted-foreground">
                                {company.other_locations.map((location, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    <span>{location}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Company Growth Metrics */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Company Growth Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-sm font-medium">Size</label>
                                <span className="text-sm text-muted-foreground">{getSizeRangeText(company.size_range)}</span>
                              </div>
                              <Slider defaultValue={[company.size_range || 0]} max={5} step={1} />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-sm font-medium">Funding</label>
                                <span className="text-sm text-muted-foreground">
                                  {company.funding_stage} 
                                  {company.funding_amount && ` ($${(company.funding_amount / 1000000).toFixed(1)}M)`}
                                </span>
                              </div>
                              <Slider defaultValue={[3]} max={5} step={1} />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-sm font-medium">Revenue Growth</label>
                                <span className="text-sm text-muted-foreground">{metrics.revenueGrowth}% YoY</span>
                              </div>
                              <Slider defaultValue={[4]} max={5} step={1} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Company Culture & Brand */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Culture & Brand</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-sm font-medium">Brand Sentiment</label>
                                <span className="text-sm text-muted-foreground">{metrics.brandSentiment}%</span>
                              </div>
                              <Slider defaultValue={[company.brand_sentiment || 0]} max={5} step={1} />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-sm font-medium">Company Culture</label>
                                <span className="text-sm text-muted-foreground">{company.culture_type}</span>
                              </div>
                              <Slider defaultValue={[company.culture_score || 0]} max={5} step={1} />
                            </div>
                          </div>

                          <div className="pt-4 space-y-4">
                            <h4 className="text-sm font-medium">Growth Context</h4>
                            <p className="text-sm text-muted-foreground">
                              This company shows strong growth patterns with {metrics.revenueGrowth}% revenue growth
                              and {metrics.teamGrowth}% team growth year over year.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <span className="text-sm">{metrics.revenueGrowth}% Revenue Growth</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users2 className="h-4 w-4 text-primary" />
                                <span className="text-sm">{metrics.teamGrowth}% Team Growth</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-primary" />
                                <span className="text-sm">{company.culture_type}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;