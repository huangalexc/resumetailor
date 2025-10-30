# Next.js 15 Authentication Best Practices Research (2025)

**Research Date:** October 30, 2025
**Target Stack:** Next.js 15.5.5, React 19.1.0, TypeScript, Tailwind CSS 3.4.18, Zustand

---

## Executive Summary

This research synthesizes current industry best practices for implementing authentication in Next.js 15 applications based on official documentation, security standards (OWASP), and real-world implementations from 2025.

**Critical Security Update:** A critical vulnerability (CVE-2025-29927, CVSS 9.1) was disclosed in March 2025 affecting Next.js versions 11.1.4 through 15.2.2. Applications must upgrade to patched versions: **Next.js 15.2.3+, 14.2.25+, 13.5.9+, or 12.3.5+**.

---

## 1. Authentication Solutions Comparison

### 1.1 NextAuth.js v5 (Auth.js) ⭐ RECOMMENDED FOR FULL CONTROL

**Authority Level:** Official Next.js documentation recommends Auth.js for authentication.

**Best For:** Free, open-source solution when you want complete control and no vendor lock-in.

**Key Features:**
- Complete rewrite prioritizing App Router compatibility
- Universal `auth()` function working across all Next.js contexts
- Supports 50+ OAuth providers
- Works with any database (PostgreSQL, MySQL, MongoDB)
- Zero vendor lock-in

**Pros:**
- Free and open-source
- Complete flexibility and customization
- Active maintenance and community support
- Official Next.js integration

**Cons:**
- Setup complexity (1-3 hours for basic implementation)
- No built-in UI components (must build your own)
- More manual configuration required

**Implementation Time:** 1-3 hours basic setup + UI development time

**Pricing:** Free

**When to Choose:**
- You want complete control over authentication flow
- Budget constraints (free tier)
- No vendor lock-in tolerance
- Comfortable building custom UI

**Official Documentation:**
- https://authjs.dev/
- https://authjs.dev/getting-started/adapters/prisma

---

### 1.2 Clerk ⭐ RECOMMENDED FOR RAPID DEVELOPMENT

**Authority Level:** Widely adopted by production Next.js applications, mentioned in official Next.js guides.

**Best For:** Rapid implementation with exceptional developer experience and minimal configuration.

**Key Features:**
- Pre-built, customizable UI components
- Beautiful authentication flows out of the box
- Built-in MFA, passkeys, bot protection
- User management dashboard
- First-class Supabase integration with full RLS support

**Pros:**
- Generous free tier (10,000 MAUs)
- Implementation speed (working auth in 1-3 days)
- Saves 40-80 hours of frontend development
- Excellent DX and documentation
- Advanced security features included

**Cons:**
- Vendor lock-in
- Less backend control
- Pricing can scale up quickly
- May be overkill for simple use cases

**Implementation Time:** 1-3 days for complete setup

**Pricing:** Free up to 10,000 MAUs, then tiered pricing

**When to Choose:**
- Rapid MVP development
- Need professional UI immediately
- Want advanced features (MFA, passkeys) without building them
- Acceptable vendor lock-in for speed/features trade-off

**Official Documentation:**
- https://clerk.com/docs
- https://clerk.com/articles/complete-authentication-guide-for-nextjs-app-router

---

### 1.3 Supabase Auth

**Authority Level:** Official Supabase product with strong PostgreSQL integration.

**Best For:** When you're already using Supabase for database, leveraging PostgreSQL Row Level Security.

**Key Features:**
- Built on open-source GoTrue server
- Direct PostgreSQL integration
- Database-level authorization through RLS
- Performance: 4x faster reads, 3.1x faster writes vs Firebase

**Pros:**
- Exceptional value (50,000 MAU free tier)
- Deep PostgreSQL integration
- Row Level Security at database layer
- Good performance benchmarks

**Cons:**
- UI components less polished than Clerk
- Simpler feature set compared to dedicated auth platforms
- Overkill if not using Supabase for other features

**Implementation Time:** 2-5 days

**Pricing:** Free up to 50,000 MAUs

**When to Choose:**
- Already using Supabase database
- Need database-level security (RLS)
- Large free tier needed (50k MAUs)
- Open-source preference

**Official Documentation:**
- https://supabase.com/docs/guides/auth

---

### 1.4 Decision Matrix

| Criteria | NextAuth v5 | Clerk | Supabase Auth |
|----------|-------------|-------|---------------|
| **Cost (free tier)** | Unlimited | 10,000 MAUs | 50,000 MAUs |
| **Setup Time** | 1-3 hours (basic) | 1-3 days (complete) | 2-5 days |
| **UI Components** | None (DIY) | Excellent | Good |
| **Customization** | Complete | Moderate | Moderate |
| **Vendor Lock-in** | None | High | Moderate |
| **Security Features** | Standard | Advanced (MFA, passkeys) | Standard |
| **Database Flexibility** | Any | Any | PostgreSQL |
| **Best For** | Full control, budget | Speed, polish | Supabase users |

