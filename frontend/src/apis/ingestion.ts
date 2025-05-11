import { getRequest, HandlerResponse, postRequest } from './api';

export const getIngestionsAPI = async (): Promise<any> => {
  return getRequest(`${process.env.NEXT_PUBLIC_API_URL}/ingestion`)
    .then((resp: any) => HandlerResponse(resp));
};

export const createIngestionsAPI = async (): Promise<any> => {
  return postRequest(`${process.env.NEXT_PUBLIC_API_URL}/ingestion`)
    .then((resp: any) => HandlerResponse(resp));
};
