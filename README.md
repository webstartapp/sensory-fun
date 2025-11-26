# Sensory Fun - Event & Room Booking System

A comprehensive booking platform for sensory rooms and events, built with Next.js 15, TypeScript, and PostgreSQL.

## 🎯 Features

### Public Features
- **Event Browsing**: View featured and upcoming events with detailed information
- **Room Catalog**: Browse available sensory rooms with capacity and pricing
- **Smart Calendar**: Date selection with availability checking and 2-week booking window
- **Dynamic Capacity**: Real-time seat availability based on confirmed bookings
- **Multiple Seat Selection**: Book multiple seats with dynamic pricing
- **Secure Payments**: Global Payments HPP integration (no card data stored)
- **Gift Vouchers**: Purchase and redeem gift vouchers

### Admin Features
- **Dashboard**: Overview of bookings and revenue
- **Event Management**: Create single, repeating, or campaign events
- **Room Management**: Configure rooms with capacity and pricing
- **Booking Management**: Approve/decline bookings with payment capture
- **Banner Management**: Manage homepage hero banners
- **Voucher Management**: Create and track gift vouchers

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Knex.js
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Email**: Resend
- **Payments**: Global Payments (HPP - Hosted Payment Page)
- **Internationalization**: next-intl (Czech language)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Global Payments account (for production payments)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd sensory-fun
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb sensory_fun
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```bash
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sensory_fun
DB_PORT=5432

# Authentication
AUTH_SECRET=your_auth_secret_here_generate_with_openssl_rand_base64_32

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_your_api_key

# Global Payments (Optional - uses mock mode if not configured)
GLOBAL_PAYMENTS_MERCHANT_ID=your_merchant_id
GLOBAL_PAYMENTS_SHARED_SECRET=your_shared_secret
GLOBAL_PAYMENTS_HPP_URL=https://pay.sandbox.realexpayments.com/pay
```

### 4. Run Migrations and Seeds

```bash
# Run migrations
npm run migrate

# Seed initial data (images and sample data)
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Access Admin Panel

Navigate to `/admin` and log in with syour account(add self admin rights in database by setting role column to admin).

## 💳 Payment Testing

The system supports **dual-mode payment processing**:

### Mock Mode (No Credentials)

When Global Payments credentials are **not configured**, the system automatically uses a mock payment page.

**Testing Success:**
1. Complete booking form with customer details
2. You'll be redirected to the mock payment page
3. Fill in any card details (not validated)
4. Click **"Pay X Kč"** button
5. Booking status updates to `confirmed`

**Testing Failure:**
1. Complete booking form
2. On mock payment page, click **"Simulate Decline"** button
3. Booking status updates to `declined`

### Production Mode (With Credentials)

When Global Payments credentials **are configured**, the system redirects to the real Global Payments HPP.

**Testing with Sandbox:**
1. Configure sandbox credentials in `.env`
2. Use Global Payments test cards:
   - Success: `4263970000005262`
   - Decline: `4000120000001154`
3. Follow Global Payments documentation for more test scenarios

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── events/        # Event listing and details
│   │   ├── rooms/         # Room catalog
│   │   └── vouchers/      # Gift vouchers
│   ├── admin/             # Admin dashboard
│   │   ├── events/        # Event management
│   │   ├── rooms/         # Room management
│   │   ├── bookings/      # Booking management
│   │   └── banners/       # Banner management
│   ├── actions/           # Server actions
│   │   ├── bookings.ts    # Booking operations
│   │   ├── events.ts      # Event operations
│   │   └── payment.ts     # Payment callbacks
│   ├── payment/           # Mock payment page
│   └── booking-confirmation/ # Payment result page
├── components/
│   ├── admin/             # Admin components
│   ├── booking/           # Booking forms and modals
│   ├── events/            # Event components
│   ├── home/              # Homepage components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── db.ts              # Database connection
│   ├── payment-gateway.ts # Payment integration
│   └── auth.ts            # Authentication config
├── types/
│   └── db.ts              # TypeScript interfaces
└── migrations/            # Database migrations
```

## 🗄️ Database Schema

### Key Tables