**Recommendation for Resume Tailor SaaS:**
- **Primary Choice:** NextAuth v5 (Auth.js) - Provides complete control, works with your existing stack, and has no ongoing costs
- **Alternative:** Clerk if you need to ship quickly and want professional UI without development time

---

## 2. JWT vs Session-Based Authentication

### 2.1 Authentication Strategies

**Authority Level:** OWASP guidelines, Next.js official documentation, Auth.js recommendations.

#### Strategy 1: Stateless JWT (Session-less)

**How it works:**
- Store session data or tokens in browser cookies
- Server verifies token on each request without database lookup
- Token contains all necessary user information (encoded, signed)

**Pros:**
- Highly scalable (no database queries per request)
- Ideal for microservices and distributed systems
- Lower server resource usage
- Faster request processing

**Cons:**
- Cannot revoke tokens before expiration
- Larger cookie size
- Less secure if not implemented correctly
- Token refresh complexity

**When to Use:**
- High-scale applications (large user base)
- Microservices architecture
- Stateless API requirements
- Edge/serverless deployments

---

#### Strategy 2: Database Sessions (Stateful)

**How it works:**
- Store session data in database
- Browser receives encrypted session ID only
- Server queries database to validate session on each request

**Pros:**
- Can revoke sessions immediately
- More secure (server controls all session data)
- Smaller cookie size
- Easy to implement session management features

**Cons:**
- Database query on every request
- Higher server resource usage
- Scaling requires session store (Redis, etc.)
- Slower than stateless JWT

**When to Use:**
- Security-critical applications
- Need immediate session revocation
- User session management features needed
- Moderate scale applications

---

#### Strategy 3: Hybrid Approach (Stateful JWT) ⭐ RECOMMENDED

**How it works:**
- JWT tokens that reference a session in the database
- Combines benefits of both approaches
- Token can be revoked via database

**Pros:**
- Tokens can be revoked (security)
- Faster than pure database sessions
- Better security than pure JWT
- Industry best practice

**Cons:**
- Still requires database round-trip
- More complex implementation

**When to Use:**
- Most production applications (recommended)
- Need both security and performance
- Session revocation required

**Implementation Note:** NextAuth v5 uses JWT strategy by default but can be configured for database sessions. Middleware requires JWT strategy (database not supported at the Edge).

---

### 2.2 Security Considerations

**OWASP Recommendations:**
1. Never store tokens in localStorage (XSS vulnerable)
2. Use HttpOnly cookies for token storage
3. Implement proper CSRF protection
4. Set appropriate token expiration times
5. Use refresh token rotation

**Best Practices:**
- Access tokens: 5-10 minutes expiration
- Refresh tokens: 7-30 days expiration
- Rotate refresh tokens on each use
- Store tokens in HttpOnly, Secure, SameSite cookies

---

## 3. Password Hashing: Bcrypt vs Argon2

### 3.1 Comparison

**Authority Level:** OWASP guidelines, Password Hashing Competition (PHC) results, industry benchmarks.

#### Argon2 ⭐ RECOMMENDED

**Winner of Password Hashing Competition (PHC) 2015** - considered state-of-the-art.

**Key Advantages:**
- **Memory-hard**: Resistant to GPU/ASIC attacks
- **Configurable**: Three parameters (time, memory, parallelism)
- **No password length limit**: Unlike bcrypt's 72-byte limit
- **Modern design**: Built for current threat landscape
- **Three variants:**
  - Argon2d: Maximum resistance to GPU attacks
  - Argon2i: Maximum resistance to side-channel attacks
  - Argon2id: Hybrid (recommended for most uses)

**Node.js Library:** `argon2`

**Configuration Recommendations:**
```javascript
const argon2 = require('argon2');

// OWASP recommended settings (2025)
const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,    // 19 MiB
    timeCost: 2,          // 2 iterations
    parallelism: 1        // 1 thread
  });
};

const verifyPassword = async (hash, password) => {
  return await argon2.verify(hash, password);
};
```

**When to Choose:**
- New applications (strongly recommended)
- Security is high priority
- Modern infrastructure
- Future-proof choice

---

#### Bcrypt (Legacy but Still Valid)

**Industry standard for 20+ years** - battle-tested and widely supported.

**Key Characteristics:**
- **CPU-intensive**: Good against brute force
- **72-byte limit**: Only uses first 72 bytes of password
- **Mature ecosystem**: Libraries everywhere
- **Good enough**: Still secure for most applications

**Node.js Libraries:** `bcrypt` or `bcryptjs`

**Configuration Recommendations:**
```javascript
const bcrypt = require('bcrypt');

// Recommended settings (2025)
const SALT_ROUNDS = 12; // Computational cost factor

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = async (hash, password) => {
  return await bcrypt.compare(password, hash);
};
```

**When to Choose:**
- Legacy application migration
- Wider language/platform support needed
- Simpler implementation preferred
- Limited memory resources

---

### 3.2 Migration Strategy

**For existing applications using bcrypt:**

