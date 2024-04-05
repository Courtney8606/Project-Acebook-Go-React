// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getImage = async (user_id, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/images/${user_id}`, requestOptions);
  console.log(response)
  
  if (response.status !== 200) {
    throw new Error("Unable to fetch image");
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.startsWith('image/')) {
 
  }
  const imageData = await response.url;
  return imageData;
};

export const imageCreate = async (formData, token) => {

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData
  };

    const response = await fetch(`${BACKEND_URL}/images/upload`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Data:", data)
    return data;
};