# Survey System Implementation

## Current Implementation

### Database Structure

#### sent_surveys
- `id`: UUID PRIMARY KEY
- `project_id`: UUID
- `template_id`: UUID
- `candidate_id`: UUID
- `unique_token`: UUID (for public URLs)
- `email_sent_at`: TIMESTAMP
- `email_status`: TEXT
- `survey_status`: TEXT
- `last_accessed_at`: TIMESTAMP
- `completed_at`: TIMESTAMP

### Route Structure

```
app/
├── (app)/                       # Authenticated routes
│   └── survey/                  # Survey management
├── (survey)/                    # Public survey routes
│   └── s/[token]/              # Public survey pages
└── api/surveys/
    ├── generate-link/          # Generate public links
    └── public/[token]/         # Public survey endpoints
```

### API Endpoints

1. **Generate Link** `POST /api/surveys/generate-link`
   ```typescript
   Request: { survey_id: string, candidate_id: string }
   Response: { url: string, token: string }
   ```

2. **Get Survey** `GET /api/surveys/public/:token`
   ```typescript
   Response: {
     status: "active" | "completed";
     survey?: {
       id: string;
       questions: Array<{
         id: string;
         type: string;
         question: string;
       }>;
     };
   }
   ```

3. **Submit Survey** `POST /api/surveys/public/:token/submit`
   ```typescript
   Request: { responses: { [questionId: string]: string } }
   Response: { message: string, response: object }
   ```

## Implementation Plan

### 1. Survey Generation Flow
- ✅ Select survey template
- ✅ Choose candidates
- ✅ Create sent_survey entries
- ✅ Generate unique public links
- ✅ Send emails with survey links

### 2. Link Generation System
- ✅ Create unique tokens
- ✅ Store tokens in sent_surveys
- ✅ Generate public URLs
- 🔄 Implement rate limiting
- 🔄 Add link expiration

### 3. Email Integration
- ✅ Setup Resend API
- ✅ Create email templates
- ✅ Track delivery status
- ✅ Enable resending capability

### 4. UI Components
- ✅ Survey management page
- ✅ Survey templates list
- ✅ Send survey dialog
- 🔄 Link preview
- 🔄 Copy link button
- 🔄 Email status tracking

### 5. Status Tracking
- ✅ Survey completion status
- ✅ Email delivery status
- 🔄 Link access tracking
- 🔄 Response analytics

## Security Measures

1. **Access Control**
   - ✅ Token validation
   - ✅ One-time submission
   - 🔄 Rate limiting
   - 🔄 Link expiration

2. **Data Protection**
   - ✅ RLS policies
   - ✅ Response validation
   - 🔄 Data encryption
   - 🔄 Audit logging

## Next Steps

1. **UI Updates**
   - Add link preview to SendSurveyDialog
   - Implement copy functionality
   - Show email status
   - Add resend button

2. **Monitoring**
   - Track email delivery
   - Monitor link access
   - Record completion rates
   - Generate analytics

## Email Implementation Details

### Components and Services

1. **Email Service** (`lib/email.ts`)
   - Resend API integration
   - Type-safe email sending function
   - Error handling and logging
   - Status tracking

2. **Email Template** (`components/emails/SurveyEmailTemplate.tsx`)
   - React Email components
   - Responsive design
   - Customizable content
   - Clear call-to-action

3. **Link Generation** (`api/surveys/generate-link/route.ts`)
   - Automatic email sending
   - Status tracking in database
   - Error handling
   - Retry capability

### Email Flow

1. **Survey Creation**
   - User selects template and candidates
   - System generates unique tokens
   - Creates survey entries

2. **Email Sending**
   - Fetches recipient details
   - Generates personalized URL
   - Sends email via Resend
   - Updates email status

3. **Status Tracking**
   - Records email sent timestamp
   - Tracks delivery status
   - Updates on failures
   - Enables manual resending

### Environment Setup

Required environment variables:
```
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=your_app_url
```

Legend:
- ✅ Implemented
- 🔄 In Progress/Planned