```typescript
// Progressive migration approach
async function verifyAndUpgrade(userId: string, password: string, storedHash: string) {
  // Detect hash type
  const isBcrypt = storedHash.startsWith('$2');

  if (isBcrypt) {
    // Verify with bcrypt
    const isValid = await bcrypt.compare(password, storedHash);

    if (isValid) {
      // Re-hash with Argon2 on successful login
      const newHash = await argon2.hash(password);
      await updateUserHash(userId, newHash);
    }

    return isValid;
  } else {
    // Already Argon2
    return await argon2.verify(storedHash, password);
  }
}
```

**Benefits:**
- Zero downtime migration
- Users automatically upgraded on login
- No forced password resets
- Gradual transition over time

---

### 3.3 Recommendation

**For Resume Tailor (New Application):**
Use **Argon2id** with OWASP recommended parameters. It's the modern standard, more secure, and future-proof.

**NPM Package:** `argon2`
```bash
npm install argon2
```

---

## 4. Prisma Schema Best Practices

### 4.1 Recommended User Schema

**Authority Level:** Auth.js official Prisma adapter schema, OWASP authentication guidelines, Prisma best practices.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTHENTICATION MODELS (Auth.js Compatible)
// ============================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials provider
  role          UserRole  @default(MEMBER)

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  tokens        Token[]

  @@index([email])
  @@map("users")
}

enum UserRole {
  ADMIN
  MEMBER
}

// OAuth accounts (Google, GitHub, etc.)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

// Session management (for database strategy)
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

// Email verification and password reset tokens
model Token {
  id      String    @id @default(cuid())
  email   String
  token   String    @unique
  type    TokenType
  expires DateTime

  @@unique([email, token])
  @@index([email])
  @@map("tokens")
}

enum TokenType {
  VERIFICATION
  PASSWORD_RESET
  TWO_FACTOR
}

// Optional: Verification tokens (Auth.js compatible)
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

---

### 4.2 Key Design Decisions

#### 4.2.1 User IDs

**Recommendation:** Use `cuid()` over auto-increment IDs

**Reasoning:**
- OWASP guideline: User IDs should be randomly generated
- Prevents predictable/sequential ID enumeration attacks
- Better for distributed systems
- Privacy benefits

**Alternative:** `uuid()` is also acceptable

---

#### 4.2.2 Password Field

```prisma
password String? // Nullable to support OAuth-only users
```

**Best Practices:**
- Nullable to support OAuth users without passwords
- Store Argon2 or bcrypt hash only (never plaintext)
- Minimum length validation in application layer
- Consider separate `passwordHash` name for clarity

---

#### 4.2.3 Email Verification

```prisma
emailVerified DateTime? // Null = not verified
```

**Pattern:**
- `null` = email not verified
- `DateTime` = timestamp of verification
- Prevents login until verified (application logic)

---

#### 4.2.4 Token Management

**Separate Token Types:**
- Email verification tokens
- Password reset tokens
- Two-factor authentication codes

**Security Features:**
- Expiration timestamps
- Unique constraint on token
- Type-based separation
- Clean up expired tokens regularly

**Cleanup Query:**
```typescript
// Delete expired tokens (run periodically)
await prisma.token.deleteMany({
  where: {
    expires: {
      lt: new Date()
    }
  }
});
```

---

#### 4.2.5 Indexes

**Critical indexes for performance:**
```prisma
@@index([email])      // Fast user lookup
@@index([userId])     // Fast relation queries
@@unique([email])     // Prevent duplicates
```

---

### 4.3 Database Security

**OWASP Recommendations:**

1. **Use Row Level Security (RLS)** if using Supabase/PostgreSQL
2. **Parameterized queries** (Prisma handles this automatically)
3. **Least privilege** database user permissions
4. **Encrypted connections** (SSL/TLS)
5. **Regular backups** with encryption
6. **Audit logging** for sensitive operations

---

## 5. Email Verification Flow

### 5.1 Implementation Pattern

**Authority Level:** OWASP guidelines, Auth.js patterns, industry best practices.

#### Flow Overview

```
1. User registers → 2. Generate token → 3. Send email → 4. User clicks link → 5. Verify token → 6. Mark email verified
```

---

#### Step 1: User Registration (Server Action)

```typescript
// src/app/actions/authActions.ts
'use server';

import { hash } from 'argon2';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email';

export async function registerUser(data: RegisterSchema) {
  // 1. Validate input with Zod
  const validated = registerSchema.parse(data);

  // 2. Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email }
  });

  if (existingUser) {
    return { error: 'Email already registered' };
  }

  // 3. Hash password with Argon2
  const hashedPassword = await hash(validated.password, {
    type: argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
  });

  // 4. Create user
  const user = await prisma.user.create({
    data: {
      email: validated.email,
      password: hashedPassword,
      name: validated.name
      // emailVerified: null (not verified yet)
    }
  });

  // 5. Generate verification token
  const token = await generateVerificationToken(user.email);

  // 6. Send verification email
  await sendVerificationEmail(user.email, token);

  return {
    success: true,
    message: 'Verification email sent. Please check your inbox.'
  };
}
```

