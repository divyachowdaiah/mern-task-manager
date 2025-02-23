// backend/scheduler.js

const cron = require("node-cron");
const Task = require("./models/Task");
const mongoose = require("mongoose");

// Function to send reminder (placeholder for email or notification logic)
const sendReminder = (task) => {
  console.log(`Reminder: Task "${task.title}" is due soon!`);
};

// Cron job to check for due reminders every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const tasks = await Task.find({
      reminderDate: { $lte: now },
      status: { $ne: "Completed" },
    });

    tasks.forEach((task) => sendReminder(task));
  } catch (error) {
    console.error("Error checking reminders:", error);
  }
});

// Cron job to handle recurring tasks daily
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const tasks = await Task.find({ recurrence: { $ne: "None" } });

    tasks.forEach(async (task) => {
      let newDueDate = new Date(task.dueDate);
      if (task.recurrence === "Daily") newDueDate.setDate(newDueDate.getDate() + 1);
      if (task.recurrence === "Weekly") newDueDate.setDate(newDueDate.getDate() + 7);
      if (task.recurrence === "Monthly") newDueDate.setMonth(newDueDate.getMonth() + 1);

      await Task.create({ ...task.toObject(), _id: mongoose.Types.ObjectId(), dueDate: newDueDate, reminderDate: newDueDate });
    });
  } catch (error) {
    console.error("Error handling recurring tasks:", error);
  }
});
