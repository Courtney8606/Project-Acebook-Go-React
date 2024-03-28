const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const signupErrors = async (email, password) => {
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

  
  };
//   const clearFormFields = () => {
//     document.getElementById("email").value = "";
//     document.getElementById("password").value = "";

  let response = await fetch(`${BACKEND_URL}/users`, requestOptions);
    const data = await response.json()
          console.log(response)
          if (response.status == 400)
          {
            if (data.message == "Must supply username and password") {
              return("Please input both a valid email address and a password");
            }
            
            else if (data.message == "Invalid email address") {
                return("Please include a valid email address");
                // clearFormFields();
              
            }
            else if (data.message == "Email address already in use") {
              return("This email address is already in use. Please log in or sign up with different email address");
              document.getElementById("password").value = "";
            }
            else {setErrorMessage("An error has occurred. Please try again");
                //   clearFormFields();
                  }
          }
          else{console.log("redirecting...:");
        }
    

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
//   if (response.status === 201) {
//     return;
//   } else {
//     throw new Error(
//       `Received status ${response.status} when signing up. Expected 201`
//     );
//   }