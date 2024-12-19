import { Code2, Database, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const jobCategories = [
  {
    title: "Senior Full Stack Developer with React expertise",
    description: "Find developers with strong React.js experience and full-stack capabilities",
    icon: Code2,
  },
  {
    title: "AI/ML Engineer with Python background",
    description: "Search for machine learning specialists proficient in Python and deep learning frameworks",
    icon: Database,
  },
  {
    title: "DevOps Engineer with cloud expertise",
    description: "Locate DevOps professionals with AWS/Azure experience and CI/CD knowledge",
    icon: Cloud,
  },
];

export const JobCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      {jobCategories.map((category) => (
        <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <category.icon className="h-5 w-5 text-primary" />
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{category.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};