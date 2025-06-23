import LayoutDashboard from "./LayoutDashboard";
import { useState, useRef, useEffect } from "react";
import { privatePost } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
// import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Chips } from "primereact/chips";
import Toast from "../../components/Toast";

const Dashboard = () => {
    const [url, setUrl] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("Calling scrapping API...");
    const [fieldsToScrape, setFieldsToScrape] = useState("");

    const toastRef = useRef(null);

    const navigate = useNavigate();

    const scrapeUrl = async (e) => {
        e.preventDefault();
        setLoading(true)

        if(url === ""){
            toastRef.current.show({
                type: "error",
                message: "Url is required!"
            });
            setLoading(false)
            return false;
        }

        try {
            const response = await privatePost("/admin/scrape-url", {url, fieldsToScrape}, navigate);

            if(response){
                toastRef.current.show({
                    type: "success",
                    message: "Url Scrapped successfully!"
                });
                setOutput(response?.content)
                setMessageIndex(0)
                setLoading(false);
                navigate("/scrapped-data");
            }
        } catch (err) {
            console.error("Error while scrapping the url: ", err);
            toastRef.current.show({
                type: "error",
                message: err?.response?.data?.message || "An error occurred!"
            });
            setLoading(false)
            setMessageIndex(0)
        }
    }

    useEffect(() => {
        if(loading){
            const messages = [
                "Calling scrapping API...",
                "Scrapping URL...",
                "Rendering dynamic content...",
                "Bypassing Bot protection...",
                "Waiting for content to load properly...",
                "Converting to JSON..."
            ];

            const interval = setInterval(() => {
                setMessageIndex(prevIndex => {
                  const nextIndex = prevIndex + 1;
                  if (nextIndex < messages.length) {
                    setCurrentMessage(messages[nextIndex]);
                    return nextIndex;
                  } else {
                    clearInterval(interval);  // Stop the interval after the last message
                    return prevIndex;
                  }
                });
              }, 2000);
          
            return () => clearInterval(interval);
        }else{
            setCurrentMessage("Calling scrapping API...");
        }

    }, [loading]);

    // useEffect(() => {

    //     setCurrentMessage("Calling scrapping API");
    // }, [])

    return (
        <LayoutDashboard>
            <div className="dashboardWrapper">
                <div className="dashboard_main_inner">
                <div className="dashboard_url_wrap">
                    <div className="dashboard_url_inner">
                    <div className="dashboard_url_content">
                    <h2>Turn websites into LLM ready data</h2>
                    <p>Power your AI apps with clean data crawled from any website. It's also open-source.
                    </p>
                    </div>
                    <form onSubmit={scrapeUrl}>
                    <div className="fieldsToScrape">
                    <div className="scrape_field">
                        <div className="scrape_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 80L0 229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7L48 32C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                        </div>
                        <Chips value={fieldsToScrape} onChange={(e) => setFieldsToScrape(e.value)} separator=","  placeholder="Enter fields to scrape. Separate each with comma ,"/>
                        </div>
                    </div>
                    <div className="scrape_field_wrap">
                    <div className="scrape_field">
                        <div className="scrape_icon">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.2564 1.36399C14.6005 0.707998 13.7384 0.380005 12.8764 0.380005C12.0165 0.380005 11.1544 0.707998 10.4984 1.36399L8.41694 3.44548C7.78198 4.08044 7.43086 4.92566 7.43086 5.82343C7.43086 6.20399 7.49814 6.57193 7.61799 6.92095L8.69448 5.84446C8.69448 5.83605 8.69237 5.82974 8.69237 5.82343C8.69237 5.26206 8.91104 4.73433 9.30841 4.33695L11.3899 2.25545C11.7873 1.85808 12.315 1.63942 12.8764 1.63942C13.4399 1.63942 13.9676 1.85808 14.3629 2.25545C15.1829 3.07544 15.1829 4.40844 14.3629 5.22842L12.2835 7.30992C11.8861 7.70729 11.3584 7.92596 10.7949 7.92596H10.776L9.69948 9.00245C10.0485 9.12229 10.4164 9.18747 10.7949 9.18747C11.6948 9.18747 12.54 8.83845 13.1749 8.20139L15.2564 6.11989C16.5684 4.81002 16.5684 2.67596 15.2564 1.36399Z" fill="#71717A"/>
                        <path d="M11.6885 6.71495L13.77 4.63345C14.262 4.14146 14.262 3.3425 13.77 2.85051C13.5303 2.61082 13.2149 2.48047 12.8764 2.48047C12.54 2.48047 12.2225 2.61082 11.9849 2.85051L9.90344 4.93201C9.88452 4.95093 9.8677 4.96985 9.85088 4.99088C9.96441 4.96144 10.0822 4.94673 10.202 4.94673C10.5952 4.94673 10.9631 5.10021 11.2427 5.37774C11.5203 5.65528 11.6738 6.02532 11.6738 6.41849C11.6738 6.53833 11.6569 6.65608 11.6296 6.76961C11.6485 6.75069 11.6696 6.73387 11.6885 6.71495Z" fill="#71717A"/>
                        <path d="M7.54437 11.1556C7.54858 11.7023 7.34463 12.2468 6.93043 12.6631L4.84894 14.7446C4.45156 15.142 3.92383 15.3607 3.36246 15.3607C2.80108 15.3607 2.27335 15.142 1.87597 14.7446C1.05599 13.9247 1.05599 12.5896 1.87597 11.7696L3.95747 9.69017C4.37167 9.27388 4.91832 9.06993 5.46288 9.07414L6.53937 7.99764C6.19245 7.8778 5.82241 7.81262 5.44395 7.81262C4.54407 7.81262 3.70096 8.16164 3.0639 8.7966L0.982403 10.8781C-0.327468 12.1901 -0.327468 14.3241 0.982403 15.6361C2.29438 16.9481 4.42843 16.9481 5.74041 15.6361L7.8219 13.5546C8.75963 12.6169 9.02455 11.2587 8.62086 10.0812L7.54437 11.1556Z" fill="#71717A"/>
                        <path d="M4.55258 10.283L2.47109 12.3644C1.9791 12.8564 1.9791 13.6575 2.47109 14.1495C2.70867 14.3871 3.02615 14.5195 3.36256 14.5195C3.69896 14.5195 4.01644 14.3871 4.25402 14.1495L6.33552 12.068C6.35444 12.0491 6.36706 12.028 6.38388 12.0091C6.27034 12.0365 6.1547 12.0512 6.03906 12.0512C5.66061 12.0512 5.28426 11.9082 4.99832 11.6223C4.71027 11.3342 4.5673 10.96 4.5673 10.5836C4.5673 10.468 4.58202 10.3502 4.60935 10.2367C4.59043 10.2535 4.5694 10.2661 4.55258 10.283Z" fill="#71717A"/>
                        <path d="M5.59326 10.1357C5.34727 10.3817 5.34727 10.7811 5.59326 11.0271C5.83926 11.2731 6.23874 11.2731 6.48473 11.0271L10.6477 6.86414C10.7655 6.7443 10.8327 6.58661 10.8327 6.41841C10.8327 6.25021 10.7655 6.09041 10.6477 5.97267C10.408 5.73299 9.99384 5.73299 9.75415 5.97267L5.59326 10.1357Z" fill="#71717A"/>
                        </svg>

                        </div>
                        <InputText 
                        type="text" 
                        className="p-inputtext-sm" 
                        placeholder="https://example.com" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        />
                        </div>
                    <div className="scrape_btn">
                        <Button label="Scrap" icon="pi pi-check" loading={loading} />
                    </div>
                    </div>
                </form>
                </div>
                </div>
                </div>
                
                <div className="loadingContentMessage">{loading && currentMessage}</div>

                {/* {output !== "" && (
                    <div className="output">
                        <h2>Output</h2>
                        <div style={{ width: "800px", height: "500px", overflow: "auto", border: "1px solid #ccc", padding: "10px", backgroundColor: "#f9f9f9" }}>
                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                {JSON.stringify(output, null, 2)}
                            </pre>
                        </div>
                    </div>
                )} */}
            </div>
            <Toast ref={toastRef} />
        </LayoutDashboard>
    );
}

export default Dashboard;