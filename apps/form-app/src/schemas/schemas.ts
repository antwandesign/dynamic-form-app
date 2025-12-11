import loanApplicationSchema from './loanApplication.json';
import userRegistrationSchema from './userRegistration.json';
import feedbackSurveySchema from './feedbackSurvey.json';
import eventBookingSchema from './eventBooking.json';

export const SCHEMA_OPTIONS = [
  { id: 'loan', name: '💰 Заявление за Кредит', schema: loanApplicationSchema },
  {
    id: 'registration',
    name: '👤 Регистрация на Потребител',
    schema: userRegistrationSchema,
  },
  {
    id: 'feedback',
    name: '📝 Анкета за Обратна Връзка',
    schema: feedbackSurveySchema,
  },
  { id: 'event', name: '🎫 Резервация на Събитие', schema: eventBookingSchema },
] as const;

export type SchemaId = (typeof SCHEMA_OPTIONS)[number]['id'];
