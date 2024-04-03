// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const deletePostByID = async (postID, token) => {
  console.log(`Attempting to delete post ${postID} with auth token ${token}`)

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/${postID}/delete`, requestOptions);

  console.log(response.status);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status !== 200) {
    throw new Error("Unable to delete post");
  }
};