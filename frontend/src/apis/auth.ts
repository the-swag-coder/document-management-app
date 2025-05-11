import { HandlerResponse, postRequest } from './api';
import { ICreateUser, ILogin } from '../interfaces/auth';

export const loginAPI = async (payload: ILogin): Promise<any> => {
  return postRequest(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, payload)
    .then((resp: any) => HandlerResponse(resp));
};

export const signUpAPI = async (payload: ICreateUser): Promise<any> => {
  return postRequest(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, payload)
    .then((resp: any) => HandlerResponse(resp));
};
