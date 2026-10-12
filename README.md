# Wisper 💬

### Anonymous Messaging & Custom Feedback Platform

Wisper is a web-based anonymous messaging platform built with Next.js and TypeScript. It allows users to receive anonymous messages, share personalized feedback links, and manage their conversations through a dedicated dashboard.

Whether you want honest feedback, anonymous opinions, or a simple way to connect with people, Wisper makes sharing thoughts easier.

## ✨ Features

- **🔐 Authentication** — Sign up, sign in, and verify your account using email verification codes.
- **👤 Unique Usernames** — Check username availability and create a personalized profile.
- **💌 Anonymous Messaging** — Share your profile link and receive messages without requiring senders to create an account.
- **📝 Custom Feedback Links** — Create personalized questions that visitors can answer through dedicated feedback links.
- **📊 User Dashboard** — View and manage received messages in one place.
- **🗑️ Message Management** — Delete messages you no longer need.
- **🤖 AI Message Suggestions** — Generate suggested messages to help users start conversations.
- **🔗 Shareable Profiles** — Share your personal Wisper link with friends and your community.
- **📱 Responsive Interface** — A modern interface designed for a range of screen sizes.
- **🛡️ Input Validation** — Validate user input with Zod schemas.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React.js | User interface |
| TypeScript | Type-safe development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling, if used in the current implementation |
| Tailwind CSS | Styling and responsive design |
| Zod | Input validation |
| Resend | Email delivery |
| Next.js Route Handlers | Backend API endpoints |
| React Context API | Authentication state management |
| ESLint | Code quality and linting |

## 🏗️ Project Architecture

Wisper uses the Next.js App Router to organize frontend pages, backend API endpoints, reusable components, and database-related modules in one application.

```text
wisper/
├── email/
│   └── VerificationEmail.tsx
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   └── dashboard/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── verify/[username]/
│   │   ├── api/
│   │   │   ├── accept-messages/
│   │   │   ├── auth/
│   │   │   ├── check-username-unique/
│   │   │   ├── delete-message/[messageid]/
│   │   │   ├── feedback-prompts/
│   │   │   ├── get-messages/
│   │   │   ├── send-message/
│   │   │   ├── sign-up/
│   │   │   ├── suggest-messages/
│   │   │   └── verify-code/
│   │   ├── u/[username]/
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── context/
│   ├── helpers/
│   ├── lib/
│   ├── middleware.ts
│   ├── modules/
│   ├── schema/
│   └── types/
├── package.json
├── next.config.ts
└── tsconfig.json
```

## ⚙️ Getting Started

Follow these steps to run Wisper locally.

### 1. Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) — LTS version recommended
- npm
- A MongoDB database, either local or hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)
- A Resend account and API key for email delivery
- An API key for your configured AI provider if you want to use AI message suggestions

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/wisper.git
cd wisper
```

Replace `your-username/wisper` with your actual GitHub repository path.

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
```

Add any additional variables required by your current authentication and AI provider implementations.

**Important:** These variable names are examples. Check the existing source code and authentication configuration for the exact names your project uses. Never commit real API keys, database credentials, or secrets to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm run start
```

## 🔄 How Wisper Works

### Anonymous Messaging

1. A user creates an account and chooses a unique username.
2. Wisper provides a shareable profile link.
3. The user shares the link with friends or their audience.
4. Visitors submit anonymous messages through the profile page.
5. The account owner views and manages received messages in the dashboard.

### Custom Feedback Links

1. A user creates a custom feedback question.
2. Wisper generates a link associated with that question.
3. The user shares the link with the intended audience.
4. Visitors see the question and submit their responses.
5. Responses can be associated with their original feedback prompt for easier organization.

### AI Message Suggestions

1. A user opens the message suggestion feature.
2. Wisper requests suggested messages from the configured AI provider.
3. The suggestions help the user get ideas for starting a conversation.

## 🔌 API Routes

The application uses Next.js Route Handlers for its backend operations.

| Endpoint | Purpose |
|---|---|
| `/api/sign-up` | User registration |
| `/api/auth/*` | Authentication-related operations |
| `/api/check-username-unique` | Username availability checking |
| `/api/verify-code` | Verification code validation |
| `/api/accept-messages` | Manage message acceptance settings |
| `/api/send-message` | Submit a message |
| `/api/get-messages` | Retrieve received messages |
| `/api/delete-message/[messageid]` | Delete a message |
| `/api/feedback-prompts` | Manage custom feedback prompts |
| `/api/suggest-messages` | Generate message suggestions |

The precise HTTP methods, request bodies, authentication requirements, and response formats depend on the implementation of each route handler.

## 🔒 Security Considerations

- Keep API keys and database credentials in environment variables.
- Validate incoming requests on the server.
- Protect private dashboard operations with appropriate authentication and authorization checks.
- Validate usernames, messages, and feedback responses.
- Apply rate limiting and abuse prevention to public anonymous-message endpoints before production deployment.
- Configure email verification and authentication secrets securely.
- Avoid exposing private user information in API responses.

## 🚀 Deployment

Wisper can be deployed on a Next.js-compatible hosting platform, such as [Vercel](https://vercel.com/).

A typical deployment workflow:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Set up a hosted MongoDB database and allow the deployed application to connect to it.
5. Configure the email provider and verify the sender domain as required.
6. Deploy the application and test authentication, messaging, feedback links, and AI suggestions.

**Note:** A successful deployment requires all external services, environment variables, and database permissions to be configured correctly.

## 🗺️ Future Improvements

- Real-time message notifications
- Improved spam detection and rate limiting
- Message search and filtering
- Feedback analytics and response summaries
- More customizable public profiles
- Enhanced accessibility and mobile experience
- Automated tests and CI/CD workflows

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing your improvements.

## 📄 License

Choose a license for the project before distributing or accepting external contributions. If you choose the MIT License, add a `LICENSE` file containing the appropriate license text.

---

**Built with ❤️ using Next.js and TypeScript.**

If you find Wisper interesting, consider giving the repository a ⭐ on GitHub!