---

#### Step 2: Token Generation

```typescript
// src/lib/tokens.ts
import crypto from 'crypto';
import { prisma } from './prisma';

export async function generateVerificationToken(email: string) {
  // Generate cryptographically secure random token
  const token = crypto.randomBytes(32).toString('hex');

  // Token expires in 24 hours (OWASP recommendation)
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Delete any existing tokens for this email
  await prisma.token.deleteMany({
    where: {
      email,
      type: 'VERIFICATION'
    }
  });

  // Create new token
  const verificationToken = await prisma.token.create({
    data: {
      email,
      token,
      type: 'VERIFICATION',
      expires
    }
  });

  return token;
}
```

---

#### Step 3: Send Email

```typescript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'noreply@resumetailor.com',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `
  });
}
```

**Email Service Recommendations (2025):**
- **Resend** (recommended) - Modern, developer-friendly, great DX
- **SendGrid** - Mature, feature-rich, higher complexity
- **AWS SES** - Cost-effective at scale, more setup required

---

#### Step 4: Verification Route

```typescript
// src/app/verify-email/page.tsx
import { verifyEmail } from '@/app/actions/authActions';
import { redirect } from 'next/navigation';

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: { token: string }
}) {
  const token = searchParams.token;

  if (!token) {
    redirect('/login?error=missing-token');
  }

  const result = await verifyEmail(token);

  if (result.success) {
    redirect('/login?verified=true');
  } else {
    redirect('/login?error=invalid-token');
  }
}
```

---

#### Step 5: Token Verification (Server Action)

```typescript
// src/app/actions/authActions.ts
export async function verifyEmail(token: string) {
  // Find token in database
  const verificationToken = await prisma.token.findUnique({
    where: {
      token,
      type: 'VERIFICATION'
    }
  });

  if (!verificationToken) {
    return { error: 'Invalid token' };
  }

  // Check if expired
  if (new Date() > verificationToken.expires) {
    await prisma.token.delete({
      where: { id: verificationToken.id }
    });
    return { error: 'Token expired' };
  }

  // Find user and verify email
  const user = await prisma.user.update({
    where: { email: verificationToken.email },
    data: { emailVerified: new Date() }
  });

  // Delete used token
  await prisma.token.delete({
    where: { id: verificationToken.id }
  });

  return { success: true };
}
```

---

### 5.2 Best Practices

**OWASP Recommendations:**

1. **Token Security:**
   - Use cryptographically secure random generation (crypto.randomBytes)
   - Minimum 32 bytes (256 bits) of entropy
   - Single-use tokens (delete after verification)
   - Short expiration (24 hours max)

2. **Email Security:**
   - Use HTTPS for all verification links
   - Include expiration time in email
   - Clear call-to-action
   - Sender verification (SPF, DKIM, DMARC)

3. **Rate Limiting:**
   - Limit verification email sends per user (e.g., 3 per hour)
   - Prevent token enumeration attacks
   - Implement CAPTCHA for repeated requests

4. **UX Considerations:**
   - Clear success/error messages
   - Resend email option
   - Support for multiple email clients
   - Mobile-friendly verification pages

---

## 6. Protected Routes in Next.js App Router

### 6.1 Critical Security Update (2025)

**CVE-2025-29927 Impact:**
Middleware is NO LONGER considered safe as the sole authentication layer. A critical vulnerability allowed complete bypass of middleware security checks.

**New Best Practice:** Defense-in-depth approach with multiple authentication layers.

---

### 6.2 Multi-Layer Protection Pattern ⭐ RECOMMENDED

**Authority Level:** Next.js security blog post (March 2025), industry best practices.

#### Layer 1: Middleware (User Experience)

**Purpose:** Quick redirects, improve UX (not primary security)

```typescript
// src/middleware.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Public routes
  const publicRoutes = ['/login', '/register', '/verify-email'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
```

---

#### Layer 2: Layout Guards (UI Protection)

**Purpose:** Hide sensitive UI, prevent unauthorized rendering

```typescript
// src/app/dashboard/layout.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <DashboardNav user={session.user} />
      {children}
    </div>
  );
}
```

---

#### Layer 3: Page-Level Protection

**Purpose:** Protect specific routes

```typescript
// src/app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Additional checks
  if (!session.user.emailVerified) {
    redirect('/verify-email');
  }

  return <DashboardContent user={session.user} />;
}
```

---

#### Layer 4: Data Access Layer ⭐ MOST CRITICAL

**Purpose:** Protect data at the source (primary security layer)

```typescript
// src/lib/dal.ts (Data Access Layer)
import { auth } from '@/auth';
import { prisma } from './prisma';
import { cache } from 'react';

// Verify authentication and return user
export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return { userId: session.user.id, user: session.user };
});

// Protected data fetching
export async function getUserResumes() {
  const { userId } = await verifySession();

  return await prisma.resume.findMany({
    where: { userId }
  });
}

