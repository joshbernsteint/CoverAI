import React from "react";
const CLContext = React.createContext(
    {
        activeCL: {}, 
        setActiveCL: () => {}
    }
); //Holds the JSON interpretation of the CL 

export default CLContext;