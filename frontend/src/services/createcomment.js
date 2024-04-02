// docs: https://vitejs.dev/guide/env-and-mode.html
// Reminder: Backend need to create a new table in the database
// "Comments": ID, Comment, PostID (linking comment to a post)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const commentCreate = async (comment, token) => {
  const commentinput = {
    comment: comment,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentinput),
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  console.log(response.status);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};
