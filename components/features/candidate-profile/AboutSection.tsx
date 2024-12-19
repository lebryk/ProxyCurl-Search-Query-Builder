interface AboutSectionProps {
  summary?: string;
}

export const AboutSection = ({ summary }: AboutSectionProps) => {
  if (!summary) return null;
  
  return (
    <section>
      <h3 className="text-lg font-semibold mb-3 text-gray-900">About</h3>
      <p className="text-gray-600 leading-relaxed">{summary}</p>
    </section>
  );
};