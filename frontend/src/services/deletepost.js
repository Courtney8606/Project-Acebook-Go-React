// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const deletePostByID = async (postID, token) => {
  console.log(`Attempting to delete post ${postID} with auth token ${token}`)
  const postIDInput = {
    postID: postID,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postIDInput),
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  console.log(response.status);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status !== 201) {
    throw new Error("Unable to delete post");
  }

  const data = await response.json();
  return data;
};