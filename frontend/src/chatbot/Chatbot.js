import { useEffect } from "react";

const Chatbot = () => {
    useEffect(() => {
        // 설정
        window.chtlConfig = { chatbotId: "9918883447" };

        // 스크립트 생성
        const script = document.createElement("script");
        script.src = "https://chatling.ai/js/embed.js";
        script.async = true;
        script.setAttribute("data-id", "9918883447");
        script.id = "chtl-script";
        script.type = "text/javascript";

        // body에 추가
        document.body.appendChild(script);

        // cleanup (필요 시)
        return () => {
            document.body.removeChild(script);
            delete window.chtlConfig;
        };
    }, []);

    return null;
};

export default Chatbot;
