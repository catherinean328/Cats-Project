# 🎧 Ventishh - Anonymous Peer-to-Peer Venting Platform

**Ventishh** is a compassionate, anonymous voice calling platform that connects people who need to vent with caring listeners. It provides a judgment-free space for emotional support through peer-to-peer voice conversations.

## ✨ Features

### 🔒 **Complete Anonymity**
- No sign-ups, no personal information required
- Anonymous voice-only conversations
- Secure peer-to-peer connections

### 🎯 **Two User Roles**
- **Venters**: People who need to express their feelings and be heard
- **Listeners**: Compassionate individuals who provide emotional support

### 🚀 **Real-time Matching**
- Smart queue system that pairs venters with available listeners
- Live queue status updates with estimated wait times
- Instant notifications when matches are found

### 📞 **Telegram Integration**
- Seamless voice calling through Telegram
- No need for microphone permissions in browser
- High-quality calls using Telegram's infrastructure
- Familiar calling interface for users

### 💻 **Modern UI/UX**
- Beautiful, responsive design built with Tailwind CSS
- Intuitive user interface with helpful guidance
- Real-time notifications and status updates
- Mobile-friendly design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS
- **Real-time Updates**: Polling (every 3 seconds)
- **Voice Calls**: Telegram Integration
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17.0 or higher recommended)
- npm or yarn package manager
- Neon database account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ventishh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database** (see SETUP.md for detailed instructions)
   ```bash
   # Create .env.local with your Neon DATABASE_URL
   npm run db:generate
   npm run db:migrate
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Application: http://localhost:3000

## 📱 How to Use

### For Venters (People who need to talk):
1. Visit the landing page
2. Click "I need to vent"
3. Wait in the queue to be matched with a listener
4. Click "Vent Now" to call the listener on Telegram
5. Express yourself freely in a judgment-free conversation

### For Listeners (People who want to help):
1. Visit the landing page
2. Click "I want to listen"
3. Enter your Telegram username (e.g., @yourusername)
4. Wait to be matched with someone who needs support
5. Answer the incoming Telegram call and provide compassionate listening

## 🏗️ Project Structure

```
ventishh/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── listener/        # Listener interface
│   │   ├── venter/         # Venter interface
│   │   └── page.tsx        # Landing page
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   │   ├── useUser.ts      # User session management
│   │   └── useWebRTC.ts    # WebRTC functionality
│   ├── lib/                # Utility libraries
│   │   └── socket.ts       # Socket.IO client management
│   └── types/              # TypeScript type definitions
├── server.js               # Socket.IO server
└── package.json
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Socket.IO Server
The included `server.js` provides a basic Socket.IO server for development. In production, you might want to:
- Deploy the server separately
- Add authentication and rate limiting
- Implement persistent storage for analytics
- Add moderation features

## 🚀 Deployment

### Frontend (Vercel - Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with automatic CI/CD

### Backend (Railway, Heroku, or any Node.js hosting)
1. Deploy the `server.js` file
2. Update `NEXT_PUBLIC_SOCKET_URL` to point to your deployed server
3. Ensure proper CORS configuration

## 🛡️ Privacy & Safety

- **Anonymous by Design**: No personal data is collected or stored
- **Temporary Sessions**: User sessions are cleared when they leave
- **Peer-to-Peer**: Voice data is transmitted directly between users
- **No Recording**: Conversations are not recorded or stored

## 🚨 Important Notes

### Mental Health Disclaimer
Ventishh is designed for peer support and should not replace professional mental health services. If you or someone you know is in crisis:

- **US**: National Suicide Prevention Lifeline: 988
- **UK**: Samaritans: 116 123
- **Emergency**: Always call your local emergency services

### Browser & App Requirements
- Modern browsers for the web interface
- Telegram app installed on device for voice calls
- Works on all platforms (desktop, mobile, tablet)
- No microphone permissions needed in browser

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug? Open an issue
2. **Feature Requests**: Have an idea? Share it with us
3. **Code Contributions**: Fork, develop, and submit pull requests
4. **Documentation**: Help improve our documentation

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Ensure responsive design
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with love for mental wellness
- Inspired by the need for accessible emotional support
- Thanks to all contributors and supporters

## 📞 Support

If you need help with the platform:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Remember**: You matter, your feelings are valid, and there are people who care. Ventishh is here to help you connect with them. 💜