// --- Types --------------------------------------------------------------------

export interface TemplateParams {
  name?: string;
  jobTitle?: string;
  companyName?: string;
  dashboardLink?: string;
  interviewDate?: string;
}

// --- Shared Layout Helpers ----------------------------------------------------

const BASE_URL = "https://jobjockey.in";

function layoutWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JobJockey</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f4f5;
      color: #18181b;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: #0f0f0f;
      padding: 28px 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .header h1 span {
      color: #ffffff;
    }
    .body {
      padding: 40px;
    }
    .body h2 {
      font-size: 20px;
      font-weight: 600;
      color: #0f0f0f;
      margin-bottom: 16px;
    }
    .body p {
      font-size: 15px;
      line-height: 1.7;
      color: #52525b;
      margin-bottom: 12px;
    }
    .body p strong {
      color: #18181b;
    }
    .divider {
      border: none;
      border-top: 1px solid #e4e4e7;
      margin: 28px 0;
    }
    .btn {
      display: inline-block;
      background: #0f0f0f;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 8px;
    }
    .badge {
      display: inline-block;
      background: #f4f4f5;
      color: #3f3f46;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer {
      background: #fafafa;
      border-top: 1px solid #e4e4e7;
      padding: 24px 40px;
      text-align: center;
    }
    .footer p {
      font-size: 13px;
      color: #a1a1aa;
      margin-bottom: 4px;
    }
    .footer a {
      color: #71717a;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Job<span>Jockey</span></h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>JobJockey Team</p>
      <p><a href="${BASE_URL}">${BASE_URL}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// --- 1. Application Received (to candidate) ----------------------------------

export function applicationReceivedTemplate(params: TemplateParams): string {
  const { name = "there", jobTitle = "this position", companyName = "the company" } = params;
  return layoutWrapper(`
    <span class="badge">Application Received</span>
    <h2>Hi ${name},</h2>
    <p>Great news - your application has been successfully submitted!</p>
    <p>
      You applied for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
    </p>
    <p>
      Our team will review your profile and get back to you if you move forward in the
      selection process. Keep an eye on your dashboard for updates.
    </p>
    <hr class="divider" />
    <a href="${BASE_URL}/applications" class="btn">View My Applications</a>
  `);
}

// --- 2. Shortlisted ----------------------------------------------------------

export function shortlistedTemplate(params: TemplateParams): string {
  const { name = "there", jobTitle = "the position", companyName = "the company", dashboardLink = `${BASE_URL}/applications` } = params;
  return layoutWrapper(`
    <span class="badge" style="background:#dcfce7; color:#16a34a;">Shortlisted 🎉</span>
    <h2>Congratulations, ${name}!</h2>
    <p>
      You have been <strong>shortlisted</strong> for <strong>${jobTitle}</strong> at
      <strong>${companyName}</strong>.
    </p>
    <p>
      This means your profile stood out from the pool of applicants. The hiring team
      will reach out to you shortly with the next steps.
    </p>
    <p>Stay tuned and keep your profile up to date!</p>
    <hr class="divider" />
    <a href="${dashboardLink}" class="btn">View Application Status</a>
  `);
}

// --- 3. Rejected -------------------------------------------------------------

export function rejectedTemplate(params: TemplateParams): string {
  const { name = "there", jobTitle = "the position", companyName = "the company" } = params;
  return layoutWrapper(`
    <span class="badge" style="background:#fee2e2; color:#dc2626;">Application Update</span>
    <h2>Hi ${name},</h2>
    <p>Thank you for your interest in <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
    <p>
      After careful consideration, we regret to inform you that your application has not
      moved forward at this time. This is often due to the highly competitive nature of
      applications, and it does not reflect on your overall potential.
    </p>
    <p>
      We encourage you to explore other opportunities on JobJockey and keep your profile
      updated for future openings.
    </p>
    <hr class="divider" />
    <a href="${BASE_URL}/jobs" class="btn">Browse More Jobs</a>
  `);
}

// --- 4. Company Approval (to company) ----------------------------------------

export function companyApprovalTemplate(params: TemplateParams): string {
  const { name = "there", companyName = "your company", dashboardLink = `${BASE_URL}/business/dashboard` } = params;
  return layoutWrapper(`
    <span class="badge" style="background:#dcfce7; color:#16a34a;">Company Approved ✅</span>
    <h2>Welcome aboard, ${name}!</h2>
    <p>
      We are thrilled to inform you that <strong>${companyName}</strong> has been
      <strong>approved</strong> on JobJockey.
    </p>
    <p>
      You can now post jobs and internships, manage applicants, and connect with top
      talent directly from your employer dashboard.
    </p>
    <hr class="divider" />
    <a href="${dashboardLink}" class="btn">Go to Dashboard</a>
  `);
}

// --- 5. New Applicant Notification (to company/admin) ------------------------

export function newApplicantTemplate(params: TemplateParams): string {
  const { jobTitle = "your position", companyName = "your company", dashboardLink = `${BASE_URL}/business/dashboard` } = params;
  return layoutWrapper(`
    <span class="badge">New Applicant</span>
    <h2>A new candidate has applied!</h2>
    <p>
      Someone just submitted an application for <strong>${jobTitle}</strong>
      ${companyName ? `at <strong>${companyName}</strong>` : ""}.
    </p>
    <p>
      Log in to your dashboard to review their profile, resume, and decide on next steps.
    </p>
    <hr class="divider" />
    <a href="${dashboardLink}" class="btn">Review Applicant</a>
  `);
}

// --- 6. Interview Invitation --------------------------------------------------

export function interviewInviteTemplate(params: TemplateParams): string {
  const {
    name = "there",
    jobTitle = "the position",
    companyName = "the company",
    interviewDate = "a date to be confirmed shortly",
    dashboardLink = `${BASE_URL}/applications`,
  } = params;
  return layoutWrapper(`
    <span class="badge" style="background:#ede9fe; color:#7c3aed;">Interview Invitation 🗓️</span>
    <h2>Hi ${name},</h2>
    <p>
      Exciting news! You have been invited for an <strong>interview</strong> for the role
      of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
    </p>
    <p>
      <strong>Interview Date/Details:</strong> ${interviewDate}
    </p>
    <p>
      The hiring team will reach out with further details regarding the interview format,
      time, and joining link/venue. Please ensure your contact details are up to date on
      your profile.
    </p>
    <hr class="divider" />
    <a href="${dashboardLink}" class="btn">View Application</a>
  `);
}

// --- 7. Job Posted Successfully (to company) ---------------------------------

export function jobPostedTemplate(params: TemplateParams): string {
  const { jobTitle = "your position", companyName = "your company", dashboardLink = `${BASE_URL}/business/dashboard` } = params;
  return layoutWrapper(`
    <span class="badge" style="background:#dbeafe; color:#1d4ed8;">Job Live 🚀</span>
    <h2>Your job is now live!</h2>
    <p>
      <strong>${jobTitle}</strong> has been successfully posted on JobJockey
      ${companyName ? `for <strong>${companyName}</strong>` : ""}.
    </p>
    <p>
      Candidates can now discover and apply for this role. You'll receive notifications
      whenever a new applicant submits their application.
    </p>
    <hr class="divider" />
    <a href="${dashboardLink}" class="btn">Manage Job Posts</a>
  `);
}
