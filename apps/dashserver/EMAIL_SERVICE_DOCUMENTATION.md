# Enhanced Email Service Documentation

## Overview

The enhanced Email Service has been moved from `src/modules/email` to `src/services/email.service.ts` and significantly improved with:

- **Rich HTML Templates**: Beautiful, responsive email templates
- **Role-Based Integration**: Full integration with RBAC system
- **Error Handling**: Comprehensive error handling and logging
- **Bulk Email Support**: Send multiple emails efficiently
- **Template Variety**: Pre-built templates for common scenarios
- **Development Tools**: Test emails and debugging features

## Installation & Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
EMAIL_FROM_NAME=Schoola Platform
EMAIL_FROM_ADDRESS=noreply@schoola.com
EMAIL_REPLY_TO=support@schoola.com
SUPPORT_EMAIL=support@schoola.com
COMPANY_NAME=Schoola

# Frontend URLs
CLIENT_URL=http://localhost:3000
```

### Import and Usage

```typescript
import { emailService, EmailService } from '../services/email.service';

// Use the default instance
await emailService.sendWelcomeEmail(email, name, role);

// Or create a custom instance
const customEmailService = new EmailService(customConfig);
```

## Available Email Templates

### 1. Authentication Emails

#### Welcome Email

```typescript
await emailService.sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  UserRole.Student,
  'verification-token-here', // Optional verification token
);
```

#### Email Verification

```typescript
await emailService.sendEmailVerification('user@example.com', 'John Doe', 'verification-token-here');
```

#### Password Reset

```typescript
await emailService.sendPasswordResetEmail('user@example.com', 'John Doe', 'reset-token-here');
```

#### Password Change Confirmation

```typescript
await emailService.sendPasswordChangeConfirmation('user@example.com', 'John Doe');
```

### 2. Educational Emails

#### Course Enrollment

```typescript
await emailService.sendCourseEnrollmentEmail('student@example.com', 'Jane Doe', 'Introduction to JavaScript', {
  startDate: '2025-09-01',
  instructor: 'Prof. Smith',
  duration: '8 weeks',
  location: 'Online',
});
```

#### Assignment Reminders

```typescript
await emailService.sendAssignmentReminderEmail(
  'student@example.com',
  'Jane Doe',
  'JavaScript Final Project',
  'Introduction to JavaScript',
  '2025-09-15 23:59',
  3, // Days until due
);
```

### 3. Administrative Emails

#### Role Change Notification

```typescript
await emailService.sendRoleChangeNotification('user@example.com', 'John Doe', UserRole.Teacher, 'Admin User');
```

#### Account Suspension

```typescript
await emailService.sendAccountSuspensionEmail(
  'user@example.com',
  'John Doe',
  'Violation of terms of service',
  '2025-08-28',
  'appeals@schoola.com',
);
```

#### System Notifications (for admins)

```typescript
await emailService.sendSystemNotification(
  ['admin1@schoola.com', 'admin2@schoola.com'],
  'Database Backup Completed',
  'The daily database backup completed successfully at 2:00 AM.',
  'info',
);
```

### 4. Utility Emails

#### Test Email

```typescript
const result = await emailService.sendTestEmail('test@example.com');
console.log(result.success ? 'Email sent!' : 'Failed:', result.error);
```

## Integration with Controllers

The email service is already integrated with the Auth Controller:

### Registration Welcome Emails

```typescript
// In AuthController.register()
if (result.success && result.data?.data?.user) {
  const user = result.data.data.user;
  emailService.sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`, user.role).catch((error) => {
    console.error('Failed to send welcome email:', error);
  });
}
```

### Password Change Notifications

```typescript
// In AuthController.changePassword()
emailService.sendPasswordChangeConfirmation(user.email, `${user.firstName} ${user.lastName}`).catch((error) => {
  console.error('Failed to send password change confirmation:', error);
});
```

## Advanced Usage

### Custom Email Templates

```typescript
// Send a custom email
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<h1>Custom HTML content</h1>',
  text: 'Custom text content',
});
```

### Bulk Emails

```typescript
const messages = [
  {
    to: 'user1@example.com',
    subject: 'Bulk Email 1',
    html: '<p>Content 1</p>',
  },
  {
    to: 'user2@example.com',
    subject: 'Bulk Email 2',
    html: '<p>Content 2</p>',
  },
];

const results = await emailService.sendBulkEmails(messages);
console.log(`Sent ${results.filter((r) => r.success).length} emails successfully`);
```

### Email with Attachments

```typescript
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Document Attached',
  html: '<p>Please find the attached document.</p>',
  attachments: [
    {
      filename: 'document.pdf',
      path: '/path/to/document.pdf',
      contentType: 'application/pdf',
    },
  ],
});
```

## API Endpoints

The following new endpoints are available in the Auth Controller:

### Forgot Password

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newSecurePassword"
}
```

### Send Verification Email

```http
POST /auth/send-verification-email
Authorization: Bearer <jwt-token>
```

### Verify Email

```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-here"
}
```

### Test Email (Development)

```http
POST /auth/test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

