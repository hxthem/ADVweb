require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Workshop = require('./models/Workshop');
const Partner = require('./models/Partner');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // 1. Clear existing data (Optional - remove if you want to keep old data)
    // await User.deleteMany({});
    // await Workshop.deleteMany({});

    // 2. Create a Representative User (to be the creator)
    let adminEmail = 'admin@univ-blida.dz';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('Creating admin user...');
      admin = await User.create({
        fullName: 'Admin USDB',
        email: adminEmail,
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
        repStatus: 'approved',
        department: 'Computer Science'
      });
    }

    // 3. Create Representative Users (Teachers)
    console.log('Planting representatives...');
    const sampleReps = [
      {
        fullName: 'Prof. Ahmed Mansouri',
        email: 'a.mansouri@univ-blida.dz',
        password: 'password123',
        role: 'representative',
        repStatus: 'approved',
        department: 'Artificial Intelligence',
        aiFocus: 'Computer Vision',
        bio: 'Senior professor with 15 years of experience in deep learning and image processing.'
      },
      {
        fullName: 'Dr. Sarah Brahimi',
        email: 's.brahimi@univ-blida.dz',
        password: 'password123',
        role: 'representative',
        repStatus: 'approved',
        department: 'Data Science',
        aiFocus: 'Natural Language Processing',
        bio: 'Research lead at the USDB AI Lab, specializing in Arabic NLP and LLMs.'
      }
    ];

    for (const rep of sampleReps) {
      const exists = await User.findOne({ email: rep.email });
      if (!exists) {
        await User.create(rep);
        console.log(`- Created representative: ${rep.fullName}`);
      } else {
        console.log(`- Representative already exists: ${rep.fullName}`);
      }
    }

    // 4. Create Sample Workshops
    console.log('\nPlanting workshops...');
    const sampleWorkshops = [
      {
        title: 'Deep Learning with Python',
        category: 'technical',
        department: 'Computer Science',
        topic: 'Neural Networks',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        venue: 'Lab 04 - Faculty of Science',
        description: 'An intensive hands-on workshop on building and training deep neural networks using TensorFlow and Keras.',
        maxParticipants: 30,
        status: 'published',
        creator: admin._id
      },
      {
        title: 'Ethics in Artificial Intelligence',
        category: 'ethics',
        department: 'Information Technology',
        topic: 'AI Governance',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        venue: 'Auditorium A',
        description: 'Discussing the social, legal, and ethical implications of deploying AI systems in modern society.',
        maxParticipants: 100,
        status: 'published',
        creator: admin._id
      },
      {
        title: 'Introduction to Neural Networks',
        category: 'technical',
        department: 'Computer Science',
        topic: 'AI Fundamentals',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        venue: 'Main Auditorium',
        description: 'A comprehensive introduction to the mathematical foundations of neural networks and their implementation in Python.',
        maxParticipants: 50,
        status: 'published',
        creator: admin._id,
        resources: [
          {
            title: 'Neural Networks Basics (PDF)',
            type: 'pdf',
            url: 'http://localhost:5000/uploads/resources/nn_basics.pdf',
            size: '2.5 MB',
            description: 'Introduction slides for the workshop.'
          },
          {
            title: 'Simple Perceptron Code',
            type: 'code',
            url: 'https://github.com/example/perceptron',
            size: '15 KB',
            description: 'Source code for the hands-on lab.'
          }
        ]
      }
    ];

    for (const ws of sampleWorkshops) {
      const exists = await Workshop.findOne({ title: ws.title });
      if (!exists) {
        await Workshop.create(ws);
        console.log(`- Created workshop: ${ws.title}`);
      } else {
        console.log(`- Workshop already exists: ${ws.title}`);
      }
    }

    // 5. Create Sample Partners
    console.log('\nPlanting partners...');
    const samplePartners = [
      { name: "Google Developer Groups", type: "industry", description: "Co-organizing workshops on TensorFlow and cloud AI services." },
      { name: "University Rectorate", type: "rectorate", description: "Institutional support for AI House operations and cross-departmental coordination." },
      { name: "Sonatrach Digital Lab", type: "industry", description: "Industry partnership for AI applications in energy sector research." },
      { name: "CERIST Research Center", type: "academic", description: "Collaborative research in NLP and information retrieval for Arabic languages." },
      { 
        name: "Naftal", 
        type: "industry", 
        logo: "http://localhost:5000/uploads/partners/naftal.png",
        description: "Strategic partnership with Algeria's national petroleum distribution company for AI-driven logistics optimization." 
      },
      { 
        name: "Djezzy", 
        type: "industry", 
        logo: "http://localhost:5000/uploads/partners/djezzy.png",
        description: "Collaborating on telecommunications data analytics and AI-powered customer service frameworks." 
      },
      { 
        name: "Condor", 
        type: "industry", 
        logo: "http://localhost:5000/uploads/partners/condor.png",
        description: "Research partnership for AI integration in smart home appliances and electronics manufacturing." 
      },
      { 
        name: "ITC Blida", 
        type: "academic", 
        logo: "http://localhost:5000/uploads/partners/itc.png",
        description: "The official Computer Science Club of University Blida 1, fostering student-led AI innovation." 
      }
    ];

    for (const p of samplePartners) {
      const exists = await Partner.findOne({ name: p.name });
      if (!exists) {
        await Partner.create(p);
        console.log(`- Created partner: ${p.name}`);
      } else {
        console.log(`- Partner already exists: ${p.name}`);
      }
    }

    console.log('\n✅ Data planted successfully!');
    console.log('You can now log in with:');
    console.log('Email: admin@univ-blida.dz');
    console.log('Pass: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Failed:', err.message);
    process.exit(1);
  }
}

seedData();
