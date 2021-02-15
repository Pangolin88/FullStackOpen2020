import React from "react";

const LogoutButton = ( {handleLogout, user} ) => {
    return(
        <div>
           {user.name} logged in
           <button onClick={handleLogout}>logout</button>
        </div>
    )
  }

export default LogoutButton