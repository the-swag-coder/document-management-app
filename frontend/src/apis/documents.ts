import { deleteRequest, getRequest, HandlerResponse, postRequestMultiPart } from './api';

export const getDocumentsAPI = async (): Promise<any> => {
  return getRequest(`${process.env.NEXT_PUBLIC_API_URL}/documents`)
    .then((resp: any) => HandlerResponse(resp));
};

export const uploadDocumentAPI = async (formData: any): Promise<any> => {
  return postRequestMultiPart(`${process.env.NEXT_PUBLIC_API_URL}/documents`, formData)
    .then((resp: any) => HandlerResponse(resp));
};

export const getDocumentByIdAPI = async (id: number): Promise<any> => {
  return getRequest(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`)
    .then((resp: any) => HandlerResponse(resp));
};

export const deleteDocumentAPI = async (id: number): Promise<any> => {
  return deleteRequest(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`)
    .then((resp: any) => HandlerResponse(resp));
};
