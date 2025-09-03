import z from 'zod';
import 'dotenv/config';

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.number().default(3000),
  MONGODB_URL: z.string().describe('Mongo DB url'),
  JWT_SECRET: z.string().describe('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: z.number().default(30).describe('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: z.number().default(30).describe('days after which refresh tokens expire'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.number().default(10).describe('minutes after which reset password token expires'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.number().default(10).describe('minutes after which verify email token expires'),
  SMTP_HOST: z.string().describe('server that will send the emails'),
  SMTP_PORT: z.number().describe('port to connect to the email server'),
  SMTP_USERNAME: z.string().describe('username for email server'),
  SMTP_PASSWORD: z.string().describe('password for email server'),
  EMAIL_FROM: z.string().describe('the from field in the emails sent by the app'),
  CLIENT_URL: z.string().describe('Client url'),
});

const { success, data, error } = envVarsSchema.safeParse(process.env);

if (!success) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: data.NODE_ENV,
  port: data.PORT,
  mongoose: {
    url: data.MONGODB_URL + (data.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: data.JWT_SECRET,
    accessExpirationMinutes: data.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: data.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: data.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: data.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: data.NODE_ENV === 'production',
      signed: true,
    },
  },
  email: {
    smtp: {
      host: data.SMTP_HOST,
      port: data.SMTP_PORT,
      auth: {
        user: data.SMTP_USERNAME,
        pass: data.SMTP_PASSWORD,
      },
    },
    from: data.EMAIL_FROM,
  },
  clientUrl: data.CLIENT_URL,
};

export default config;
