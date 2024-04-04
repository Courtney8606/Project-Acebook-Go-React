// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const postCreate = async (message, token) => {
  const messageinput = {
    message: message,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(messageinput),
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  console.log(response.status);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  return response
};
