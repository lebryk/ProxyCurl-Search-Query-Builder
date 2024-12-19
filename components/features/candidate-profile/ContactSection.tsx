import { Mail, Phone, Linkedin } from "lucide-react";
import type { ContactInfo } from "@/types/candidate";

interface ContactSectionProps {
  contactInfo?: ContactInfo;
}

export const ContactSection = ({ contactInfo }: ContactSectionProps) => {
  if (!contactInfo) return null;

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
      <div className="space-y-3">
        {contactInfo.email && (
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{contactInfo.email}</span>
          </div>
        )}
        {contactInfo.phone && (
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-5 h-5 text-gray-400" />
            <span>{contactInfo.phone}</span>
          </div>
        )}
        {contactInfo.linkedin && (
          <div className="flex items-center gap-3">
            <Linkedin className="w-5 h-5 text-gray-400" />
            <a
              href={`https://${contactInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              {contactInfo.linkedin}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};