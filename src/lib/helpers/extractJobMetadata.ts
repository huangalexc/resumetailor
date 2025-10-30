/**
 * Extract metadata from job description text
 * Uses regex patterns to detect company name and job title
 */

export function extractJobMetadata(description: string): {
  companyName?: string
  roleTitle?: string
} {
  const result: { companyName?: string; roleTitle?: string } = {}

  // Normalize whitespace and split into lines
  const lines = description
    .replace(/\s+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  // Extract Company Name
  // Patterns: "at [Company]", "[Company] is", "About [Company]", "Join [Company]"
  const companyPatterns = [
    /(?:at|join|about)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+is|\s+in|\s+-|\s+\(|$)/i,
    /^([A-Z][A-Za-z0-9\s&.]+?)\s+(?:is|seeks|looking|hiring)/i,
    /(?:company|employer):\s*([A-Z][A-Za-z0-9\s&.]+?)(?:\s|$)/i,
  ]

  for (const pattern of companyPatterns) {
    for (const line of lines.slice(0, 10)) {
      // Check first 10 lines
      const match = line.match(pattern)
      if (match && match[1]) {
        const company = match[1].trim()
        // Validate: should be 2-50 chars, start with capital
        if (company.length >= 2 && company.length <= 50 && /^[A-Z]/.test(company)) {
          result.companyName = company
          break
        }
      }
    }
    if (result.companyName) break
  }

  // Extract Role Title
  // Patterns: First line often contains role, "Position:", "Role:", "Job Title:"
  const rolePatterns = [
    /^([A-Z][A-Za-z\s]+(?:Engineer|Developer|Manager|Designer|Analyst|Specialist|Lead|Director|Architect|Consultant))(?:\s+-|\s+at|\s+\(|$)/i,
    /(?:position|role|job title|title):\s*([A-Z][A-Za-z\s]+)/i,
    /^([A-Z][A-Za-z\s]+)\s+-\s+[A-Z]/i, // "Senior Engineer - Company"
  ]

  // Check first few lines for role
  for (const line of lines.slice(0, 5)) {
    for (const pattern of rolePatterns) {
      const match = line.match(pattern)
      if (match && match[1]) {
        const role = match[1].trim()
        // Validate: should be 5-80 chars
        if (role.length >= 5 && role.length <= 80) {
          result.roleTitle = role
          break
        }
      }
    }
    if (result.roleTitle) break
  }

  // If no role found, check if first line looks like a job title
  if (!result.roleTitle && lines.length > 0) {
    const firstLine = lines[0]
    if (
      firstLine.length >= 10 &&
      firstLine.length <= 80 &&
      /^[A-Z]/.test(firstLine) &&
      !/^(about|we are|our company|responsibilities|requirements)/i.test(firstLine)
    ) {
      // First line is likely the job title
      result.roleTitle = firstLine.replace(/\s+[-–]\s+.*$/, '').trim() // Remove " - Company" suffix
    }
  }

  return result
}

/**
 * Extract keywords from job description
 * Useful for ATS optimization
 */
export function extractKeywords(description: string): string[] {
  const keywords: Set<string> = new Set()

  // Common technical skills and tools
  const techPatterns = [
    /\b(JavaScript|TypeScript|Python|Java|Ruby|Go|Rust|C\+\+|PHP|Swift|Kotlin)\b/gi,
    /\b(React|Angular|Vue|Node\.js|Express|Django|Flask|Rails|Spring|Laravel)\b/gi,
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|CI\/CD|Git|GitHub|GitLab)\b/gi,
    /\b(SQL|PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch|GraphQL|REST API)\b/gi,
    /\b(Agile|Scrum|Kanban|Jira|Confluence|Slack|Teams)\b/gi,
  ]

  for (const pattern of techPatterns) {
    const matches = description.match(pattern)
    if (matches) {
      matches.forEach((match) => keywords.add(match))
    }
  }

  // Convert to array and limit to top 20
  return Array.from(keywords).slice(0, 20)
}
