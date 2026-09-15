/**
 * Alumni Analytics Utility for Skill Gap Detector
 * Analyzes alumni profiles to compute real-time industry skill benchmarks,
 * missing skill frequencies, top employer distributions, and mentor matching.
 */

// Categorization mapping for 5-Axis Radar Chart
const RADAR_AXIS_MAPPING = {
  'Languages': ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'html/css', 'sql', 'r', 'verilog'],
  'Web & Frameworks': ['react', 'node.js', 'spring boot', 'django', 'next.js', 'redux', 'express', 'tailwind css', 'angular', 'vue'],
  'Databases & Storage': ['database', 'postgresql', 'mongodb', 'mysql', 'redis', 'sql server', 'vector databases', 'nosql'],
  'DevOps & Cloud': ['docker', 'kubernetes', 'cloud platforms (aws/gcp)', 'aws', 'azure', 'linux', 'ci/cd', 'git & github', 'terraform', 'networking'],
  'System Architecture': ['system design', 'rest apis', 'backend development', 'data structures', 'algorithms', 'machine learning', 'deep learning', 'microservices']
};

/**
 * Aggregates alumni data for a given target career role.
 * Returns skill frequencies, percentage statistics, and top hiring companies.
 */
export function analyzeAlumniForRole(allAlumni = [], targetRole = '', defaultRequiredSkills = []) {
  if (!Array.isArray(allAlumni) || allAlumni.length === 0) {
    return {
      totalRelevantAlumni: 0,
      skillFrequencies: {},
      topAlumniSkills: defaultRequiredSkills.map(s => ({ name: s, count: 1, percentage: 80 })),
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Infosys'],
      alumniGapsWithStats: defaultRequiredSkills.map(s => ({ skill: s, percentage: 75 }))
    };
  }

  const roleLower = targetRole.toLowerCase();

  // Filter alumni matching the target role or related tech field
  let relevantAlumni = allAlumni.filter(alum => {
    if (!alum || alum.status !== 'active') return false;
    const currentRole = (alum.currentRole || '').toLowerCase();
    const dept = (alum.department || '').toLowerCase();
    
    // Check role title match
    if (currentRole.includes(roleLower) || roleLower.includes(currentRole)) return true;
    
    // Fallback keyword matching for software / dev / data / AI / cloud roles
    if (roleLower.includes('frontend') && (currentRole.includes('frontend') || currentRole.includes('software') || currentRole.includes('engineer'))) return true;
    if (roleLower.includes('backend') && (currentRole.includes('backend') || currentRole.includes('engineer') || currentRole.includes('developer'))) return true;
    if (roleLower.includes('full stack') && (currentRole.includes('software') || currentRole.includes('full') || currentRole.includes('engineer'))) return true;
    if ((roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('machine')) && (currentRole.includes('data') || currentRole.includes('ai') || dept.includes('computer'))) return true;

    return false;
  });

  // If fewer than 2 specific matches, broaden filter to all active alumni developers/engineers
  if (relevantAlumni.length < 2) {
    relevantAlumni = allAlumni.filter(alum => alum.status === 'active' && alum.currentRole !== 'Student');
  }

  const totalRelevantAlumni = relevantAlumni.length || 1;

  // 1. Skill Frequency Calculation
  const skillCountMap = {};
  const companyCountMap = {};

  relevantAlumni.forEach(alum => {
    // Skills
    if (Array.isArray(alum.skills)) {
      alum.skills.forEach(skill => {
        const key = skill.trim();
        skillCountMap[key] = (skillCountMap[key] || 0) + 1;
      });
    }
    // Companies
    if (alum.currentCompany && alum.currentCompany !== 'Student') {
      const company = alum.currentCompany.trim();
      companyCountMap[company] = (companyCountMap[company] || 0) + 1;
    }
  });

  // Top Skills Array with percentages
  const topAlumniSkills = Object.entries(skillCountMap)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.min(100, Math.round((count / totalRelevantAlumni) * 100))
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Top Companies Array
  const topCompanies = Object.entries(companyCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([company]) => company)
    .slice(0, 5);

  if (topCompanies.length === 0) {
    topCompanies.push('Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS');
  }

  return {
    totalRelevantAlumni,
    skillFrequencies: skillCountMap,
    topAlumniSkills,
    topCompanies
  };
}

/**
 * Finds top alumni mentors for identified missing skills.
 */
export function getAlumniMentorsForGaps(allAlumni = [], missingSkills = []) {
  if (!Array.isArray(allAlumni) || allAlumni.length === 0 || missingSkills.length === 0) {
    return [];
  }

  const matchedMentors = allAlumni
    .filter(alum => alum.status === 'active' && alum.currentRole !== 'Student')
    .map(alum => {
      const alumSkillsLower = (alum.skills || []).map(s => s.toLowerCase());
      const matched = missingSkills.filter(mSkill => 
        alumSkillsLower.some(aSkill => aSkill.includes(mSkill.toLowerCase()) || mSkill.toLowerCase().includes(aSkill))
      );

      return {
        ...alum,
        matchedSkills: matched,
        matchCount: matched.length
      };
    })
    .filter(m => m.matchCount > 0)
    .sort((a, b) => {
      // Prioritize actual mentors and highest match count
      if (a.isMentor && !b.isMentor) return -1;
      if (!a.isMentor && b.isMentor) return 1;
      return b.matchCount - a.matchCount;
    })
    .slice(0, 4);

  return matchedMentors;
}

/**
 * Computes 5-Axis Competency Data for Radar Chart comparison.
 */
export function computeRadarCompetency(completedSkills = [], requiredSkills = []) {
  const completedLower = completedSkills.map(s => s.toLowerCase());
  const requiredLower = requiredSkills.map(s => s.toLowerCase());

  return Object.entries(RADAR_AXIS_MAPPING).map(([axisName, keyList]) => {
    // Target Ideal Score (out of 100)
    const requiredInAxis = keyList.filter(k => requiredLower.some(req => req.includes(k) || k.includes(req)));
    const targetScore = requiredInAxis.length > 0 ? 90 : 70;

    // Student Score (out of 100)
    const completedInAxis = keyList.filter(k => completedLower.some(c => c.includes(k) || k.includes(c)));
    const studentScore = completedInAxis.length > 0 
      ? Math.min(100, Math.round((completedInAxis.length / Math.max(1, requiredInAxis.length)) * 100))
      : 20;

    return {
      axis: axisName,
      Student: studentScore,
      Target: targetScore,
      fullMark: 100
    };
  });
}
