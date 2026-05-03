import React, { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { FiCopy, FiFileText, FiImage, FiRefreshCw, FiUploadCloud } from "react-icons/fi"
import { recognize } from "tesseract.js"

import Footer from "../components/common/Footer"

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "was",
  "were",
  "with",
  "you",
  "your",
])

const splitSentences = (value) =>
  value
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) || []

const getWords = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))

const summarizeText = (value, sentenceCount = 3) => {
  const sentences = splitSentences(value)

  if (sentences.length <= sentenceCount) {
    return value.trim()
  }

  const frequencies = getWords(value).reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {})

  const rankedSentences = sentences
    .map((sentence, index) => {
      const words = getWords(sentence)
      const score =
        words.reduce((total, word) => total + (frequencies[word] || 0), 0) /
        Math.max(words.length, 1)

      return { index, sentence, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => a.index - b.index)

  return rankedSentences.map(({ sentence }) => sentence).join(" ")
}

const TextSummarizer = () => {
  const [sourceText, setSourceText] = useState("")
  const [summary, setSummary] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [imageName, setImageName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)

  const stats = useMemo(() => {
    const originalWords = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0
    const summaryWords = summary.trim() ? summary.trim().split(/\s+/).length : 0

    return {
      originalWords,
      summaryWords,
      reduction:
        originalWords > 0 && summaryWords > 0
          ? Math.max(0, Math.round((1 - summaryWords / originalWords) * 100))
          : 0,
    }
  }, [sourceText, summary])

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
      setImageName(file.name)
      setImageFile(file)
      setOcrProgress(0)
    }
    reader.readAsDataURL(file)
  }

  const handleExtractText = async () => {
    if (!imageFile) {
      toast.error("Upload an image first")
      return
    }

    try {
      setIsExtracting(true)
      setOcrProgress(0)

      const result = await recognize(imageFile, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setOcrProgress(Math.round(message.progress * 100))
          }
        },
      })

      const extractedText = result.data.text.trim()

      if (!extractedText) {
        toast.error("No readable text found in this image")
        return
      }

      setSourceText((currentText) =>
        currentText.trim() ? `${currentText.trim()}\n\n${extractedText}` : extractedText
      )
      setSummary(summarizeText(extractedText))
      toast.success("Text extracted from image")
    } catch (error) {
      toast.error("Could not extract text from this image")
    } finally {
      setIsExtracting(false)
    }
  }

  const handleGenerateSummary = () => {
    if (!sourceText.trim()) {
      toast.error("Add some text to summarize")
      return
    }

    setSummary(summarizeText(sourceText))
  }

  const handleCopy = async () => {
    if (!summary) return

    await navigator.clipboard.writeText(summary)
    toast.success("Summary copied")
  }

  const handleReset = () => {
    setSourceText("")
    setSummary("")
    setImagePreview("")
    setImageName("")
    setImageFile(null)
    setIsExtracting(false)
    setOcrProgress(0)
  }

  return (
    <div>
      <main className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-10 py-16 text-richblack-5">
        <section className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-50">
            Free study tool
          </p>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-[720px]">
              <h1 className="text-3xl font-semibold leading-tight text-richblack-5 md:text-5xl">
                Upload an image or paste text, then create a quick summary.
              </h1>
              <p className="mt-4 text-base leading-7 text-richblack-200">
                Use this without logging in. Extract text from a notes image, paste your
                lesson text, and get the key points in a shorter format.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-lg border border-richblack-700 bg-richblack-800 p-4 text-center">
              <div>
                <p className="text-xl font-semibold text-yellow-50">{stats.originalWords}</p>
                <p className="text-xs text-richblack-300">Words</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-caribbeangreen-100">
                  {stats.summaryWords}
                </p>
                <p className="text-xs text-richblack-300">Summary</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-blue-100">{stats.reduction}%</p>
                <p className="text-xs text-richblack-300">Shorter</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <label className="flex min-h-[310px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-richblack-600 bg-richblack-800 p-5 text-center transition-all hover:border-yellow-50 hover:bg-richblack-700">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {imagePreview ? (
                <div className="flex w-full flex-col gap-4">
                  <img
                    src={imagePreview}
                    alt="Uploaded study reference"
                    className="h-[220px] w-full rounded-md object-cover"
                  />
                  <p className="break-all text-sm text-richblack-200">{imageName}</p>
                </div>
              ) : (
                <>
                  <FiUploadCloud className="text-5xl text-yellow-50" />
                  <p className="mt-4 text-lg font-semibold text-richblack-5">
                    Upload image
                  </p>
                  <p className="mt-2 text-sm text-richblack-300">
                    Add a notes screenshot, textbook photo, or diagram.
                  </p>
                </>
              )}
            </label>

            <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-5">
              <div className="mb-3 flex items-center gap-2 text-richblack-5">
                <FiImage className="text-yellow-50" />
                <h2 className="font-semibold">Image text extraction</h2>
              </div>
              <p className="text-sm leading-6 text-richblack-300">
                Upload a clear notes screenshot or textbook photo, then extract its text
                into the editor. Clear, high-contrast images give the best result.
              </p>

              <button
                type="button"
                onClick={handleExtractText}
                disabled={!imageFile || isExtracting}
                className="yellowButton mt-5 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiFileText />
                {isExtracting ? `Extracting ${ocrProgress}%` : "Extract Text From Image"}
              </button>

              {isExtracting && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-richblack-700">
                  <div
                    className="h-full rounded-full bg-yellow-50 transition-all"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-5">
              <div className="mb-4 flex items-center gap-2">
                <FiFileText className="text-yellow-50" />
                <h2 className="text-lg font-semibold text-richblack-5">Text to summarize</h2>
              </div>

              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Paste lesson notes, article text, or paragraphs here..."
                className="min-h-[260px] w-full resize-y rounded-lg border border-richblack-600 bg-richblack-900 p-4 text-richblack-5 outline-none placeholder:text-richblack-400 focus:border-yellow-50"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  className="yellowButton flex items-center justify-center gap-2"
                >
                  <FiFileText />
                  Generate Summary
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="blackButton flex items-center justify-center gap-2 border border-richblack-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiRefreshCw />
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-richblack-5">Generated summary</h2>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!summary}
                  className="flex items-center gap-2 rounded-md border border-richblack-600 px-3 py-2 text-sm text-richblack-100 transition-all hover:border-yellow-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiCopy />
                  Copy
                </button>
              </div>

              <div className="min-h-[180px] rounded-lg border border-richblack-700 bg-richblack-900 p-4 text-richblack-100">
                {summary ? (
                  <p className="whitespace-pre-line leading-7">{summary}</p>
                ) : (
                  <p className="text-richblack-400">
                    Your summary will appear here after you add text and click generate.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default TextSummarizer
