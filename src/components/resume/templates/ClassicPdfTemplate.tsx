/**
 * PDF Resume Template using @react-pdf/renderer
 * ATS-compatible single-column layout optimized for machine parsing
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { ResumeData } from '@/lib/types/resume'

// Register standard fonts for better ATS compatibility
Font.register({
  family: 'Times-Roman',
  src: 'Times-Roman',
})

// ATS-optimized styles: simple, clean, single column
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 48,
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.4,
  },
  // Contact Info Section
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 10,
    color: '#333333',
  },
  contactLine: {
    marginBottom: 2,
  },
  // Section Headers
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #000000',
    paddingBottom: 4,
    marginTop: 12,
    marginBottom: 8,
  },
  // Summary Section
  summary: {
    marginBottom: 12,
    textAlign: 'justify',
  },
  // Experience Section
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  dateLocation: {
    fontSize: 10,
    color: '#555555',
  },
  bulletPoints: {
    marginLeft: 12,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletSymbol: {
    width: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  // Education Section
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  school: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  dates: {
    fontSize: 10,
    color: '#555555',
  },
  // Skills Section
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  skill: {
    fontSize: 10,
    marginRight: 8,
    marginBottom: 4,
  },
})

interface ClassicPdfTemplateProps {
  data: ResumeData
}

export const ClassicPdfTemplate: React.FC<ClassicPdfTemplateProps> = ({
  data,
}) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header: Contact Information */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.contactInfo.name}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLine}>{data.contactInfo.email}</Text>
            <Text style={styles.contactLine}>{data.contactInfo.phone}</Text>
            <Text style={styles.contactLine}>{data.contactInfo.location}</Text>
          </View>
        </View>

        {/* Professional Summary */}
        {data.summary && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                {/* Title and Dates */}
                <View style={styles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.company}>{exp.company}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.dateLocation}>
                      {exp.startDate} - {exp.endDate}
                    </Text>
                    {exp.location && (
                      <Text style={styles.dateLocation}>{exp.location}</Text>
                    )}
                  </View>
                </View>

                {/* Bullet Points */}
                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={styles.bulletPoints}>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <View key={bulletIndex} style={styles.bullet}>
                        <Text style={styles.bulletSymbol}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.school}>{edu.school}</Text>
                <Text style={styles.dates}>
                  {edu.startDate} - {edu.endDate}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              <Text style={styles.skill}>{data.skills.join(' • ')}</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}
