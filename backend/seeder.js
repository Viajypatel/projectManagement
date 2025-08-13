const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const connectDB = require("./config/database");
const User = require("./models/userModel");
const Project = require("./models/projectModel");
const Task = require("./models/taskModel");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear old data
    await Task.deleteMany();
    await Project.deleteMany();
    await User.deleteMany();

    console.log("Old data cleared");

    // Create test user
    const hashedPassword = await bcrypt.hash("Test@123", 10);
    const user = await User.create({
      name: "Testhe373 User3322",
      email: "ruudeuetest@example.com",
      password: hashedPassword
    });

    console.log("User created:", user.email);

    // Create projects
    const projects = await Project.insertMany([
      { user: user._id, title: "Project Alpha", description: "First test project" },
      { user: user._id, title: "Project Beta", description: "Second test project" }
    ]);

    console.log(`${projects.length} projects created`);

    // Create tasks for each project
    for (let project of projects) {
      await Task.insertMany([
        {
          project: project._id,
          title: "Task 1",
          description: "First task for " + project.title,
          status: "todo",
          dueDate: new Date()
        },
        {
          project: project._id,
          title: "Task 2",
          description: "Second task for " + project.title,
          status: "in-progress",
          dueDate: new Date()
        },
        {
          project: project._id,
          title: "Task 3",
          description: "Third task for " + project.title,
          status: "done",
          dueDate: new Date()
        }
      ]);
    }

    console.log("Tasks created for each project");

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
};

seedData();