export async function getResumeById(resumeId: string) {
  const { userId } = await verifySession();

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId }
  });

  // Authorization check
  if (resume?.userId !== userId) {
    throw new Error('Forbidden');
  }

  return resume;
}
```

---

#### Layer 5: Server Actions Protection

**Purpose:** Protect all mutations

```typescript
// src/app/actions/resumeActions.ts
'use server';

import { verifySession } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createResume(data: CreateResumeInput) {
  // ALWAYS verify auth in server actions
  const { userId } = await verifySession();

  // Validate input with Zod
  const validated = createResumeSchema.parse(data);

  const resume = await prisma.resume.create({
    data: {
      ...validated,
      userId // Ensure user owns the resource
    }
  });

  revalidatePath('/dashboard');
  return { success: true, resume };
}

export async function updateResume(resumeId: string, data: UpdateResumeInput) {
  const { userId } = await verifySession();

  // Verify ownership
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId }
  });

  if (!resume || resume.userId !== userId) {
    throw new Error('Forbidden');
  }

  const validated = updateResumeSchema.parse(data);

  const updated = await prisma.resume.update({
    where: { id: resumeId },
    data: validated
  });

  revalidatePath(`/dashboard/resumes/${resumeId}`);
  return { success: true, resume: updated };
}
```

---

### 6.3 Role-Based Access Control (RBAC)

```typescript
// src/lib/dal.ts
export async function verifyAdmin() {
  const { user } = await verifySession();

  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }

  return { user };
}

// Usage in admin routes
export async function getAllUsers() {
  await verifyAdmin(); // Throws if not admin

  return await prisma.user.findMany();
}
```

---

### 6.4 Defense-in-Depth Checklist

- [ ] Middleware for UX redirects
- [ ] Layout guards for UI protection
- [ ] Page-level auth checks
- [ ] Data Access Layer auth (CRITICAL)
- [ ] Server Action auth (ALL actions)
- [ ] Input validation (Zod schemas)
- [ ] Authorization checks (ownership)
- [ ] Role-based access control

**Remember:** Never rely on middleware alone. Always verify authentication where data is accessed.

---

## 7. Security Best Practices (OWASP)

### 7.1 Multi-Factor Authentication (MFA)

**Authority Level:** OWASP Authentication Cheat Sheet, Microsoft security analysis.

**Impact:** MFA prevents 99.9% of account compromises (Microsoft data).

**Recommended Implementation:**
- **Passkeys (FIDO2)** - Most secure, phishing-resistant, frictionless
- **TOTP (Authenticator apps)** - Widely supported (Google Authenticator, Authy)
- **SMS (Not recommended)** - Vulnerable to SIM swapping, only as fallback

**Modern Approach (2025):**
```typescript
// Using Auth.js with WebAuthn (Passkeys)
import { signIn } from 'next-auth/react';

// Passkey registration
await signIn('webauthn', { action: 'register' });

// Passkey authentication
await signIn('webauthn');
```

**Libraries:**
- `@simplewebauthn/server` - WebAuthn/Passkey implementation
- NextAuth v5 has built-in WebAuthn support

---

### 7.2 Session Management

**OWASP Requirements:**

1. **Session IDs:**
   - Randomly generated (cryptographically secure)
   - Minimum 128 bits of entropy
   - Unique per user
   - Unpredictable

2. **Cookie Configuration:**
```typescript
// NextAuth configuration
export default NextAuth({
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,      // Prevent XSS attacks
        sameSite: 'lax',     // CSRF protection
        path: '/',
        secure: true         // HTTPS only (production)
      }
    }
  }
});
```

3. **Session Lifecycle:**
   - Regenerate session ID on login (prevent session fixation)
   - Clear session on logout
   - Implement absolute timeout (e.g., 30 days)
   - Implement idle timeout (e.g., 2 hours)
   - Provide "logout all devices" functionality

---

### 7.3 Password Requirements (2025 Standards)

**OWASP/NIST Guidelines:**

**Minimum Requirements:**
- Minimum length: 10 characters (NIST SP800-132)
- No maximum length (truncate at reasonable limit like 128)
- No character composition requirements (e.g., "must have 1 uppercase")
- Check against common password lists (Have I Been Pwned API)

**Validation Schema:**
```typescript
// src/lib/schemas/authSchemas.ts
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(128, 'Password must be less than 128 characters');

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});
```

**Enhanced Security (Optional):**
```typescript
// Check against compromised passwords
import axios from 'axios';
import crypto from 'crypto';

async function isPasswordCompromised(password: string): Promise<boolean> {
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
  const hashes = response.data.split('\n');

  return hashes.some((line: string) => line.startsWith(suffix));
}
```

---

### 7.4 CSRF Protection

**Authority Level:** OWASP, Next.js security documentation.

**Built-in Protection:**
Next.js Server Actions have automatic CSRF protection:
- POST method only
- Origin header verification
- Host header comparison

**Configuration:**
```typescript
// next.config.js
module.exports = {
  experimental: {
    // Restrict allowed origins for Server Actions
    allowedOrigins: [
      'yourdomain.com',
      'www.yourdomain.com'
    ]
  }
};
```

**Additional Protection for API Routes:**
```typescript
// Using @edge-csrf/nextjs
import { createCsrfProtect } from '@edge-csrf/nextjs';

