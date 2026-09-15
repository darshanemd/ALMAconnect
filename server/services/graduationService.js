import Member from '../models/Member.js';
import Notification from '../models/Notification.js';

/**
 * Check a single member and promote from student to alumni if graduation year is reached or passed.
 * @param {Object} member - Mongoose Member document
 * @returns {Promise<Object>} - Updated or original member
 */
export async function checkAndGraduateStudent(member) {
  if (!member) return member;

  const currentYear = new Date().getFullYear();
  const gradYear = Number(member.graduationYear);

  if (member.role === 'student' && gradYear && gradYear <= currentYear) {
    console.log(`[Auto-Graduation] Promoting ${member.firstName} ${member.lastName} (${member.email}) - Grad Year: ${gradYear} <= Current: ${currentYear}`);
    
    member.role = 'alumni';
    await member.save();

    // Create congratulatory notification if one doesn't exist
    try {
      const existingNotif = await Notification.findOne({
        userId: member.id,
        type: 'graduation'
      });

      if (!existingNotif) {
        const notif = new Notification({
          id: `notif-grad-${member.id}-${Date.now()}`,
          title: '🎓 Congratulations on Graduating!',
          content: `Congratulations! Having reached your Class of ${gradYear} graduation milestone, your account has been automatically upgraded to Alumni status. Welcome to the Alumni Network!`,
          message: `Congratulations! Having reached your Class of ${gradYear} graduation milestone, your account has been automatically upgraded to Alumni status. Welcome to the Alumni Network!`,
          date: new Date(),
          read: false,
          role: 'alumni',
          userId: member.id,
          collegeId: member.collegeId || 'col-1',
          link: '/dashboard',
          type: 'graduation'
        });
        await notif.save();
      }
    } catch (notifErr) {
      console.warn(`[Auto-Graduation] Notification creation warning for ${member.id}:`, notifErr.message);
    }
  }

  return member;
}

/**
 * Scans MongoDB for all active students whose graduation year has passed or arrived,
 * and upgrades them to alumni status.
 * @returns {Promise<number>} - Count of newly graduated students
 */
export async function autoGraduateStudents() {
  const currentYear = new Date().getFullYear();

  try {
    const studentsToGraduate = await Member.find({
      role: 'student',
      graduationYear: { $exists: true, $lte: currentYear }
    });

    if (!studentsToGraduate || studentsToGraduate.length === 0) {
      return 0;
    }

    console.log(`[Auto-Graduation] Found ${studentsToGraduate.length} student(s) eligible for graduation (Current Year: ${currentYear}).`);

    let graduatedCount = 0;
    for (const student of studentsToGraduate) {
      await checkAndGraduateStudent(student);
      graduatedCount++;
    }

    console.log(`[Auto-Graduation] Successfully auto-graduated ${graduatedCount} student(s) to Alumni.`);
    return graduatedCount;
  } catch (err) {
    console.error('[Auto-Graduation] Error running auto-graduation:', err);
    return 0;
  }
}
