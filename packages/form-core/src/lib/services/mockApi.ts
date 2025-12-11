import { logger } from '../utils/logger';

export type MockApiEndpoint =
  | 'fetchAddressFromPostalCode'
  | 'fetchCompanyDetails'
  | 'validateDocument';

export const VALID_ENDPOINTS: MockApiEndpoint[] = [
  'fetchAddressFromPostalCode',
  'fetchCompanyDetails',
  'validateDocument',
];

interface AddressResponse {
  city: string;
  oblast: string;
  country: string;
}

interface CompanyResponse {
  companyName: string;
  companyAddress: string;
  registrationDate: string;
}

interface DocumentValidationResponse {
  isValid: boolean;
  message: string;
}

type ApiResponse =
  | AddressResponse
  | CompanyResponse
  | DocumentValidationResponse;

const mockAddressDatabase: Record<string, AddressResponse> = {
  '1000': { city: 'София', oblast: 'София-град', country: 'България' },
  '1040': { city: 'София', oblast: 'София-град', country: 'България' },
  '1164': { city: 'София', oblast: 'София-град', country: 'България' },
  '4000': { city: 'Пловдив', oblast: 'Пловдив', country: 'България' },
  '9000': { city: 'Варна', oblast: 'Варна', country: 'България' },
  '8000': { city: 'Бургас', oblast: 'Бургас', country: 'България' },
  '7000': { city: 'Русе', oblast: 'Русе', country: 'България' },
  '6000': { city: 'Стара Загора', oblast: 'Стара Загора', country: 'България' },
  '5000': {
    city: 'Велико Търново',
    oblast: 'Велико Търново',
    country: 'България',
  },
  '2700': { city: 'Благоевград', oblast: 'Благоевград', country: 'България' },
  '1700': {
    city: 'Студентски град',
    oblast: 'София-град',
    country: 'България',
  },
  '1500': { city: 'София', oblast: 'София-град', country: 'България' },
};

const mockCompanyDatabase: Record<string, CompanyResponse> = {
  '831600946': {
    companyName: 'Софтуерна Компания ООД',
    companyAddress: 'бул. Витоша 100, София 1000',
    registrationDate: '2015-03-15',
  },
  '175188113': {
    companyName: 'Технологии България АД',
    companyAddress: 'ул. Шипка 34, Пловдив 4000',
    registrationDate: '2010-08-22',
  },
  '200950412': {
    companyName: 'Търговска Фирма ЕООД',
    companyAddress: 'ул. Преслав 15, Варна 9000',
    registrationDate: '2018-11-30',
  },
  '1234567890123': {
    companyName: 'Голяма Компания с БУЛСТАТ',
    companyAddress: 'бул. България 1, Бургас 8000',
    registrationDate: '2005-01-10',
  },
};

export async function mockApiCall(
  endpoint: MockApiEndpoint,
  payload: Record<string, string>,
  signal?: AbortSignal
): Promise<ApiResponse | null> {
  if (signal?.aborted) {
    throw new DOMException('Request aborted', 'AbortError');
  }

  const delay = Math.random() * 500 + 300;
  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(resolve, delay);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Request aborted', 'AbortError'));
      },
      { once: true }
    );
  });

  const normalizedPayload: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload)) {
    const lastPart = key.split('.').pop() || key;
    normalizedPayload[lastPart] = value;
    normalizedPayload[key] = value;
  }

  switch (endpoint) {
    case 'fetchAddressFromPostalCode':
      return fetchAddressFromPostalCode(
        normalizedPayload.postalCode ||
          normalizedPayload['contactInfo.postalCode']
      );
    case 'fetchCompanyDetails':
      return fetchCompanyDetails(
        normalizedPayload.eik || normalizedPayload.bulstat
      );
    case 'validateDocument':
      return validateDocument(
        normalizedPayload.documentType,
        normalizedPayload.documentNumber
      );
    default:
      logger.warn(`Unknown API endpoint: ${endpoint}`);
      return null;
  }
}

function fetchAddressFromPostalCode(
  postalCode: string
): AddressResponse | null {
  const address = mockAddressDatabase[postalCode];
  if (address) {
    logger.log(
      `[Mock API] Адрес намерен за пощенски код ${postalCode}:`,
      address
    );
    return address;
  }
  logger.log(`[Mock API] Няма адрес за пощенски код ${postalCode}`);
  return null;
}

function fetchCompanyDetails(eik: string): CompanyResponse | null {
  const company = mockCompanyDatabase[eik];
  if (company) {
    logger.log(`[Mock API] Фирма намерена за ЕИК ${eik}:`, company);
    return company;
  }
  logger.log(`[Mock API] Няма фирма за ЕИК ${eik}`);
  return null;
}

function validateDocument(
  documentType: string,
  documentNumber: string
): DocumentValidationResponse {
  let isValid = false;
  let message = 'Невалиден документ';

  if (documentType === 'EGN') {
    isValid = validateEGN(documentNumber);
    message = isValid
      ? 'ЕГН е валидно'
      : 'ЕГН трябва да е точно 10 цифри и да е валидно';
  } else if (documentType === 'ID_CARD') {
    isValid = /^\d{9}$/.test(documentNumber);
    message = isValid
      ? 'Номерът на лична карта е валиден'
      : 'Номерът на лична карта трябва да е 9 цифри';
  } else if (documentType === 'PASSPORT') {
    isValid = /^\d{9}$/.test(documentNumber);
    message = isValid
      ? 'Номерът на паспорта е валиден'
      : 'Номерът на паспорта трябва да е 9 цифри';
  } else if (documentType === 'EIK') {
    isValid = /^(\d{9}|\d{13})$/.test(documentNumber);
    message = isValid
      ? 'ЕИК/БУЛСТАТ е валиден'
      : 'ЕИК трябва да е 9 цифри, БУЛСТАТ - 13 цифри';
  }

  logger.log(`[Mock API] Валидация на документ:`, {
    documentType,
    documentNumber,
    isValid,
    message,
  });
  return { isValid, message };
}

function validateEGN(egn: string): boolean {
  if (!/^\d{10}$/.test(egn)) {
    return false;
  }

  const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(egn[i], 10) * weights[i];
  }

  let checksum = sum % 11;
  if (checksum === 10) {
    checksum = 0;
  }

  return checksum === parseInt(egn[9], 10);
}
