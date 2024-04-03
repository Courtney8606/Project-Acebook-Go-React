// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getComments = async (post_id, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/comments/${post_id}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};

export const commentCreate = async (comment, postid, token) => {
  const commentinput = {
    text: comment,
  };

  console.log(commentinput)
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentinput),
  };

  const response = await fetch(`${BACKEND_URL}/comments/${postid}`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};