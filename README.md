# 🏥 MediTrack - Your Personal Health Companion

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)

> **Transform your health management with AI-powered insights, intelligent medication reminders, and comprehensive health tracking.**

![MediTrack Hero](https://github.com/user-attachments/assets/your-hero-image-here)

## ✨ Features

### 🩺 **Comprehensive Health Tracking**
- **Blood Pressure Monitoring**: Log systolic and diastolic readings with timestamps
- **Visual Analytics**: Beautiful charts showing BP trends over time
- **Historical Data**: Complete reading history with search and filtering

### 💊 **Smart Medication Management**
- **Intelligent Reminders**: Browser and system notifications for medication times
- **Flexible Scheduling**: Support for daily, twice-daily, and weekly medications
- **Medication Logs**: Track taken, missed, and skipped doses
- **Quick Actions**: One-click "Mark as Taken" functionality

### 🔔 **Advanced Notifications**
- **Browser Notifications**: Real-time medication reminders
- **Permission Management**: Smart notification permission handling
- **Customizable Alerts**: Set multiple reminder times per medication
- **Background Notifications**: Service worker support for persistent reminders

### 🤖 **AI-Powered Insights**
- **Health Summaries**: AI-generated analysis of your health patterns
- **Trend Analysis**: Identify patterns in blood pressure readings
- **Personalized Recommendations**: Smart health suggestions based on your data

### 🔐 **Secure Authentication**
- **Firebase Authentication**: Industry-standard user management
- **Secure Data Storage**: All health data encrypted and protected
- **User Privacy**: HIPAA-compliant data handling practices

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Firebase** project (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gauranggupta2323/MediTrack.git
   cd MediTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 📱 Usage Guide

### Getting Started
1. **Register**: Create your account with email and password
2. **Dashboard**: Access your personalized health dashboard
3. **Add Data**: Start logging blood pressure readings and medications

### Blood Pressure Tracking
- **Log Readings**: Enter systolic and diastolic values
- **Add Notes**: Include context about your readings
- **View Trends**: Analyze patterns with interactive charts
- **Export Data**: Download your health data anytime

### Medication Management
- **Add Medications**: Enter name, dosage, and frequency
- **Set Reminders**: Choose notification times
- **Track Intake**: Mark medications as taken, missed, or skipped
- **View History**: Review your medication adherence

### Notifications Setup
1. **Enable Permissions**: Allow browser notifications when prompted
2. **Set Schedules**: Configure reminder times for each medication
3. **Manage Alerts**: Update or disable notifications as needed

## 🛠 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/register    // User registration
POST /api/auth/login       // User login
POST /api/auth/logout      // User logout
```

### Blood Pressure Endpoints
```typescript
GET    /api/blood-pressure           // Get user's BP readings
POST   /api/blood-pressure           // Create new BP reading
GET    /api/blood-pressure/{id}      // Get specific reading
PUT    /api/blood-pressure/{id}      // Update reading
DELETE /api/blood-pressure/{id}      // Delete reading
```

### Medication Endpoints
```typescript
GET    /api/medications              // Get user's medications
POST   /api/medications              // Create new medication
GET    /api/medications/{id}         // Get specific medication
PUT    /api/medications/{id}         // Update medication
DELETE /api/medications/{id}         // Delete medication
```

### Medication Log Endpoints
```typescript
GET    /api/medication-logs          // Get medication logs
POST   /api/medication-logs          // Create medication log entry
```

## 🏗 Architecture

### Frontend Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── dashboard/        # Dashboard-specific components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # Business logic services
└── types/                # TypeScript type definitions
```

### Backend Services
- **AuthService**: User authentication and management
- **BloodPressureService**: BP data operations
- **MedicationService**: Medication and log management
- **NotificationService**: Push notification handling

### Database Schema
```typescript
// Users Collection
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Blood Pressure Readings Collection
interface BloodPressureReading {
  id: string;
  userId: string;
  systolic: number;
  diastolic: number;
  date: string;
  time: string;
  notes?: string;
  createdAt: Date;
}

// Medications Collection
interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Medication Logs Collection
interface MedicationLog {
  id: string;
  userId: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'taken' | 'missed' | 'skipped';
  date: string;
  notes?: string;
  createdAt: Date;
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Sky Blue (#3498db) - Trust and reliability
- **Background**: Very Light Blue (#ecf0f1) - Clean and calming
- **Accent**: Purple (#9b59b6) - Important alerts and actions
- **Success**: Green (#27ae60) - Positive actions
- **Warning**: Orange (#f39c12) - Attention needed
- **Error**: Red (#e74c3c) - Critical alerts

### Typography
- **Font Family**: Inter (Grotesque sans-serif)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Components
Built with **Radix UI** primitives for accessibility and **Tailwind CSS** for styling:
- Form controls with validation
- Data tables with sorting
- Interactive charts with Recharts
- Modal dialogs and alerts
- Loading states and skeletons

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
├── e2e/                  # End-to-end tests
└── helpers/              # Test utilities
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add Firebase configuration in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch

### Other Platforms
- **Netlify**: Full support with serverless functions
- **Railway**: Simple deployment with built-in database options
- **Firebase Hosting**: Native Firebase integration

### Production Checklist
- [ ] Environment variables configured
- [ ] Firebase security rules updated
- [ ] Performance monitoring enabled
- [ ] Error tracking configured (Sentry recommended)
- [ ] Backup strategy implemented

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
```

### Development Features
- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Automatic code formatting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing React framework
- **Firebase** for robust backend services
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Recharts** for beautiful data visualizations

## 📞 Support

### Get Help
- 📧 **Email**: support@meditrack.app
- 💬 **Discord**: [Join our community](https://discord.gg/meditrack)
- 📖 **Documentation**: [docs.meditrack.app](https://docs.meditrack.app)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Gauranggupta2323/MediTrack/issues)

### Feature Requests
We love hearing your ideas! Submit feature requests through:
- GitHub Discussions
- Community Discord
- Email feedback

---

<div align="center">

**Made with ❤️ for better health management**

[Website](https://meditrack.app) • [Documentation](https://docs.meditrack.app) • [Community](https://discord.gg/meditrack)

</div>