const csrfProtect = createCsrfProtect({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function POST(request: Request) {
  const csrfError = await csrfProtect(request);
  if (csrfError) {
    return new Response('Invalid CSRF token', { status: 403 });
  }

  // Handle request...
}
```

**Best Practices:**
- Server Actions: Use built-in protection (default)
- API Routes: Implement CSRF tokens
- External API calls: Use CORS properly
- Cookie settings: SameSite=Lax or Strict

---

### 7.5 Rate Limiting

**Authority Level:** OWASP guidelines, production best practices.

**Why Rate Limiting:**
- Prevent brute force attacks
- Mitigate DDoS
- Protect against credential stuffing
- Reduce API abuse

**Implementation with Upstash Redis:**

```typescript
// src/lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Different limits for different endpoints
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
  analytics: true,
});

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});
```

**Usage in Server Actions:**
```typescript
// src/app/actions/authActions.ts
import { authRateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

export async function loginUser(credentials: LoginCredentials) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') ?? 'unknown';

  // Check rate limit
  const { success, remaining } = await authRateLimit.limit(ip);

  if (!success) {
    return {
      error: 'Too many login attempts. Please try again later.',
      remainingAttempts: remaining
    };
  }

  // Continue with login...
}
```

**Recommended Limits:**

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 attempts | 15 minutes |
| Register | 3 attempts | 1 hour |
| Password Reset | 3 attempts | 1 hour |
| Email Verification | 3 sends | 1 hour |
| API Calls | 100 requests | 1 minute |

**Progressive Delays:**
```typescript
// Increase delay with each failed attempt
const delays = [0, 1000, 2000, 4000, 8000]; // milliseconds

async function loginWithDelay(attempt: number, credentials: LoginCredentials) {
  const delay = delays[Math.min(attempt, delays.length - 1)];
  await new Promise(resolve => setTimeout(resolve, delay));

  return await loginUser(credentials);
}
```

---

### 7.6 Account Lockout

**OWASP Recommendation:**
Implement account lockout after failed login attempts (but carefully to avoid DoS).

```typescript
// src/app/actions/authActions.ts
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export async function loginUser(credentials: LoginCredentials) {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return {
      error: `Account locked. Try again in ${Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)} minutes.`
    };
  }

  // Verify password
  const isValidPassword = await verify(user.password!, credentials.password);

  if (!isValidPassword) {
    // Increment failed attempts
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;

    const updateData: any = {
      failedLoginAttempts: failedAttempts
    };

    // Lock account if max attempts reached
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    return {
      error: 'Invalid credentials',
      attemptsRemaining: MAX_FAILED_ATTEMPTS - failedAttempts
    };
  }

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null
    }
  });

  // Create session...
}
```

**Add to User schema:**
```prisma
model User {
  // ... existing fields
  failedLoginAttempts Int?      @default(0)
  lockedUntil         DateTime?
}
```

---

### 7.7 Secure Headers

**Authority Level:** OWASP Secure Headers Project.

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

### 7.8 Input Validation & Sanitization

**Authority Level:** OWASP Input Validation Cheat Sheet.

**Always validate on server (never trust client):**

```typescript
// src/lib/schemas/authSchemas.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password too long'),

  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .trim()
    .regex(/^[a-zA-Z\s-']+$/, 'Name contains invalid characters')
});

// Usage in server action
export async function registerUser(rawData: unknown) {
  try {
    // Validate and sanitize
    const validated = registerSchema.parse(rawData);

    // Safe to use validated data
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input', details: error.errors };
    }
    throw error;
  }
}
```

**Key Points:**
- Validate ALL inputs (forms, query params, headers)
- Use Zod for type-safe validation
- Sanitize HTML content (use DOMPurify)
- Prevent SQL injection (Prisma handles this)
- Prevent XSS (React escapes by default, careful with dangerouslySetInnerHTML)

---

### 7.9 Environment Variables Security

```bash
# .env.local (NEVER commit to git)

# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email (Resend)
RESEND_API_KEY="re_..."

# Rate Limiting (Upstash)
UPSTASH_REDIS_URL="https://..."
UPSTASH_REDIS_TOKEN="..."

# OAuth (if using)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

**Security Checklist:**
- [ ] Never commit `.env` files to git
- [ ] Use different secrets for dev/staging/production
- [ ] Rotate secrets regularly
- [ ] Use strong, random secrets (32+ bytes)
- [ ] Restrict environment variable access
- [ ] Use secret management (Vercel/AWS Secrets Manager)

**Generate secure secrets:**
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use this one-liner
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 8. Complete Implementation Example

### 8.1 Project Structure

