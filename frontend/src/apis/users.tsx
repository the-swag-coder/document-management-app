import { getRequest, HandlerResponse, postRequest, putRequest } from './api';
import { ICreateUser } from '../interfaces/auth';

export const getUsersAPI = async (): Promise<any> => {
  return getRequest(`${process.env.NEXT_PUBLIC_API_URL}/users`)
    .then((resp: any) => HandlerResponse(resp));
};

export const getUserByIdAPI = async (id: number): Promise<any> => {
  return getRequest(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
    .then((resp: any) => HandlerResponse(resp));
};

export const createUserAPI = async (payload: ICreateUser): Promise<any> => {
  return postRequest(`${process.env.NEXT_PUBLIC_API_URL}/users`, payload)
    .then((resp: any) => HandlerResponse(resp));
};

export const updateUserAPI = async (id: number, payload: ICreateUser): Promise<any> => {
  return putRequest(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, payload)
    .then((resp: any) => HandlerResponse(resp));
};
