import { ApiIntegration } from '@zetta/types';
import { useApiIntegration } from '@zetta/form-core';

interface ApiIntegrationHandlerProps {
  integration: ApiIntegration;
}


export const ApiIntegrationHandler: React.FC<ApiIntegrationHandlerProps> = ({
  integration,
}) => {
  useApiIntegration(integration);
  return null;
};
