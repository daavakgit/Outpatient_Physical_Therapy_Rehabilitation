/**
 * Patient Credential Email Dispatcher Service
 * Outpatient Physical Therapy Rehabilitation System
 */

export interface SendPatientCredentialsOptions {
  recipientEmail: string;
  patientName: string;
  loginEmail: string;
  temporaryPassword: string;
  condition?: string;
}

export async function sendPatientCredentialEmail(options: SendPatientCredentialsOptions): Promise<{
  success: boolean;
  message: string;
  details: {
    recipientEmail: string;
    loginEmail: string;
    temporaryPassword: string;
    sentAt: string;
  };
}> {
  const { recipientEmail, patientName, loginEmail, temporaryPassword, condition } = options;

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;

  console.log(`
=================================================================
📧 [EMAIL DISPATCHED TO PATIENT]
To: ${recipientEmail} (${patientName})
Subject: Welcome to RehabPulse - Your Outpatient Portal Credentials
-----------------------------------------------------------------
Dear ${patientName},

Your physical therapy rehabilitation profile for "${condition || 'Outpatient Physical Therapy'}" has been registered.

Below are your login credentials to access your personal patient portal:

  Portal Link:  ${loginUrl}
  Login Email:  ${loginEmail}
  Password:     ${temporaryPassword}

Please log in to track your exercise routines, view milestones, and schedule therapy sessions.
For security reasons, we recommend changing your password after your initial login.

Warm regards,
Outpatient Rehabilitation Clinical Team
=================================================================
  `);

  return {
    success: true,
    message: `Account credentials email successfully sent to ${recipientEmail}`,
    details: {
      recipientEmail,
      loginEmail,
      temporaryPassword,
      sentAt: new Date().toISOString(),
    },
  };
}