```
resumetailor/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx    # Register page
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx    # Email verification
│   │   │   └── reset-password/
│   │   │       └── page.tsx    # Password reset
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Protected layout
│   │   │   └── page.tsx        # Dashboard
│   │   └── actions/
│   │       └── authActions.ts  # Server actions
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config
│   │   ├── dal.ts              # Data Access Layer
│   │   ├── prisma.ts           # Prisma client
│   │   ├── ratelimit.ts        # Rate limiting
│   │   ├── tokens.ts           # Token generation
│   │   ├── email.ts            # Email sending
│   │   └── schemas/
│   │       └── authSchemas.ts  # Zod schemas
│   ├── components/
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       └── ResetPasswordForm.tsx
│   └── middleware.ts           # Route protection
├── .env.local                  # Environment variables
└── next.config.js              # Next.js config
```

---

### 8.2 Auth.js Configuration

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from './prisma';
import { verify } from 'argon2';
import { loginSchema } from './schemas/authSchemas';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: 'jwt', // Required for middleware
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
  },

  providers: [
    // Credentials provider
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validate input
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        // Find user
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user?.password) return null;

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        // Verify password
        const isValidPassword = await verify(user.password, password);
        if (!isValidPassword) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified
        };
      }
    }),

    // Google OAuth (optional)
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }

      // Update session (from client)
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date;
      }
      return session;
    }
  },

  events: {
    async signIn({ user }) {
      // Log successful sign-in
      console.log(`User ${user.email} signed in`);
    },
    async signOut({ token }) {
      // Cleanup on sign-out
      console.log(`User ${token.email} signed out`);
    }
  },
});
```

---

### 8.3 Type Definitions

```typescript
// src/types/next-auth.d.ts
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      emailVerified: Date;
    } & DefaultSession['user']
  }

  interface User {
    role: string;
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    emailVerified: Date;
  }
}
```

---

### 8.4 Login Form Component

```typescript
// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginSchema } from '@/lib/schemas/authSchemas';
import { Button, Input } from '@nextui-org/react';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...register('email')}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
      />

      <Input
        label="Password"
        type="password"
        {...register('password')}
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
      />

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        color="primary"
        isLoading={isLoading}
        className="w-full"
      >
        Sign In
      </Button>

      <div className="text-center">
        <Button
          variant="light"
          onClick={() => signIn('google')}
        >
          Sign in with Google
        </Button>
      </div>
    </form>
  );
}
```

---

### 8.5 Zod Schemas

```typescript
// src/lib/schemas/authSchemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password too long'),

  confirmPassword: z.string(),

  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .trim()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password too long'),

  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
