import React, { useState, useEffect, useRef, useContext } from "react";
import { IoIosSend } from "react-icons/io";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { ChatMessage } from "./ChatMessage";
import { SocketContext } from "@/context/SocketProvider";
import { useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/redux/store";
import SyncLoader from "react-spinners/SyncLoader";
import EmojiPicker, {
	EmojiClickData,
	Theme,
	EmojiStyle,
} from "emoji-picker-react";
import { Player } from "@lottiefiles/react-lottie-player";

interface Message {
	senderId: string;
	content: string;
	createdAt: string;
	recieverSeen: boolean;
}

interface ChatWindowProps {
	messages: Message[];
	currentUser: any;
	onSendMessage: (message: string) => void;
	currentChat: any;
	typingData: { isTyping: boolean; senderId: string } | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
	messages,
	currentUser,
	onSendMessage,
	currentChat,
	typingData,
}) => {
	const [inputMessage, setInputMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const emojiPickerRef = useRef<HTMLDivElement>(null);
	const { socket } = useContext(SocketContext) || {};
	const { data } = useAppSelector((state: RootState) => state.user);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		socket?.emit("typing", {
			roomId: currentChat.roomId,
			senderId: data?._id,
		});
		setInputMessage(e.target.value);
	};

	const handleSendMessage = () => {
		if (inputMessage.trim()) {
			onSendMessage(inputMessage);
			setInputMessage("");
		}
	};

	const handleEmojiClick = (emojiData: EmojiClickData) => {
		setInputMessage(inputMessage + emojiData.emoji);
		setShowEmojiPicker(false);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			emojiPickerRef.current &&
			!emojiPickerRef.current.contains(event.target as Node)
		) {
			setShowEmojiPicker(false);
		}
	};

	useEffect(() => {
		if (showEmojiPicker) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showEmojiPicker]);
    console.log(currentChat,"curret chat");

    console.log(typingData,"typing data");
    
    

	return (
		<section className="flex flex-col w-2/3 bg-white dark:bg-gray-900">
			{currentChat ? (
				<>
					<header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
						<div className="w-12 h-12 rounded-full overflow-hidden mr-4">
							<img
								src={currentChat?.profile?.avatar}
								alt="User Avatar"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex">
							<div className="">
								<div className="font-bold text-gray-900 dark:text-white">
									{currentChat.userName}
								</div>
								<div className={`text-sm text-gray-500 dark:text-gray-400`}>
									{currentChat.isOnline ? "Online" : "Offline"}
								</div>
							</div>
							<div className={`text-sm text-gray-500 dark:text-gray-400`}>
								{typingData &&
								// typingData.senderId === currentChat.receiverId &&
								typingData.isTyping ? (
									<SyncLoader  className="ml-3 " size={5} color="#ffffff" />
								) : (
									""
								)}
							</div>
						</div>
					</header>
					<div className="flex-1 flex flex-col overflow-hidden">
						<div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
							{messages.map((message, index) => (
								<ChatMessage
									key={index}
									message={message}
									currentUser={currentUser}
								/>
							))}
							<div ref={messagesEndRef} />
						</div>
						<div className="border-t border-gray-200 dark:border-gray-700 p-4">
							<div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg relative">
								<button
									className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"
									onClick={() => setShowEmojiPicker(!showEmojiPicker)}
								>
									<EmojiEmotionsIcon fontSize="medium" />
								</button>
								{showEmojiPicker && (
									<div
										className="absolute bottom-12 left-0"
										ref={emojiPickerRef}
									>
										<EmojiPicker
											onEmojiClick={handleEmojiClick}
											theme={Theme.AUTO}
											emojiStyle={EmojiStyle.GOOGLE}
										/>
									</div>
								)}
								<button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
									<AttachFileIcon fontSize="medium" />
								</button>
								<input
									type="text"
									className="flex-grow p-2 bg-transparent text-gray-900 dark:text-white focus:outline-none"
									placeholder="Type a message"
									value={inputMessage}
									onChange={handleInputChange}
									onKeyPress={(e) => {
										if (e.key === "Enter") handleSendMessage();
									}}
								/>
								<button
									className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"
									onClick={handleSendMessage}
								>
									<IoIosSend size={30} />
								</button>
								<button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
									<KeyboardVoiceIcon fontSize="medium" />
								</button>
							</div>
						</div>
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
					<div>
						<Player
							autoplay
							loop
							src="https://lottie.host/62d503b1-5d31-417c-8503-63f54f011b2c/orFIpLf5MZ.json"
							style={{ height: "30%", width: "30%" }}
						/>
					</div>
					<div>
						Select a chat to start messaging{" "}
						<span className="animate-ping">......</span>{" "}
					</div>
				</div>
			)}
		</section>
	);
};
