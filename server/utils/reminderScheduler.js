import Event from '../models/Event.js';
import Notification from '../models/Notification.js';

export const startEventReminderScheduler = () => {
  console.log('Automated Event Reminder Scheduler started.');
  
  // Run once every 10 minutes to scan for upcoming events
  setInterval(async () => {
    try {
      const now = new Date();
      // Target window: up to 24 hours from now
      const targetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find events starting in the next 24 hours that haven't sent reminders
      const upcomingEvents = await Event.find({
        date: { $lte: targetTime, $gte: now },
        reminderSent: { $ne: true }
      });

      for (const event of upcomingEvents) {
        if (event.rsvps && event.rsvps.length > 0) {
          console.log(`Sending 24h event reminders for: "${event.title}" to ${event.rsvps.length} users`);
          
          for (const userId of event.rsvps) {
            const notifId = `notif-rem-${event.id}-${userId}`;
            
            // Check if user already has this specific reminder to avoid duplicate writes
            const exists = await Notification.findOne({ id: notifId });
            if (!exists) {
              const reminderText = `Reminder: "${event.title}" starts in 24 hours! Join us at ${event.location} on ${new Date(event.date).toLocaleDateString()} at ${event.time}.`;
              const newNotif = new Notification({
                id: notifId,
                title: `Upcoming Event Reminder: ${event.title}`,
                content: reminderText,
                message: reminderText,
                userId: userId,
                date: new Date()
              });
              await newNotif.save();
            }
          }
        }
        
        // Mark event as reminded
        event.reminderSent = true;
        await event.save();
      }
    } catch (err) {
      console.error('Error in event reminder scheduler:', err);
    }
  }, 10 * 60 * 1000); // 10 minutes
};
