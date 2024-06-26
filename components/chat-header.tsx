import { useEffect } from "react"


const ChatHeader = ({config}: any) => {
    console.log(config)
    useEffect(()=>{},[config])
    return (
        <div style={{height: "80px", padding: "10px", display: "flex", justifyContent: "space-between"}}>
            {/* Left Logo */}
            {config.logo_client &&
                <img src={config.logo_client} alt="" height="auto"/>
            }
            
            {/* Right Logo */}
            <span>
                {config.logo_customer &&
                    <img src={config.logo_customer} alt="" style={{ maxHeight: "100%" }}/>
                }
            </span>
        </div>
    )
}

export default ChatHeader