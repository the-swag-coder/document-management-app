export const getRequest = async (URL: string): Promise<any> => {
  const token = sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`);

  return fetch(`${URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  }).then(res => {
    return res;
  }).catch(() => {
    console.log(`TypeError: failed to fetch ${URL}`);
  });
};

export const postRequest = async (URL: string, payload?: any): Promise<any> => {
  const token = sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`);

  return fetch(`${URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  }).then(res => {
    return res;
  }).catch(() => {
    console.log(`TypeError: failed to fetch ${URL}`);
  });
};

export const putRequest = async (URL: string, payload?: any): Promise<any> => {
  const token = sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`);

  return fetch(`${URL}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  }).then(res => {
    return res;
  }).catch(() => {
    console.log(`TypeError: failed to fetch ${URL}`);
  });
};

export const postRequestMultiPart = async (URL: string, formData?: any): Promise<any> => {
  const token = sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`);

  return fetch(`${URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  }).then(res => {
    return res;
  }).catch(() => {
    console.log(`TypeError: failed to fetch ${URL}`);
  });
};

export const deleteRequest = async (URL: string): Promise<any> => {
  const token = sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`);

  return fetch(`${URL}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  }).then(res => {
    return res;
  }).catch(() => {
    console.log(`TypeError: failed to fetch ${URL}`);
  });
};

export const HandlerResponse = async (resp: Response) => {
  if (!resp) {
    throw new Error('No response from server');
  }

  if (resp.status >= 200 && resp.status < 300) {
    // Successful responses (status codes 2xx)
    const data = await resp.json();
    return data;
  } else if (resp.status >= 400 && resp.status < 500) {
    // Client errors (status codes 4xx)
    const jsonResponse = await resp.json();
    throw new Error(jsonResponse.detail || 'Client error occurred');
  } else if (resp.status >= 500) {
    // Server errors (status codes 5xx)
    const jsonResponse = await resp.json();
    throw new Error(jsonResponse.detail || 'Something went wrong');
  } else {
    // Other non-standard status codes
    console.log(`Unexpected status code: ${resp.status} ${resp.statusText}`);
    throw new Error(`Unexpected error occurred. Status code: ${resp.status}`);
  }
};
