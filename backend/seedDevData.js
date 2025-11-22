const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/user');
const Patient = require('./models/patient');
const Appointment = require('./models/appointment');
const Billing = require('./models/billing');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/patient_management_dev');
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Billing.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create users WITH HASHED PASSWORDS
    console.log('👥 Creating users...');
    
    // Hash passwords BEFORE inserting
    const hashedAdminPass = await bcrypt.hash('admin123', 10);
    const hashedDoctorPass = await bcrypt.hash('doctor123', 10);
    const hashedNursePass = await bcrypt.hash('nurse123', 10);
    
    const users = [
      {
        username: 'admin',
        password: hashedAdminPass,
        role: 'admin',
        email: 'admin@hospital.com'
      },
      {
        username: 'doctor1',
        password: hashedDoctorPass,
        role: 'doctor',
        email: 'doctor1@hospital.com'
      },
      {
        username: 'nurse1',
        password: hashedNursePass,
        role: 'nurse',
        email: 'nurse1@hospital.com'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('✅ Created users:');
    createdUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.role})`);
    });
    console.log();

    // Create patients
    console.log('🏥 Creating patients...');
    const patients = [
      {
        name: 'John Doe',
        dob: new Date('1985-03-15'),
        medicalHistory: 'No known allergies'
      },
      {
        name: 'Jane Smith',
        dob: new Date('1990-07-22'),
        medicalHistory: 'Asthma'
      },
      {
        name: 'Bob Johnson',
        dob: new Date('1978-11-30'),
        medicalHistory: 'Diabetes Type 2'
      }
    ];

    const createdPatients = await Patient.insertMany(patients);
    console.log('✅ Created patients:');
    createdPatients.forEach(patient => {
      console.log(`   - ${patient.name}`);
    });
    console.log();

    // Create appointments
    console.log('📅 Creating appointments...');
    const doctor = createdUsers.find(u => u.role === 'doctor');
    const appointments = [
      {
        patientId: createdPatients[0]._id,
        doctorId: doctor._id,
        date: new Date('2024-11-25'),
        time: '10:00',
        notes: 'Regular checkup'
      },
      {
        patientId: createdPatients[1]._id,
        doctorId: doctor._id,
        date: new Date('2024-11-25'),
        time: '14:00',
        notes: 'Follow-up visit'
      }
    ];

    const createdAppointments = await Appointment.insertMany(appointments);
    console.log(`✅ Created ${createdAppointments.length} appointments\n`);

    // Create billing records
    console.log('💰 Creating billing records...');
    const billings = [
      {
        patientId: createdPatients[0]._id,
        amount: 150.00,
        date: new Date(),
        description: 'Consultation'
      }
    ];

    await Billing.insertMany(billings);
    console.log('✅ Created billing records\n');

    console.log('🎉 Database seeding completed!\n');
    console.log('📋 Login Credentials:');
    console.log('   Admin:  admin / admin123');
    console.log('   Doctor: doctor1 / doctor123');
    console.log('   Nurse:  nurse1 / nurse123\n');

  } catch (err) {
    console.error('❌ Error seeding database:', err);
    throw err;
  }
};

// Run
const run = async () => {
  await connectDB();
  await seedDatabase();
  mongoose.connection.close();
  console.log('✅ Connection closed');
};

run();