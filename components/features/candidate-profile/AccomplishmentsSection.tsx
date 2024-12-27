import React from 'react';
import {
  AccomplishmentOrg,
  Publication,
  HonourAward,
  Patent,
  Course,
  TestScore,
  DateObject
} from '@/types/PersonSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateObject } from '@/lib/utils';

interface AccomplishmentsSectionProps {
  organizations?: AccomplishmentOrg[] | null;
  publications?: Publication[] | null;
  awards?: HonourAward[] | null;
  patents?: Patent[] | null;
  courses?: Course[] | null;
  testScores?: TestScore[] | null;
}

export function AccomplishmentsSection({
  organizations,
  publications,
  awards,
  patents,
  courses,
  testScores,
}: AccomplishmentsSectionProps) {
  const formatDate = (date: DateObject | null) => {
    if (!date) return '';
    return formatDateObject(date);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Accomplishments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {organizations && organizations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organizations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organizations.map((org, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">{org.org_name || 'Unnamed Organization'}</h4>
                  {org.title && <p className="text-sm text-gray-600">{org.title}</p>}
                  {org.description && (
                    <p className="text-sm text-gray-500">{org.description}</p>
                  )}
                  {(org.starts_at || org.ends_at) && (
                    <p className="text-sm text-gray-500">
                      {formatDate(org.starts_at)} - {org.ends_at ? formatDate(org.ends_at) : 'Present'}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {publications && publications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">{pub.name || 'Untitled Publication'}</h4>
                  {pub.publisher && <p className="text-sm text-gray-600">{pub.publisher}</p>}
                  {pub.published_on && (
                    <p className="text-sm text-gray-500">
                      Published: {formatDate(pub.published_on)}
                    </p>
                  )}
                  {pub.description && (
                    <p className="text-sm text-gray-500">{pub.description}</p>
                  )}
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Publication
                    </a>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {awards && awards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Honors & Awards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {awards.map((award, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">{award.title || 'Unnamed Award'}</h4>
                  {award.issuer && <p className="text-sm text-gray-600">{award.issuer}</p>}
                  {award.issued_on && (
                    <p className="text-sm text-gray-500">
                      Issued: {formatDate(award.issued_on)}
                    </p>
                  )}
                  {award.description && (
                    <p className="text-sm text-gray-500">{award.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {patents && patents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patents.map((patent, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">{patent.title || 'Unnamed Patent'}</h4>
                  {patent.patent_number && (
                    <p className="text-sm text-gray-600">Patent #{patent.patent_number}</p>
                  )}
                  {patent.issued_on && (
                    <p className="text-sm text-gray-500">
                      Issued: {formatDate(patent.issued_on)}
                    </p>
                  )}
                  {patent.description && (
                    <p className="text-sm text-gray-500">{patent.description}</p>
                  )}
                  {patent.url && (
                    <a
                      href={patent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Patent
                    </a>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {courses && courses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {courses.map((course, index) => (
                  <li key={index} className="text-sm">
                    {course.name || 'Unnamed Course'}
                    {course.number && <span className="text-gray-500"> ({course.number})</span>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {testScores && testScores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testScores.map((score, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium">{score.name || 'Unnamed Test'}</h4>
                  {score.score && <p className="text-sm text-gray-600">Score: {score.score}</p>}
                  {score.date_on && (
                    <p className="text-sm text-gray-500">
                      Date: {formatDate(score.date_on)}
                    </p>
                  )}
                  {score.description && (
                    <p className="text-sm text-gray-500">{score.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