```

---

## 9. Password Reset Flow

### 9.1 Request Reset

```typescript
// src/app/actions/authActions.ts
export async function requestPasswordReset(email: string) {
  // Rate limiting
  const { success } = await authRateLimit.limit(email);
  if (!success) {
    return { error: 'Too many requests. Please try again later.' };
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // Generate reset token
  const token = await generatePasswordResetToken(email);

  // Send reset email
  await sendPasswordResetEmail(email, token);

  return { success: true };
}
```

### 9.2 Reset Password

```typescript
export async function resetPassword(token: string, newPassword: string) {
  // Find and validate token
  const resetToken = await prisma.token.findUnique({
    where: {
      token,
      type: 'PASSWORD_RESET'
    }
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return { error: 'Invalid or expired reset link' };
  }

  // Hash new password
  const hashedPassword = await hash(newPassword, {
    type: argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
  });

  // Update password
  await prisma.user.update({
    where: { email: resetToken.email },
    data: {
      password: hashedPassword,
      failedLoginAttempts: 0, // Reset lockout
      lockedUntil: null
    }
  });

  // Delete used token
  await prisma.token.delete({
    where: { id: resetToken.id }
  });

  // Invalidate all sessions (force re-login)
  await prisma.session.deleteMany({
    where: {
      user: { email: resetToken.email }
    }
  });

  return { success: true };
}
```

---

## 10. Testing Checklist

### 10.1 Security Testing

- [ ] Test SQL injection attempts (Prisma should prevent)
- [ ] Test XSS attacks (React should escape)
- [ ] Test CSRF attacks (Server Actions protected)
- [ ] Test rate limiting (hit limits, verify blocks)
- [ ] Test account lockout (max failed attempts)
- [ ] Test session management (logout, expiration)
- [ ] Test email verification bypass attempts
- [ ] Test password reset token reuse
- [ ] Test authorization (access other users' data)
- [ ] Test role-based access control

### 10.2 Functionality Testing

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] OAuth login (Google)
- [ ] Logout
- [ ] Session persistence
- [ ] Protected route access
- [ ] Form validation (client & server)

### 10.3 Edge Cases

- [ ] Expired tokens
- [ ] Multiple verification emails
- [ ] Concurrent login attempts
- [ ] Special characters in passwords
- [ ] Very long inputs
- [ ] Empty/null inputs
- [ ] Network errors during auth
- [ ] Database connection failures

---

## 11. Deployment Checklist

### 11.1 Pre-Deployment

- [ ] Update to Next.js 15.2.3+ (CVE-2025-29927 patch)
- [ ] All environment variables set in production
- [ ] NEXTAUTH_URL set to production URL
- [ ] Generate new NEXTAUTH_SECRET for production
- [ ] Database migrations applied
- [ ] SSL/TLS certificates configured
- [ ] Security headers configured
- [ ] CORS settings configured
- [ ] Rate limiting enabled
- [ ] Error logging configured (Sentry, etc.)

### 11.2 Post-Deployment

- [ ] Test all auth flows in production
- [ ] Verify email delivery works
- [ ] Check security headers (securityheaders.com)
- [ ] Monitor error rates
- [ ] Test OAuth callbacks
- [ ] Verify HTTPS redirects
- [ ] Check session cookie settings
- [ ] Test mobile responsiveness
- [ ] Monitor rate limiting metrics
- [ ] Set up uptime monitoring

---

## 12. Recommended NPM Packages

### 12.1 Core Authentication

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.25",
    "@auth/prisma-adapter": "^2.7.4",
    "@prisma/client": "^6.1.0",
    "argon2": "^0.41.1",
    "zod": "^3.24.1"
  }
}
```

### 12.2 Email & Communication

```json
{
  "dependencies": {
    "resend": "^4.0.3"
  }
}
```

### 12.3 Rate Limiting

```json
{
  "dependencies": {
    "@upstash/ratelimit": "^2.0.4",
    "@upstash/redis": "^1.34.3"
  }
}
```

### 12.4 Forms & Validation

```json
{
  "dependencies": {
    "react-hook-form": "^7.54.2",
    "@hookform/resolvers": "^3.9.1"
  }
}
```

### 12.5 CSRF Protection (Optional)

```json
{
  "dependencies": {
    "@edge-csrf/nextjs": "^2.0.1"
  }
}
```

---

## 13. Additional Resources

### 13.1 Official Documentation

- **Next.js Authentication Guide:** https://nextjs.org/docs/app/guides/authentication
- **Auth.js (NextAuth v5):** https://authjs.dev/
- **Prisma Best Practices:** https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide
- **OWASP Cheat Sheets:** https://cheatsheetseries.owasp.org/

### 13.2 Security Resources

- **OWASP Authentication Cheat Sheet:** https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- **OWASP Session Management:** https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- **NIST Password Guidelines:** https://pages.nist.gov/800-63-3/sp800-63b.html
- **Have I Been Pwned API:** https://haveibeenpwned.com/API/v3

### 13.3 Tools

- **Security Headers Checker:** https://securityheaders.com/
- **SSL/TLS Checker:** https://www.ssllabs.com/ssltest/
- **Password Strength Checker:** https://haveibeenpwned.com/Passwords

---

## 14. Quick Start Guide

### For Resume Tailor Implementation:

1. **Install Dependencies:**
```bash
npm install next-auth@beta @auth/prisma-adapter argon2 resend @upstash/ratelimit @upstash/redis zod react-hook-form @hookform/resolvers
```

2. **Update Next.js to 15.2.3+:**
```bash
npm install next@latest
```

3. **Set Up Prisma Schema:**
- Copy schema from Section 4.1
- Run `npx prisma generate`
- Run `npx prisma migrate dev --name init-auth`

4. **Configure Auth.js:**
- Copy auth.ts from Section 8.2
- Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- Add environment variables

5. **Create Data Access Layer:**
- Implement dal.ts from Section 6.2.4
- Use `verifySession()` in all protected routes

6. **Implement Forms:**
- Copy schemas from Section 8.5
- Create LoginForm from Section 8.4
- Create RegisterForm (similar pattern)

7. **Set Up Email:**
- Sign up for Resend
- Implement email.ts from Section 5.1.3
- Configure verification flow

8. **Add Rate Limiting:**
- Sign up for Upstash
- Implement ratelimit.ts from Section 7.5
- Apply to auth endpoints

9. **Test Everything:**
- Use testing checklist from Section 10
- Fix any issues

10. **Deploy Securely:**
- Follow deployment checklist from Section 11
- Monitor for issues

---

## 15. Key Takeaways

1. **Multi-Layer Security is Essential:** Never rely on middleware alone after CVE-2025-29927
2. **NextAuth v5 is Recommended:** Best balance of control and features for most projects
3. **Use Argon2 for New Projects:** Modern, secure password hashing
4. **Data Access Layer is Critical:** Authentication checks must happen where data is accessed
5. **Rate Limiting is Not Optional:** Protect against brute force attacks
6. **Email Verification Required:** Prevent fake accounts and verify ownership
7. **OWASP Guidelines are Gold Standard:** Follow established security patterns
8. **Defense in Depth:** Multiple security layers protect better than one
9. **Never Trust Client Input:** Always validate on server
10. **Security is Ongoing:** Regular updates, monitoring, and testing required

---

**Research Compiled:** October 30, 2025
**Next Review:** Check for updates in 6 months (April 2026)

**Critical Security Note:** Always check for latest security advisories and update dependencies regularly. Security is not a one-time implementation but an ongoing process.
