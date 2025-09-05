# Know Your Rights Buddy

Your pocket guide to legal rights during police interactions.

## 🚀 Overview

Know Your Rights Buddy is a mobile-first web application that provides instant, state-specific legal rights information, actionable scripts, and documentation tools for individuals interacting with law enforcement.

### ✨ Core Features

- **State-Specific Rights Guides**: One-page, mobile-optimized guides with concise legal rights information tailored to specific US states
- **Actionable Scripts & Guidance**: Pre-written, easy-to-use scripts and clear instructions for common scenarios (traffic stops, questioning, etc.)
- **Quick Incident Recording**: One-tap audio/video recording with automatic timestamp and location capture
- **Shareable Summary Cards**: Generate and share digital cards summarizing key rights and interaction details with trusted contacts

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **AI**: OpenAI GPT-3.5/4
- **Storage**: Pinata (IPFS)
- **Deployment**: Docker-ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Stripe account (for payments)
- OpenAI API key (for AI features)
- Pinata account (for IPFS storage)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd know-your-rights-buddy
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Fill in your API keys in `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Pinata Configuration
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database schema:
   ```sql
   -- Copy and paste the contents of database/schema.sql into your Supabase SQL editor
   ```
3. (Optional) Load sample data:
   ```sql
   -- Copy and paste the contents of database/seed_data.sql
   ```

### 4. Stripe Setup

1. Create products and prices in your Stripe dashboard:
   - Basic Plan: $1.99/month
   - Premium Plan: $4.99/month
2. Update the price IDs in `src/services/stripe.js`
3. Set up webhooks for subscription events

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Header.jsx
│   ├── RecordButton.jsx
│   ├── ShareCardGenerator.jsx
│   └── StateSelector.jsx
├── pages/              # Main application pages
│   ├── Home.jsx
│   ├── StateGuide.jsx
│   ├── Scripts.jsx
│   ├── Recording.jsx
│   └── Profile.jsx
├── services/           # API integrations
│   ├── supabase.js     # Database & auth
│   ├── stripe.js       # Payments
│   ├── openai.js       # AI features
│   ├── pinata.js       # IPFS storage
│   └── geolocation.js  # Location services
├── context/            # React context
│   └── AppContext.jsx
└── styles/
    └── index.css       # Global styles
```

## 🔧 Configuration

### Subscription Tiers

The app supports three subscription tiers:

- **Free**: Basic rights info, 1 state guide, 5 recordings, 2 trusted contacts
- **Basic ($1.99/month)**: 5 state guides, 25 recordings, 5 trusted contacts
- **Premium ($4.99/month)**: Unlimited access, AI features, priority support

### State Rights Guides

State-specific legal information is stored in the `state_rights_guides` table. Each guide includes:

- Basic constitutional rights
- Traffic stop procedures
- Pedestrian stop laws
- State-specific legislation
- Recording laws

### API Integrations

#### Supabase
- User authentication and profiles
- Database operations
- Real-time subscriptions
- Row-level security

#### Stripe
- Subscription management
- Payment processing
- Webhook handling
- Customer portal

#### OpenAI
- AI-powered script generation
- Summary card creation
- Script improvement based on feedback

#### Pinata
- IPFS storage for recordings
- Decentralized file management
- Metadata tracking

## 🚀 Deployment

### Docker Deployment

```bash
# Build the image
docker build -t know-your-rights-buddy .

# Run the container
docker run -p 3000:3000 know-your-rights-buddy
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

- Database URLs and keys
- API keys for all services
- Proper CORS settings
- SSL certificates

## 🔒 Security Considerations

- All API keys should be stored securely
- Row-level security is enabled on all database tables
- User data is encrypted at rest
- HTTPS is required for production
- Regular security audits recommended

## 📱 Mobile Optimization

The app is designed mobile-first with:

- Responsive design for all screen sizes
- Touch-friendly interface
- Offline capability for core features
- Progressive Web App (PWA) support
- Fast loading times

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📊 Analytics & Monitoring

The app includes usage analytics tracking:

- User interactions
- Feature usage
- Performance metrics
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 Legal Disclaimer

This application provides general legal information and should not be considered legal advice. Users should consult with qualified attorneys for specific legal situations.

## 📞 Support

For technical support or questions:

- Create an issue in this repository
- Email: support@knowyourrights.app
- Documentation: [Link to docs]

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Legal rights information sourced from public legal resources
- UI components inspired by modern design systems
- Community feedback and contributions

---

**Important**: This application deals with sensitive legal and personal safety information. Always prioritize user privacy and data security in any modifications or deployments.
