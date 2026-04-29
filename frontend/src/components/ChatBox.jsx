import { useEffect, useState, useRef } from "react";
import socket from "../services/socket";
import "./chat.css";

export default function ChatBox({ wallet }) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);


  useEffect(() => {

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("userTyping", (wallet) => {
      setTypingUser(wallet);
    });

    socket.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("stopTyping");
    };

  }, []);


  // SEND TEXT MESSAGE
  const sendMessage = () => {

    if (!message.trim()) return;

    const data = {
      from: wallet,
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("sendMessage", data);

    setMessage("");
    socket.emit("stopTyping");
  };


  // SEND FILE MESSAGE
  const sendFile = (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      const fileData = {
        from: wallet,
        file: reader.result,
        fileName: file.name,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("sendMessage", fileData);
    };

    reader.readAsDataURL(file);
  };


  // START VOICE RECORDING
  const startRecording = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm"
        });

        const reader = new FileReader();

        reader.onloadend = () => {

          const voiceMessage = {
            from: wallet,
            audio: reader.result,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          socket.emit("sendMessage", voiceMessage);
        };

        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);

    } catch (error) {

      console.error("Microphone access denied:", error);
      alert("Please allow microphone access");

    }
  };


  // STOP RECORDING
  const stopRecording = () => {

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }

  };


  return (
    <div className="chat-container">

      <div className="chat-header">
        AnyBuzz
      </div>


      <div className="chat-messages">

        {messages.map((msg, index) => {

          const isMe = msg.from === wallet;

          return (
            <div
              key={index}
              className={`message ${isMe ? "sent" : "received"}`}
            >

              <small className="user-label">
                {isMe ? "You" : msg.from.slice(0, 6)}
              </small>


              {/* TEXT MESSAGE */}
              {msg.text && <p>{msg.text}</p>}


              {/* FILE MESSAGE */}
              {msg.file && (

                msg.file.startsWith("data:image") ? (

                  <img
                    src={msg.file}
                    alt="preview"
                    width="150"
                    style={{
                      borderRadius: "8px",
                      marginTop: "5px"
                    }}
                  />

                ) : (

                  <a href={msg.file} download={msg.fileName}>
                    📎 {msg.fileName}
                  </a>

                )

              )}


              {/* VOICE MESSAGE */}
              {msg.audio && (

                <audio controls>
                  <source src={msg.audio} type="audio/webm" />
                </audio>

              )}


              <span className="time">{msg.time}</span>

            </div>
          );
        })}


        {/* TYPING INDICATOR */}
        {typingUser && typingUser !== wallet && (
          <div className="typing">
            {typingUser.slice(0, 6)} is typing...
          </div>
        )}

      </div>


      {/* INPUT AREA */}

      <div className="chat-input">

        <input
          className="text-input"
          value={message}
          onChange={(e) => {

            setMessage(e.target.value);

            if (e.target.value) {
              socket.emit("typing", wallet);
            } else {
              socket.emit("stopTyping");
            }

          }}
          placeholder="Type a message"
        />


        {/* FILE INPUT */}
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          onChange={sendFile}
        />


        {/* FILE BUTTON */}
        <label htmlFor="fileUpload" className="file-btn">
          📎
        </label>


        {/* VOICE BUTTON */}
        {recording ? (
          <button onClick={stopRecording}>⏹️</button>
        ) : (
          <button onClick={startRecording}>🎤</button>
        )}


        {/* SEND BUTTON */}
        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}