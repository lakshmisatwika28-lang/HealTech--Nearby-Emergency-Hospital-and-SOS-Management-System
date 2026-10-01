import React,{useState}from"react";
import Navbar from"../../components/Navbar/Navbar";
import Sidebar from"../../components/Sidebar/Sidebar";
import{sendAIMessage}from"../../services/aiService";
import ReactMarkdown from"react-markdown";
import remarkGfm from"remark-gfm";
import"./AIHealthBuddy.css";

export default function AIHealthBuddy(){
  const[open,setOpen]=useState(false),
  [message,setMessage]=useState(""),
  [messages,setMessages]=useState([
    {
      role:"assistant",
      text:"Hi! I’m your HEALTECH Health Buddy. Ask me about general health information or tell me which healthcare service you need."
    }
  ]),
  [loading,setLoading]=useState(false);

  const send=async()=>{
    if(!message.trim()||loading)return;

    const text=message.trim();
    setMessage("");
    setMessages(m=>[...m,{role:"user",text}]);
    setLoading(true);

    try{
      const reply=await sendAIMessage(text,messages);
      setMessages(m=>[...m,{role:"assistant",text:reply}]);
    }catch{
      setMessages(m=>[
        ...m,
        {
          role:"assistant",
          text:"I’m unable to connect right now. Please try again."
        }
      ]);
    }finally{
      setLoading(false);
    }
  };

  return(
    <div className="page-shell">
      <Navbar onMenuClick={()=>setOpen(true)}/>
      <Sidebar isOpen={open} onClose={()=>setOpen(false)}/>

      <main className="page-main buddy-page">
        <div className="search-header">
          <span className="dashboard-eyebrow">AI HEALTH BUDDY</span>
          <h1>Healthcare, one question away.</h1>
          <p>
            Get general health guidance and navigate HEALTECH services.
            This is not a substitute for a clinician.
          </p>
        </div>

        <div className="buddy-card card">
          <div className="buddy-messages">
            {messages.map((m,i)=>(
              <div
                key={i}
                className={`buddy-message ${m.role}`}
              >
                <span>{m.role==="assistant"?"🤖":"You"}</span>

                <div className="buddy-message-content">
                  {m.role==="assistant"?(
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.text}
                    </ReactMarkdown>
                  ):(
                    <p>{m.text}</p>
                  )}
                </div>
              </div>
            ))}

            {loading&&(
              <div className="buddy-message assistant">
                <span>🤖</span>
                <div className="buddy-message-content">
                  <p>Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <div className="buddy-input">
            <textarea
              value={message}
              onChange={e=>setMessage(e.target.value)}
              onKeyDown={e=>{
                if(e.key==="Enter"&&!e.shiftKey){
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Describe what you need help with..."
              rows="2"
            />

            <button onClick={send}>Send</button>
          </div>
        </div>
      </main>
    </div>
  );
}