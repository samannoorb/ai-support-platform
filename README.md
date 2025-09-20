# SupportAI - AI-Powered Customer Support Platform

A modern, full-featured customer support platform built with Next.js 14, TypeScript, Supabase, and Google Gemini AI.

## Features

### 🤖 AI-Powered Intelligence
- **Automatic Ticket Classification**: Smart categorization and priority assignment using Google Gemini AI
- **Response Suggestions**: AI-generated response suggestions for support agents
- **Sentiment Analysis**: Real-time sentiment analysis of customer messages
- **Smart Routing**: Intelligent ticket routing to appropriate agents

### 💬 Real-time Communication
- **Live Chat**: Real-time messaging with typing indicators
- **File Attachments**: Support for file uploads and sharing
- **Message History**: Complete conversation history and context
- **Multi-user Support**: Customer, agent, and admin roles

### 📊 Advanced Analytics
- **Performance Dashboards**: Role-based dashboards with key metrics
- **Response Time Tracking**: Monitor and improve response times
- **Customer Satisfaction**: Track satisfaction scores and trends
- **Custom Reports**: Generate detailed analytics reports

### 🔒 Enterprise Security
- **Row-Level Security**: Supabase RLS for data protection
- **Role-Based Access**: Granular permissions for different user types
- **Secure Authentication**: Email/password and OAuth support
- **Audit Logging**: Complete audit trail of all actions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **AI**: Google Gemini AI (@google/generative-ai)
- **Styling**: TailwindCSS with custom design system
- **Forms**: React Hook Form with Zod validation
- **State Management**: Custom hooks and React Context
- **Icons**: Lucide React
- **Charts**: Recharts for analytics

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Google AI API key (Gemini)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-customer-support-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kqczeidsvitoojqebecj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxY3plaWRzdml0b29qcWViZWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjQ4MzcsImV4cCI6MjA3Mzk0MDgzN30.Di8Fedun24cRzWQx6a20QgMVH4ETygiseeLn-Im8_J4
GEMINI_API_KEY=AIzaSyBGuwMhERpztnianrGALV9lvcDIPt92jtE
```

### 4. Database Setup

Run the database schema script in your Supabase SQL editor:

```bash
# The schema is located in database/schema.sql
# Copy and paste the contents into Supabase SQL Editor and run
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/                    # Next.js 14 App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   ├── login/             # Authentication pages
│   ├── signup/
│   └── dashboard/         # Protected dashboard pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   ├── layout/           # Layout components (Navbar, Sidebar)
│   ├── tickets/          # Ticket-related components
│   ├── chat/             # Chat interface components
│   └── dashboard/        # Dashboard components
├── hooks/                # Custom React hooks
│   ├── useAuth.tsx       # Authentication and role management
│   ├── useTickets.ts     # Ticket management
│   ├── useMessages.ts    # Real-time messaging
│   └── useDashboard.ts   # Dashboard statistics
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client configuration
│   ├── gemini.ts         # Google Gemini AI service
│   └── utils.ts          # Common utilities
├── types/                # TypeScript type definitions
│   ├── database.ts       # Supabase database types
│   └── index.ts          # Application types
├── services/             # API services and business logic
├── utils/                # Helper functions
└── database/             # Database schema and migrations
    └── schema.sql        # Complete database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## User Roles

### Customer
- Create and manage support tickets
- Real-time chat with support agents
- View ticket history and status
- File attachments and uploads

### Agent
- View and respond to assigned tickets
- Real-time chat with customers
- AI-powered response suggestions
- Ticket assignment and management
- Customer directory access

### Admin
- System-wide analytics and reporting
- User management and permissions
- Agent performance monitoring
- System configuration and settings

## AI Features

### Ticket Classification
The system automatically analyzes new tickets and provides:
- Priority level (urgent, high, medium, low)
- Category assignment (technical, billing, general, etc.)
- Estimated resolution time
- Suggested agent assignment

### Response Suggestions
Agents receive AI-generated response suggestions based on:
- Conversation context and history
- Ticket category and priority
- Customer sentiment analysis
- Knowledge base content

### Sentiment Analysis
Real-time sentiment analysis of customer messages helps agents:
- Understand customer emotions
- Prioritize urgent or frustrated customers
- Adapt their communication style
- Escalate when necessary

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- **users** - User profiles with role-based access
- **organizations** - Multi-tenant organization support
- **tickets** - Support tickets with metadata
- **messages** - Real-time chat messages
- **attachments** - File attachments for messages

Row-Level Security (RLS) is implemented to ensure data isolation and security.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Google AI](https://ai.google.dev/) for Gemini AI capabilities
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
