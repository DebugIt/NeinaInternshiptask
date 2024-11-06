import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from './models/users.model.js'; // Adjust the path if necessary
import ClaimHistory from './models/claimsHistory.model.js'; // Adjust the path if necessary

// Connect to MongoDB
mongoose.connect('mongodb+srv://debugit:1fSmH5oCB2B3IQCa@cluster0.ifkdt6f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Generate Dummy Users
const generateUsers = async (numUsers) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const user = new User({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      Points: faker.number.int({ min: 0, max: 300 }), // Updated to use faker.number.int
    });
    users.push(user);
  }
  return User.insertMany(users);
};

// Generate Dummy Claim History
const generateClaimHistory = async (users, numClaimsPerUser) => {
  const claimHistoryRecords = [];

  for (const user of users) {
    for (let i = 0; i < numClaimsPerUser; i++) {
      const claimHistory = new ClaimHistory({
        userId: user._id,
        pointsAwarded: faker.number.int({ min: 1, max: 10 }), // Updated to use faker.number.int
        username: user.username,
      });
      claimHistoryRecords.push(claimHistory);
    }
  }
  return ClaimHistory.insertMany(claimHistoryRecords);
};

const generateDummyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ClaimHistory.deleteMany({});

    // Generate 10 users
    const users = await generateUsers(10);
    console.log("Dummy users created.");

    // Generate 5 claim history records for each user
    await generateClaimHistory(users, 5);
    console.log("Dummy claim history records created.");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error generating dummy data:", error);
  }
};

generateDummyData();
