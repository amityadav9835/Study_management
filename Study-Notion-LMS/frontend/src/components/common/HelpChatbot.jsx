import { useMemo, useRef, useState } from "react"
import { BiBot, BiSend, BiX } from "react-icons/bi"

const quickQuestions = [
  "How do I buy a course?",
  "How do I watch my course?",
  "How can I become an instructor?",
  "How do payments work?",
  "Where is my purchase history?",
]

const defaultReply =
  "I can help you understand Study-Easy. Ask about signup, login, buying courses, watching lectures, instructor tools, payments, profile settings, or purchase history."

function getReply(input) {
  const text = input.toLowerCase()

  if (text.includes("signup") || text.includes("register") || text.includes("account")) {
    return "To create an account, open Signup, choose Student or Instructor, enter your details, verify the OTP sent to your email, and then log in."
  }

  if (text.includes("login") || text.includes("password")) {
    return "Use Login with your registered email and password. If you forget the password, use Forgot Password to receive a reset link by email."
  }

  if (text.includes("buy") || text.includes("purchase") || text.includes("cart")) {
    return "To buy a course, open a course details page and click Buy Now. You can also add courses to Cart and pay for all selected courses together."
  }

  if (text.includes("payment") || text.includes("razorpay") || text.includes("checkout")) {
    return "Payments are handled through Razorpay. After payment, the backend verifies the Razorpay signature, enrolls you in the course, creates progress tracking, and sends confirmation email."
  }

  if (text.includes("watch") || text.includes("lecture") || text.includes("video") || text.includes("learn")) {
    return "After purchase, go to Dashboard > Enrolled Courses. Select a course to open the video player, watch lectures, and track your progress."
  }

  if (text.includes("instructor") || text.includes("teach") || text.includes("create course")) {
    return "Instructors can use Dashboard > Add Course to create course information, upload thumbnails/videos, add sections, add lectures, publish courses, and view course statistics."
  }

  if (text.includes("history") || text.includes("enrolled")) {
    return "Your purchased courses are available in Dashboard > Purchase History and Dashboard > Enrolled Courses. Both show the courses linked to your account."
  }

  if (text.includes("profile") || text.includes("setting") || text.includes("image")) {
    return "Use Dashboard > Settings to update your name, profile details, profile image, password, or delete your account."
  }

  if (text.includes("rating") || text.includes("review")) {
    return "Students can rate and review a course after enrollment. Reviews help other learners understand course quality."
  }

  if (text.includes("contact") || text.includes("support") || text.includes("help")) {
    return "For support, open the Contact page from the navbar. You can send your query using the contact form or use the listed contact details."
  }

  return defaultReply
}

export default function HelpChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I am your Study-Easy guide. Ask me how this website works.",
    },
  ])
  const inputRef = useRef(null)

  const suggestions = useMemo(() => quickQuestions, [])

  const sendMessage = (messageText = input) => {
    const trimmed = messageText.trim()
    if (!trimmed) return

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: trimmed },
      { sender: "bot", text: getReply(trimmed) },
    ])
    setInput("")
  }

  const openChat = () => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div className="fixed bottom-5 left-4 z-[1000] sm:left-auto sm:right-5">
      {open && (
        <div className="mb-3 flex h-[520px] max-h-[78vh] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-lg border border-richblack-600 bg-richblack-800 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-richblack-700 bg-richblack-900 px-4 py-3">
            <div className="flex items-center gap-2 text-richblack-5">
              <BiBot className="text-2xl text-yellow-50" />
              <div>
                <p className="text-sm font-semibold">Study-Easy Help</p>
                <p className="text-xs text-richblack-300">Website functionality guide</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5"
              aria-label="Close help chat"
            >
              <BiX className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-5 ${
                    message.sender === "user"
                      ? "bg-yellow-50 text-richblack-900"
                      : "bg-richblack-700 text-richblack-50"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-richblack-700 px-3 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="shrink-0 rounded-md border border-richblack-600 px-3 py-1 text-xs text-richblack-100 hover:border-yellow-50 hover:text-yellow-50"
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage()
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about this website..."
                className="min-w-0 flex-1 rounded-md bg-richblack-700 px-3 py-2 text-sm text-richblack-5 outline-none placeholder:text-richblack-400"
              />
              <button
                type="submit"
                className="rounded-md bg-yellow-50 p-2 text-richblack-900 hover:bg-yellow-100"
                aria-label="Send message"
              >
                <BiSend className="text-xl" />
              </button>
            </form>
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={openChat}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-richblack-900 shadow-xl shadow-black/40 transition hover:scale-105 hover:bg-yellow-100"
          aria-label="Open help chat"
        >
          <BiBot className="text-3xl" />
        </button>
      )}
    </div>
  )
}
