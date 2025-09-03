import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { UserRole } from '@schoola/types/src';

/**
 * Email Message Interface
 */
export interface EmailMessage {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }>;
}

/**
 * Email Template Context
 */
export interface EmailTemplateContext {
  recipientName: string;
  recipientEmail: string;
  senderName?: string;
  companyName: string;
  companyLogo?: string;
  baseUrl: string;
  supportEmail: string;
  [key: string]: any;
}

/**
 * Email Configuration Interface
 */
export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: {
    name: string;
    address: string;
  };
  replyTo?: string;
  baseUrl: string;
  supportEmail: string;
  companyName: string;
}

/**
 * Email Send Result
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  recipients: string[];
}

/**
 * Enhanced Email Service Class
 * Provides comprehensive email functionality with templates, error handling,
 * and integration with the RBAC system
 */
class EmailServiceClass {
  private transporter: Transporter;
  private config: EmailConfig;
  private isConnected: boolean = false;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport(config.smtp);
    this.initializeTransporter();
  }

  /**
   * Initialize and verify email transporter connection
   */
  private async initializeTransporter(): Promise<void> {
    try {
      await this.transporter.verify();
      this.isConnected = true;
      console.log('✅ Email service connected successfully');
    } catch (error) {
      this.isConnected = false;
      console.error('❌ Email service connection failed:', error);
      console.warn('Email notifications will be disabled until connection is restored');
    }
  }

  /**
   * Check if email service is available
   */
  public isEmailServiceAvailable(): boolean {
    return this.isConnected;
  }

  /**
   * Send a single email
   */
  public async sendEmail(message: EmailMessage): Promise<EmailSendResult> {
    try {
      if (!this.isConnected) {
        throw new Error('Email service is not available');
      }

      // Normalize recipients to array
      const recipients = Array.isArray(message.to) ? message.to : [message.to];

      const mailOptions: SendMailOptions = {
        from: message.from || `${this.config.from.name} <${this.config.from.address}>`,
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        replyTo: this.config.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
        attachments: message.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log(`📧 Email sent successfully to ${recipients.join(', ')} - Message ID: ${result.messageId}`);

      return {
        success: true,
        messageId: result.messageId,
        recipients,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown email error';
      console.error('❌ Email send failed:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        recipients: Array.isArray(message.to) ? message.to : [message.to],
      };
    }
  }

  /**
   * Send bulk emails
   */
  public async sendBulkEmails(messages: EmailMessage[]): Promise<EmailSendResult[]> {
    const results: EmailSendResult[] = [];

    for (const message of messages) {
      const result = await this.sendEmail(message);
      results.push(result);

      // Add small delay between emails to prevent rate limiting
      if (messages.length > 5) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    console.log(`📊 Bulk email completed: ${successCount}/${totalCount} sent successfully`);

    return results;
  }

  /**
   * Generate base email template context
   */
  private getBaseTemplateContext(recipientName: string, recipientEmail: string): EmailTemplateContext {
    return {
      recipientName,
      recipientEmail,
      companyName: this.config.companyName,
      baseUrl: this.config.baseUrl,
      supportEmail: this.config.supportEmail,
      currentYear: new Date().getFullYear(),
      senderName: this.config.from.name,
    };
  }

  /**
   * Generate HTML email template wrapper
   */
  private generateEmailTemplate(content: string, context: EmailTemplateContext): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${context.companyName}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
        .button:hover { transform: translateY(-2px); }
        .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #eee; }
        .footer a { color: #667eea; text-decoration: none; }
        .alert { padding: 15px; margin: 20px 0; border-radius: 6px; }
        .alert-info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
        .alert-warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .alert-success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .highlight { background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%); padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${context.companyName}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© ${context['currentYear']} ${context.companyName}. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:${context.supportEmail}">${context.supportEmail}</a></p>
            <p><small>This email was sent to ${context.recipientEmail}</small></p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Authentication & Account Management Emails
   */

  /**
   * Send welcome email after successful registration
   */
  public async sendWelcomeEmail(
    recipientEmail: string,
    recipientName: string,
    userRole: UserRole,
    verificationToken?: string,
  ): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientEmail);
    const roleDisplayName = this.getRoleDisplayName(userRole);

    const verificationLink = verificationToken ? `${context.baseUrl}/verify-email?token=${verificationToken}` : null;

    const content = `
      <h2>Welcome to ${context.companyName}! 🎉</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>Welcome to our learning platform! Your account has been created successfully with <span class="highlight">${roleDisplayName}</span> privileges.</p>

      ${
        verificationLink
          ? `
      <div class="alert alert-info">
        <p><strong>Important:</strong> Please verify your email address to activate your account.</p>
      </div>
      <p style="text-align: center;">
        <a href="${verificationLink}" class="button">Verify Email Address</a>
      </p>
      `
          : `
      <div class="alert alert-success">
        <p>Your account is ready to use! You can now log in and start exploring.</p>
      </div>
      <p style="text-align: center;">
        <a href="${context.baseUrl}/login" class="button">Login to Your Account</a>
      </p>
      `
      }

      <h3>What's Next?</h3>
      <ul>
        <li>Complete your profile setup</li>
        <li>Explore available courses and resources</li>
        <li>Join your first class or create content</li>
      </ul>

      <p>If you have any questions, our support team is here to help!</p>
      <p>Best regards,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: `Welcome to ${context.companyName}! 🚀`,
      html,
      text: `Welcome to ${context.companyName}! Your ${roleDisplayName} account has been created successfully. ${verificationLink ? `Please verify your email: ${verificationLink}` : `You can now login at: ${context.baseUrl}/login`}`,
    });
  }

  /**
   * Send email verification
   */
  public async sendEmailVerification(
    recipientEmail: string,
    recipientName: string,
    verificationToken: string,
  ): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientEmail);
    const verificationLink = `${context.baseUrl}/verify-email?token=${verificationToken}`;

    const content = `
      <h2>Verify Your Email Address 📧</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>Please verify your email address to complete your account setup and ensure you receive important notifications.</p>

      <div class="alert alert-info">
        <p><strong>This verification link will expire in 24 hours.</strong></p>
      </div>

      <p style="text-align: center;">
        <a href="${verificationLink}" class="button">Verify Email Address</a>
      </p>

      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">${verificationLink}</p>

      <p><strong>Didn't request this?</strong> If you didn't create an account, you can safely ignore this email.</p>

      <p>Thanks,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: 'Verify Your Email Address',
      html,
      text: `Please verify your email address by clicking this link: ${verificationLink}. This link will expire in 24 hours.`,
    });
  }

  /**
   * Send password reset email
   */
  public async sendPasswordResetEmail(
    recipientEmail: string,
    recipientName: string,
    resetToken: string,
  ): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientEmail);
    const resetLink = `${context.baseUrl}/reset-password?token=${resetToken}`;

    const content = `
      <h2>Reset Your Password 🔒</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>We received a request to reset your password for your ${context.companyName} account.</p>

      <div class="alert alert-warning">
        <p><strong>This reset link will expire in 1 hour.</strong></p>
      </div>

      <p style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>

      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">${resetLink}</p>

      <div class="alert alert-info">
        <p><strong>Security Tip:</strong> If you didn't request this password reset, please ignore this email and consider changing your password if you suspect unauthorized access.</p>
      </div>

      <p>Best regards,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: 'Password Reset Request',
      html,
      text: `Reset your password by clicking this link: ${resetLink}. This link will expire in 1 hour. If you didn't request this, please ignore this email.`,
    });
  }

  /**
   * Send password change confirmation
   */
  public async sendPasswordChangeConfirmation(recipientEmail: string, recipientName: string): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientName);
    const timestamp = new Date().toLocaleString();

    const content = `
      <h2>Password Changed Successfully ✅</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>Your password has been changed successfully on <strong>${timestamp}</strong>.</p>

      <div class="alert alert-success">
        <p>Your account is secure and the password change was completed.</p>
      </div>

      <div class="alert alert-warning">
        <p><strong>Didn't change your password?</strong> If this wasn't you, please contact our support team immediately at ${context.supportEmail}</p>
      </div>

      <p style="text-align: center;">
        <a href="${context.baseUrl}/login" class="button">Login with New Password</a>
      </p>

      <p>For your security, we recommend:</p>
      <ul>
        <li>Using a strong, unique password</li>
        <li>Enabling two-factor authentication if available</li>
        <li>Regularly reviewing your account activity</li>
      </ul>

      <p>Best regards,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: 'Password Changed Successfully',
      html,
      text: `Your password has been changed successfully on ${timestamp}. If this wasn't you, please contact support immediately.`,
    });
  }

  /**
   * Course & Educational Emails
   */

  /**
   * Send course enrollment confirmation
   */
  public async sendCourseEnrollmentEmail(
    recipientEmail: string,
    recipientName: string,
    courseName: string,
    courseDetails: {
      startDate?: string;
      instructor?: string;
      duration?: string;
      location?: string;
    },
  ): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientEmail);

    const content = `
      <h2>Course Enrollment Confirmed! 🎓</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>Congratulations! You have been successfully enrolled in <span class="highlight">${courseName}</span>.</p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Course Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Course:</strong> ${courseName}</li>
          ${courseDetails.instructor ? `<li><strong>Instructor:</strong> ${courseDetails.instructor}</li>` : ''}
          ${courseDetails.startDate ? `<li><strong>Start Date:</strong> ${courseDetails.startDate}</li>` : ''}
          ${courseDetails.duration ? `<li><strong>Duration:</strong> ${courseDetails.duration}</li>` : ''}
          ${courseDetails.location ? `<li><strong>Location:</strong> ${courseDetails.location}</li>` : ''}
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${context.baseUrl}/courses" class="button">View Course Materials</a>
      </p>

      <div class="alert alert-info">
        <p><strong>What's Next?</strong></p>
        <ul>
          <li>Access course materials and syllabus</li>
          <li>Join the course discussion forum</li>
          <li>Mark your calendar for important dates</li>
        </ul>
      </div>

      <p>We're excited to have you in this course!</p>
      <p>Best regards,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: `Enrolled in ${courseName} - Welcome! 🎓`,
      html,
      text: `You have been enrolled in ${courseName}. ${courseDetails.startDate ? `Start date: ${courseDetails.startDate}. ` : ''}Access your course materials at: ${context.baseUrl}/courses`,
    });
  }

  /**
   * Send assignment deadline reminder
   */
  public async sendAssignmentReminderEmail(
    recipientEmail: string,
    recipientName: string,
    assignmentName: string,
    courseName: string,
    dueDate: string,
    daysUntilDue: number,
  ): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientEmail);
    const urgencyLevel = daysUntilDue <= 1 ? 'urgent' : daysUntilDue <= 3 ? 'important' : 'normal';

    const content = `
      <h2>Assignment Reminder ${urgencyLevel === 'urgent' ? '⚠️' : '📝'}</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>This is a ${urgencyLevel} reminder about an upcoming assignment deadline.</p>

      <div style="background: ${urgencyLevel === 'urgent' ? '#fff3cd' : urgencyLevel === 'important' ? '#e2e3e5' : '#f8f9fa'}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${urgencyLevel === 'urgent' ? '#856404' : urgencyLevel === 'important' ? '#6c757d' : '#0c5460'};">
        <h3 style="margin-top: 0;">Assignment Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Assignment:</strong> ${assignmentName}</li>
          <li><strong>Course:</strong> ${courseName}</li>
          <li><strong>Due Date:</strong> ${dueDate}</li>
          <li><strong>Time Remaining:</strong> ${daysUntilDue === 0 ? 'Due today!' : daysUntilDue === 1 ? '1 day remaining' : `${daysUntilDue} days remaining`}</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${context.baseUrl}/assignments" class="button">Submit Assignment</a>
      </p>

      ${
        urgencyLevel === 'urgent'
          ? `
      <div class="alert alert-warning">
        <p><strong>Final Notice:</strong> Don't miss the deadline! Submit your work as soon as possible.</p>
      </div>
      `
          : ''
      }

      <p>Good luck with your assignment!</p>
      <p>Best regards,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: `${urgencyLevel === 'urgent' ? '⚠️ URGENT: ' : ''}Assignment Due ${daysUntilDue === 0 ? 'Today' : `in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`}: ${assignmentName}`,
      html,
      text: `Reminder: ${assignmentName} in ${courseName} is due ${dueDate}. ${daysUntilDue === 0 ? 'Due today!' : `${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} remaining.`} Submit at: ${context.baseUrl}/assignments`,
    });
  }

  /**
   * Administrative & System Emails
   */

  /**
   * Send role change notification
   */
  public async sendRoleChangeNotification(
    recipientEmail: string,
    recipientName: string,
    newRole: UserRole,
    changedBy: string,
  ): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientEmail);
    const newRoleDisplayName = this.getRoleDisplayName(newRole);

    const content = `
      <h2>Account Role Updated 🔄</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>Your account role has been updated by ${changedBy}.</p>

      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
        <h3 style="margin-top: 0; color: #155724;">New Role: ${newRoleDisplayName}</h3>
        <p style="color: #155724; margin-bottom: 0;">This change is effective immediately and may affect your access permissions.</p>
      </div>

      <p style="text-align: center;">
        <a href="${context.baseUrl}/profile" class="button">View Your Profile</a>
      </p>

      <div class="alert alert-info">
        <p><strong>What does this mean?</strong></p>
        <ul>
          <li>Your access permissions may have changed</li>
          <li>New features might now be available to you</li>
          <li>Check your dashboard for updated options</li>
        </ul>
      </div>

      <p>If you have any questions about this change, please contact our support team.</p>
      <p>Best regards,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: `Your account role has been updated to ${newRoleDisplayName}`,
      html,
      text: `Your account role has been updated to ${newRoleDisplayName} by ${changedBy}. This change is effective immediately. Login at: ${context.baseUrl}/login`,
    });
  }

  /**
   * Send account suspension notification
   */
  public async sendAccountSuspensionEmail(
    recipientEmail: string,
    recipientName: string,
    reason: string,
    suspensionDate: string,
    appealEmail?: string,
  ): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext(recipientName, recipientEmail);

    const content = `
      <h2>Account Suspended ⚠️</h2>
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>We regret to inform you that your ${context.companyName} account has been suspended as of ${suspensionDate}.</p>

      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7; border-left: 4px solid #856404;">
        <h3 style="margin-top: 0; color: #856404;">Reason for Suspension:</h3>
        <p style="color: #856404; margin-bottom: 0;">${reason}</p>
      </div>

      <div class="alert alert-info">
        <p><strong>What this means:</strong></p>
        <ul>
          <li>Your account access has been temporarily restricted</li>
          <li>You cannot access courses or materials during suspension</li>
          <li>Your data remains secure and will be restored upon resolution</li>
        </ul>
      </div>

      ${
        appealEmail
          ? `
      <div class="alert alert-warning">
        <p><strong>Appeal Process:</strong> If you believe this suspension was made in error, please contact our appeals team at <a href="mailto:${appealEmail}">${appealEmail}</a></p>
      </div>
      `
          : ''
      }

      <p>We hope to resolve this matter quickly. Please contact our support team if you have any questions.</p>
      <p>Regards,<br><strong>The ${context.companyName} Team</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: `Account Suspension Notice - ${context.companyName}`,
      html,
      text: `Your account has been suspended as of ${suspensionDate}. Reason: ${reason}. ${appealEmail ? `For appeals, contact: ${appealEmail}` : `Contact support: ${context.supportEmail}`}`,
    });
  }

  /**
   * Utility Methods
   */

  /**
   * Get user role display name
   */
  private getRoleDisplayName(role: UserRole): string {
    const roleMap: Record<UserRole, string> = {
      [UserRole.Student]: 'Student',
      [UserRole.Teacher]: 'Teacher',
      [UserRole.Admin]: 'Administrator',
      [UserRole.SuperAdmin]: 'Super Administrator',
      [UserRole.Editor]: 'Editor',
      [UserRole.Viewer]: 'Viewer',
      [UserRole.Parent]: 'Parent',
      [UserRole.Authority]: 'Authority',
    };
    return roleMap[role] || 'User';
  }

  /**
   * Send system notification email (for admins)
   */
  public async sendSystemNotification(
    adminEmails: string[],
    subject: string,
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
  ): Promise<EmailSendResult[]> {
    const timestamp = new Date().toLocaleString();
    const levelEmoji = { info: 'ℹ️', warning: '⚠️', error: '🚨' }[level];

    const content = `
      <h2>System Notification ${levelEmoji}</h2>
      <p><strong>Time:</strong> ${timestamp}</p>
      <p><strong>Level:</strong> ${level.toUpperCase()}</p>

      <div style="background: ${level === 'error' ? '#f8d7da' : level === 'warning' ? '#fff3cd' : '#d1ecf1'}; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid ${level === 'error' ? '#f5c6cb' : level === 'warning' ? '#ffeaa7' : '#bee5eb'};">
        <h3 style="margin-top: 0;">Message:</h3>
        <p style="margin-bottom: 0; white-space: pre-line;">${message}</p>
      </div>

      <p><small>This is an automated system notification from ${this.config.companyName}.</small></p>
    `;

    const html = this.generateEmailTemplate(content, this.getBaseTemplateContext('Administrator', ''));

    const messages: EmailMessage[] = adminEmails.map((email) => ({
      to: email,
      subject: `${levelEmoji} ${subject}`,
      html,
      text: `System Notification (${level.toUpperCase()})\nTime: ${timestamp}\n\n${message}`,
    }));

    return this.sendBulkEmails(messages);
  }

  /**
   * Test email functionality
   */
  public async sendTestEmail(recipientEmail: string): Promise<EmailSendResult> {
    const context = this.getBaseTemplateContext('Test User', recipientEmail);

    const content = `
      <h2>Email Service Test ✅</h2>
      <p>Hi there!</p>
      <p>This is a test email to verify that the email service is working correctly.</p>

      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
        <h3 style="margin-top: 0; color: #155724;">Test Results:</h3>
        <ul style="color: #155724;">
          <li>✅ SMTP connection established</li>
          <li>✅ Email templates working</li>
          <li>✅ Service integration complete</li>
        </ul>
      </div>

      <p>If you're seeing this email, everything is working perfectly!</p>
      <p>Best regards,<br><strong>The ${context.companyName} Email Service</strong></p>
    `;

    const html = this.generateEmailTemplate(content, context);

    return this.sendEmail({
      to: recipientEmail,
      subject: `Email Service Test - ${context.companyName}`,
      html,
      text: 'This is a test email to verify the email service is working correctly. If you received this, everything is working!',
    });
  }
}

/**
 * Default email service instance
 * Configure this with your actual email settings
 */
const defaultEmailConfig: EmailConfig = {
  smtp: {
    host: process.env['SMTP_HOST'] || 'localhost',
    port: parseInt(process.env['SMTP_PORT'] || '587'),
    secure: process.env['SMTP_SECURE'] === 'true',
    auth: {
      user: process.env['SMTP_USER'] || '',
      pass: process.env['SMTP_PASS'] || '',
    },
  },
  from: {
    name: process.env['EMAIL_FROM_NAME'] || 'Schoola Platform',
    address: process.env['EMAIL_FROM_ADDRESS'] || 'noreply@schoola.com',
  },
  replyTo: process.env['EMAIL_REPLY_TO'] || '',
  baseUrl: process.env['CLIENT_URL'] || 'http://localhost:3000',
  supportEmail: process.env['SUPPORT_EMAIL'] || 'support@schoola.com',
  companyName: process.env['COMPANY_NAME'] || 'Schoola',
};

// Export singleton instance
export const emailService = new EmailServiceClass(defaultEmailConfig);

// Export the class for custom configurations
export const EmailService = EmailServiceClass;
