import 'dotenv/config';

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rescueloop',
  jwtSecret: process.env.JWT_SECRET || 'rescueloop-dev-secret',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  demoMode: String(process.env.DEMO_MODE || 'true').toLowerCase() === 'true',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'rescueloop-webhook',
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
};

export default env;
