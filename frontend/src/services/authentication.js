// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  // if (response.status === 201) {
  //   let data = await response.json();
  //   return data.token;
  // } else {
    return response;
  // }
};

export const signup = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let response = await fetch(`${BACKEND_URL}/users`, requestOptions);
  const data = response.json()
 

  // if (response.status === 201) {
  //       return;
  //     } else {
  return response;
 

  // }
}

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
//   if (response.status === 201) {
//     return;
//   } else {
//     throw new Error(
//       `Received status ${response.status} when signing up. Expected 201`
//     );
//   }