## Error Handling

The email service includes comprehensive error handling:

```typescript
// Check if email service is available
if (!emailService.isEmailServiceAvailable()) {
  console.log('Email service is offline');
  return;
}

// Send email with error handling
const result = await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Test',
  html: '<p>Test</p>',
});

if (result.success) {
  console.log(`Email sent successfully: ${result.messageId}`);
} else {
  console.error(`Email failed: ${result.error}`);
}
```

## Logging and Monitoring

The service includes built-in logging:

- ✅ Connection status logging
- 📧 Email send confirmations with message IDs
- ❌ Error logging with details
- 📊 Bulk email statistics
- 📝 Access logging for audit trails

## Development and Testing

### Test Email Service

```typescript
// Send a test email to verify service is working
const result = await emailService.sendTestEmail('your-email@example.com');
```

### Development Environment

- Emails are logged to console in development mode
- Set `NODE_ENV=development` to enable debug logging
- Use email debugging tools like MailHog for local testing

## Security Considerations

1. **Environment Variables**: Keep SMTP credentials secure
2. **Rate Limiting**: The service includes built-in delays for bulk emails
3. **Email Enumeration**: Forgot password doesn't reveal if email exists
4. **Secure Cookies**: Password reset uses secure HTTP-only cookies
5. **Token Expiration**: All tokens have appropriate expiration times

## Template Customization

Email templates use a consistent design system with:

- **Responsive Design**: Works on all devices
- **Brand Colors**: Customizable gradient themes
- **Professional Typography**: System fonts for consistency
- **Accessibility**: Proper contrast and structure
- **Security Indicators**: Visual cues for important actions

## Migration from Old Email Module

The old email module has been removed. Update your imports:

```typescript
// Old (removed)
import { emailService } from '../modules/email';

// New (current)
import { emailService } from '../services/email.service';
```

All functionality has been preserved and enhanced. The API remains mostly compatible with additional features added.

## Troubleshooting

### Common Issues

1. **SMTP Connection Failed**
   - Check SMTP credentials in environment variables
   - Verify SMTP server settings
   - Check firewall/network restrictions

2. **Emails Not Delivered**
   - Check spam folders
   - Verify recipient email addresses
   - Monitor email service logs

3. **Template Issues**
   - Verify all required template variables are provided
   - Check for HTML/CSS compatibility

### Debug Mode

Enable debug logging:

```typescript
// Set NODE_ENV=development for detailed logging
process.env.NODE_ENV = 'development';

// Use debug middleware
emailService
  .sendEmail(message)
  .then((result) => console.log('Email result:', result))
  .catch((error) => console.error('Email error:', error));
```

## Support

For issues or questions:

- Check the console logs for detailed error messages
- Use the test email functionality to verify service connectivity
- Review environment variables configuration
- Contact the development team with specific error messages