- **users**: Admin users with authentication
- **rooms**: Sensory rooms with capacity and pricing
- **events**: Single, repeating, or campaign events
- **bookings**: Event and voucher bookings with payment status
- **vouchers**: Gift voucher templates
- **images**: Uploaded images for rooms/events
- **banners**: Homepage hero banners

### Booking Statuses

- `pending_payment`: Booking created, awaiting payment
- `authorized`: Payment authorized (funds held)
- `confirmed`: Payment captured (funds transferred)
- `declined`: Payment declined or booking rejected

## 🔐 Payment Flow

1. **User submits booking** → Customer details collected in modal
2. **System creates booking** → Status: `pending_payment`
3. **Redirect to payment gateway** → Global Payments HPP (or mock)
4. **Payment authorization** → Funds held (not captured)
5. **Callback to system** → Signature verified, booking updated
6. **Confirmation page** → Success/failure displayed
7. **Admin approval** → Manual capture in admin dashboard

### Booking Status Lifecycle

- **pending_payment**: Initial state when booking is created
- **confirmed**: Payment authorized successfully (awaiting admin capture)
- **declined**: Payment failed or booking rejected
- **authorized**: (Future) Payment captured by admin

### Abandoned Booking Cleanup

Bookings that remain in `pending_payment` status are automatically cleaned up to release capacity:

**Automatic Cleanup (Recommended):**

Set up a cron job to call the cleanup API:

```bash
# Every 30 minutes
*/30 * * * * curl -X GET "https://your-domain.com/api/cleanup-bookings?minutes=30" -H "x-api-key: your_secret_key"
```

Add to `.env`:
```bash
CLEANUP_API_KEY=your_secret_cleanup_key
```

**Manual Cleanup:**

You can also trigger cleanup manually via the API:

```bash
# Clean up bookings older than 30 minutes
curl -X GET "http://localhost:3000/api/cleanup-bookings?minutes=30"

# With API key authentication
curl -X GET "http://localhost:3000/api/cleanup-bookings?minutes=30" \
  -H "x-api-key: your_secret_key"
```

## 📧 Email Notifications

The system uses Resend for transactional emails:

- Booking confirmations
- Payment receipts
- Admin notifications

Configure `RESEND_API_KEY` in `.env` to enable emails.

## 🌍 Localization

The application is fully localized in Czech using `next-intl`. All text is stored in `messages/cs.json`.

To add translations:
1. Edit `messages/cs.json`
2. Use `useTranslations('namespace')` in components

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run migrate:make # Create new migration
npm run seed         # Seed database with initial data
npm run lint         # Run ESLint
```

## 🚢 Deployment

### Environment Setup

1. Set up PostgreSQL database
2. Configure all environment variables
3. Run migrations: `npm run migrate`
4. Seed initial data: `npm run seed`

### Build and Deploy

```bash
npm run build
npm run start
```

### Recommended Platforms

- **Vercel**: Automatic deployments with GitHub integration
- **Railway**: PostgreSQL + Next.js hosting
- **Render**: Full-stack deployment

## 🔒 Security

- ✅ No card data stored or handled
- ✅ HMAC-SHA1 signature verification for payments
- ✅ Server-side validation for all operations
- ✅ NextAuth.js for secure authentication
- ✅ Environment variables for sensitive data
- ✅ PCI DSS compliant (HPP handles card details)

## 📝 Development Notes

### Adding New Events

Events can be:
- **Single**: One-time event with specific date
- **Repeating**: Recurring on specific days/times
- **Campaign**: Time-limited special events

### Capacity Management

- Room capacity is the source of truth
- Available seats = Room capacity - Confirmed bookings
- Real-time updates when bookings are made

### Payment Gateway Integration

The system is designed for easy integration with Global Payments:
1. Add credentials to `.env`
2. System automatically switches from mock to real HPP
3. No code changes required

## 🐛 Troubleshooting

**Database connection issues:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb sensory_fun`

**Payment not working:**
- Check if Global Payments credentials are configured
- Verify HPP URL (sandbox vs production)
- Check browser console for errors

**Images not loading:**
- Run seed script: `npm run seed`
- Check `images` table in database

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact: [Your Contact Info]
