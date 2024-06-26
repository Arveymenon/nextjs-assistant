import { useEffect } from "react"


const ChatHeader = ({config}: any) => {
    useEffect(()=>{},[config])
    return (
        <div style={{height: "80px", padding: "10px", display: "flex", justifyContent: "space-between"}}>
            {/* Left Logo */}
            {config.logo_client &&
                <img src={config.logo_client} alt="" height="auto"/>
            }
            
            {/* Right Logo */}
            {config.logo_customer &&
                <img src={config.logo_customer} alt="" style={{ maxHeight: "100%" }}/>
            }
        </div>
    )
}

export default ChatHeader