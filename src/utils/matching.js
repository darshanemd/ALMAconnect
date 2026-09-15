export function calculateSkillMatch(userSkills = [], jobRequirements = []) {
  if (!jobRequirements || jobRequirements.length === 0) {
    return { matchPercentage: 100, matchedSkills: [], missingSkills: [] };
  }

  const uSkillsLower = userSkills.map(s => s.toLowerCase());
  const matchedSkills = [];
  const missingSkills = [];

  jobRequirements.forEach(req => {
    if (uSkillsLower.includes(req.toLowerCase())) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / jobRequirements.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills
  };
}

export function calculateMentorMatch(mentee, mentor) {
  if (!mentee || !mentor) return { score: 0, reasons: [] };

  let score = 50; // base score
  const reasons = [];

  const menteeSkills = Array.isArray(mentee.skills) ? mentee.skills : [];
  const mentorSkills = Array.isArray(mentor.skills) ? mentor.skills : [];
  const mentorTopics = Array.isArray(mentor.mentorTopics) ? mentor.mentorTopics : [];

  // Match by department
  if (mentee.department && mentor.department && mentee.department.toLowerCase() === mentor.department.toLowerCase()) {
    score += 20;
    reasons.push(`Both belong to the ${mentee.department} department`);
  }

  // Match by skills
  const mentorSkillsLower = mentorSkills.map(s => String(s || '').toLowerCase());
  const sharedSkills = menteeSkills.filter(skill => 
    mentorSkillsLower.includes(String(skill || '').toLowerCase())
  );
  if (sharedSkills.length > 0) {
    score += Math.min(sharedSkills.length * 8, 24);
    reasons.push(`Shared interest/skills in: ${sharedSkills.slice(0, 3).join(', ')}`);
  }

  // Match by location
  if (mentee.location && mentor.location && mentee.location.toLowerCase() === mentor.location.toLowerCase()) {
    score += 10;
    reasons.push(`Both are located in ${mentee.location}`);
  }

  // Mentor topics matching mentee skills
  const menteeSkillsLower = menteeSkills.map(s => String(s || '').toLowerCase());
  const topicsMatchingSkills = mentorTopics.filter(topic =>
    menteeSkillsLower.some(s => s && String(topic || '').toLowerCase().includes(s))
  );
  if (topicsMatchingSkills.length > 0) {
    score += 10;
    reasons.push(`Mentor offers guidance in your skill areas: ${topicsMatchingSkills.join(', ')}`);
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
}

export function generateConversationStarters(user1, user2) {
  if (!user1 || !user2) return [];

  const starters = [];

  // Starter 1: Shared department/college
  if (user1.collegeId === user2.collegeId) {
    starters.push(`Hi ${user2.firstName}, I see we both graduated from the same college. I would love to connect and hear about your journey!`);
  } else {
    starters.push(`Hi ${user2.firstName}, I came across your profile and was really impressed by your background. I'd love to connect!`);
  }

  // Starter 2: Company/Industry
  if (user2.currentCompany) {
    starters.push(`Hello! I'm interested in learning more about your work at ${user2.currentCompany} as a ${user2.currentRole}. Do you have any advice for someone looking to break into that space?`);
  }

  // Starter 3: Shared skills
  const u1Skills = Array.isArray(user1?.skills) ? user1.skills : [];
  const u2Skills = Array.isArray(user2?.skills) ? user2.skills : [];
  const shared = u1Skills.filter(s => u2Skills.includes(s));
  if (shared.length > 0) {
    starters.push(`Hi there, I noticed we both work with ${shared.slice(0, 2).join(' and ')}. I'd love to chat about how you apply these in your current projects.`);
  } else if (u2Skills.length > 0) {
    starters.push(`Hi! I'm currently working on expanding my skills. Since you have experience in ${u2Skills.slice(0, 2).join(', ')}, would you be open to sharing some learning resources?`);
  } else {
    starters.push(`Hi ${user2.firstName || 'there'}, I'd love to connect and learn more about your career journey!`);
  }

  return starters;
}
