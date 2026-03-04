────────────────────────────────────────────────────────────
🔮 AESTHETIC DIRECTION — NEO-GLASS TECH
────────────────────────────────────────────────────────────
A futuristic, premium UI with:
• Glassmorphism (blurred translucent cards)
• Cyan → Purple gradient accents
• Floating layered components
• Soft shadows + depth
• Minimal geometric typography
• Framer-motion stagger animations
• Dark futuristic background (#0A0F1F)

Avoid generic UI. Use premium, distinct styling.

────────────────────────────────────────────────────────────
🔤 TYPOGRAPHY
────────────────────────────────────────────────────────────
Display Font (Headings): 
  • "Satoshi Variable" or "Monument Extended"
Body Font:
  • "General Sans" or "Manrope Variable"

Rules:
  • Headings use geometric sans (bold, tight spacing)
  • Body uses soft sans with 300–500 weights
  • No Inter / No Arial / No Roboto

────────────────────────────────────────────────────────────
🎨 COLOR SYSTEM (Tailwind CSS Variables)
────────────────────────────────────────────────────────────
:root {
  --primary-start: #00E0FF;
  --primary-end: #7C3AED;

  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.15);

  --bg: #0A0F1F;
  --bg-secondary: #111726;

  --text-main: rgba(255,255,255,0.90);
  --text-dim: rgba(255,255,255,0.60);
}

Accent Colors:
• Cyan #00E0FF
• Electric Purple #8A2BE2
• Neon Blue #3B82F6

────────────────────────────────────────────────────────────
🧩 CORE UI COMPONENTS (Reusable)
────────────────────────────────────────────────────────────
1. GlassCard
   • bg: var(--glass-bg)
   • border: 1px solid var(--glass-border)
   • backdrop-blur: 20px
   • shadow: 0 8px 30px rgba(0,0,0,0.3)
   • animation: fade-up + slight lift on hover

2. GradientButton
   • bg-gradient: from-[#00E0FF] to-[#7C3AED]
   • rounded-full
   • hover glow: shadow-[0_0_30px_rgba(124,58,237,0.5)]

3. NeonInput
   • glass background
   • cyan glow on focus
   • Lucide icon inside input

4. JobCard
   • glass card with hover lift
   • neon badge (Internship / Training / Job)
   • gradient bottom border
   • floating company logo circle

5. DashboardStat
   • glass mini card
   • animated counter
   • neon icon container

────────────────────────────────────────────────────────────
🏠 LANDING PAGE — app/page.tsx
────────────────────────────────────────────────────────────
Hero Section:
• Large gradient headline
• Subtitle in 60% white
• Glass search bar with icon
• Background: animated gradient mesh + noise texture
• Staggered floating glass cards

Sections:
1. Featured Categories (3 glowing glass cards)
2. Latest Jobs (glass job cards grid)
3. Why Choose Us (icons in glass boxes)
4. Final CTA with gradient button

────────────────────────────────────────────────────────────
💼 JOBS LISTING PAGE
────────────────────────────────────────────────────────────
Filters Sidebar (Glass):
• job type
• location
• category (job/internship/training)
• experience level

Job Cards:
• 2–3 columns
• each job card = glass + neon badge + lift on hover
• gradient apply button

────────────────────────────────────────────────────────────
🎓 INTERNSHIP & TRAINING PAGES
────────────────────────────────────────────────────────────
Same layout as Jobs page but:
• dedicated filters
• dedicated category color
• dedicated header glass banner

────────────────────────────────────────────────────────────
📄 JOB DETAILS PAGE — /jobs/[id]
────────────────────────────────────────────────────────────
• Large glass header
• Left floating glass company profile card
• Description in readable glass container
• Sticky apply bar at bottom
• Related jobs as horizontal glass carousel

────────────────────────────────────────────────────────────
👤 USER PROFILE PAGE — /profile
────────────────────────────────────────────────────────────
Fields:
• Name
• Phone
• Email (Clerk autofill)
• LinkedIn (optional)
• GitHub (optional)
• Resume upload (UploadThing)

Design:
• Vertical glass form
• Neon focus rings
• Avatar glow ring
• Save button = gradient

────────────────────────────────────────────────────────────
🏢 COMPANY ENQUIRY FORM — /enquiry
────────────────────────────────────────────────────────────
Fields:
• Company Name
• Email
• Phone
• Company URL (optional)
• Company Size
• GST Number (optional)

Design:
• Big glass panel form
• After submit → glass modal success animation

────────────────────────────────────────────────────────────
📊 ADMIN PANEL — /admin
────────────────────────────────────────────────────────────
Sections:
1. Dashboard  
   • Stats cards (Jobs | Applications | Pending Companies)  
   • Gradient mesh background  
2. Companies  
   • Company enquiry approvals table  
   • Approve / Reject buttons  
3. Jobs  
   • Job list  
   • NEW job button (gradient)  
   • Edit/Delete glass buttons  
4. Applications  
   • Applicant list  
   • Resume link  
   • Status dropdown (pending/shortlisted/interview/selected/rejected)

Tables:
• Glass table rows
• Gradient borders
• Neon hover states

────────────────────────────────────────────────────────────
⚙️ MOTION GUIDELINES (Framer-Motion)
────────────────────────────────────────────────────────────
Page load:
• fade-in + y:-20
• cards: stagger 0.08s
• hero text: slide from opacity-0 → 1

Hover interactions:
• scale: 1.03
• shadow glow intensifies

Buttons:
• subtle ripple effect
• glow fade

Background:
• slow-moving gradient mesh blobs (CSS keyframes)

────────────────────────────────────────────────────────────
📁 FOLDER STRUCTURE (APP ROUTER)
────────────────────────────────────────────────────────────
app/
 ├─ (site)/
 │   ├─ page.tsx
 │   ├─ jobs/
 │   ├─ internships/
 │   ├─ training/
 │   ├─ jobs/[id]/
 │   ├─ enquiry/
 │   ├─ profile/
 │   └─ applications/
 ├─ admin/
 │   ├─ page.tsx
 │   ├─ dashboard/
 │   ├─ companies/
 │   ├─ jobs/
 │   │   ├─ new/
 │   │   └─ [id]/edit/
 │   └─ applications/
 └─ components/
     ├─ ui/
     │   ├─ GlassCard.tsx
     │   ├─ GradientButton.tsx
     │   ├─ NeonInput.tsx
     │   ├─ JobCard.tsx
     │   ├─ DashboardStat.tsx
     │   └─ SidebarFilter.tsx

────────────────────────────────────────────────────────────
🧩 UI COMPONENT LIST (FOR IMPLEMENTATION)
────────────────────────────────────────────────────────────
• GlassCard
• GradientButton
• NeonInput
• JobCard
• DashboardStat
• SidebarFilter
• ProfileForm
• EnquiryForm
• AdminTables
• CompanyApprovalCard
• StickyApplyBar
• GlassModal
• GradientHeader
• GlassSearchBar
────────────────────────────────────────────────────────────
