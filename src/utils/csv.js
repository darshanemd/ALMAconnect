export function parseCSV(text) {
  if (!text) return [];
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    // Simple comma split, but handle quotes
    let insideQuote = false;
    let entries = [];
    let entry = '';
    
    for (let char of currentLine) {
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        entries.push(entry.trim().replace(/^["']|["']$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    entries.push(entry.trim().replace(/^["']|["']$/g, ''));
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = entries[index] || '';
    });
    results.push(obj);
  }
  
  return results;
}

export function validateAlumniCSV(data) {
  const valid = [];
  const invalid = [];
  const errors = [];
  
  const requiredFields = ['firstName', 'lastName', 'email', 'department', 'graduationYear', 'degree'];
  
  data.forEach((row, index) => {
    const rowNum = index + 2; // 1-indexed, skipping header
    const rowErrors = [];
    
    requiredFields.forEach(field => {
      if (!row[field]) {
        rowErrors.push(`Missing required field: ${field}`);
      }
    });
    
    if (row.email && !/\S+@\S+\.\S+/.test(row.email)) {
      rowErrors.push(`Invalid email format: ${row.email}`);
    }
    
    if (row.graduationYear && isNaN(Number(row.graduationYear))) {
      rowErrors.push(`Graduation year must be a number: ${row.graduationYear}`);
    }
    
    if (rowErrors.length > 0) {
      invalid.push({ row: rowNum, data: row, errors: rowErrors });
      errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
    } else {
      valid.push({
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone || '',
        department: row.department,
        graduationYear: Number(row.graduationYear),
        degree: row.degree,
        currentCompany: row.currentCompany || '',
        currentRole: row.currentRole || '',
        location: row.location || '',
        skills: row.skills ? row.skills.split(';').map(s => s.trim()) : [],
        bio: row.bio || '',
        isVerified: true,
        status: 'active'
      });
    }
  });
  
  return { valid, invalid, errors };
}

export function validateStudentCSV(data) {
  const valid = [];
  const invalid = [];
  const errors = [];
  
  const requiredFields = ['rollNumber', 'firstName', 'lastName', 'email', 'department', 'expectedGraduationYear', 'degree'];
  
  data.forEach((row, index) => {
    const rowNum = index + 2; // 1-indexed, skipping header
    const rowErrors = [];
    
    requiredFields.forEach(field => {
      if (!row[field]) {
        rowErrors.push(`Missing required field: ${field}`);
      }
    });
    
    if (row.email && !/\S+@\S+\.\S+/.test(row.email)) {
      rowErrors.push(`Invalid email format: ${row.email}`);
    }
    
    const gradYear = row.expectedGraduationYear || row.graduationYear;
    if (gradYear && isNaN(Number(gradYear))) {
      rowErrors.push(`Graduation year must be a number: ${gradYear}`);
    }
    
    if (rowErrors.length > 0) {
      invalid.push({ row: rowNum, data: row, errors: rowErrors });
      errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
    } else {
      valid.push({
        rollNumber: row.rollNumber,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        department: row.department,
        expectedGraduationYear: Number(gradYear),
        degree: row.degree
      });
    }
  });
  
  return { valid, invalid, errors };
}
