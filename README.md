# Bet On It - Social Betting Platform

A modern, mobile-first social betting platform for events like weddings, parties, sports gatherings, and more. Create fun betting pools with friends and family while keeping settlements outside the app.

## 🎯 Features

- **Event Creation**: Create betting events with custom questions
- **Multiple Bet Types**: Yes/No, Multiple Choice, Numeric guesses
- **Real-time Odds**: Live updates of betting pools and potential winnings
- **Social Sharing**: Easy event sharing with codes and links
- **Mobile-First Design**: Beautiful, responsive UI that works everywhere
- **No Payment Processing**: Track bets, settle outside the app

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bet-on-it-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase credentials in the `.env` file.

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 Usage

### Creating an Event

1. Sign up or log in to your account
2. Click "Create Event" 
3. Fill in event details (title, description, date)
4. Add betting questions with different types:
   - **Yes/No**: Simple binary questions
   - **Multiple Choice**: Choose from predefined options  
   - **Numeric**: Guess a number (closest wins)
5. Share your event code with participants

### Placing Bets

1. Join an event using the event code
2. Browse available questions
3. Select your answer and enter bet amount in USD
4. View potential winnings based on current pool
5. Confirm your bet

### Settlement

- The app tracks all bets but does not process payments
- Winners are displayed after event completion
- Settle bets outside the app using Venmo, PayPal, cash, etc.
- Mark bets as "settled" for record keeping

## 🎨 Design System

The app uses a modern design system with:

- **Colors**: Primary (blue) and accent (purple) gradients
- **Typography**: Inter font family with consistent sizing
- **Components**: Reusable UI components with hover states
- **Animations**: Subtle transitions and micro-interactions
- **Responsive**: Mobile-first with tablet and desktop breakpoints

## 🔒 Legal & Compliance

- **No Payment Processing**: App does not handle money transfers
- **Settlement Disclaimer**: Clear messaging about external settlement
- **Terms of Service**: Users agree to settle bets responsibly
- **Age Verification**: 18+ requirement for participation

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@betonit.app or join our Discord community.

---

**⚠️ Important**: This application does not process payments or handle money transfers. All bet settlements must be handled outside the platform using your preferred payment method.