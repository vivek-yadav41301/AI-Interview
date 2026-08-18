import React, { useEffect, useRef, useState } from "react";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import maleVideo from "../assets/Videos/male-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // --------------------------------------------------
  // LOAD SPEECH SYNTHESIS VOICES
  // --------------------------------------------------

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      // Female voice
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Male voice
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const videoSource =
    voiceGender === "male" ? maleVideo : femaleVideo;

  // --------------------------------------------------
  // START / STOP MICROPHONE
  // --------------------------------------------------

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        // Recognition may already be running
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Recognition may already be stopped
      }
    }
  };

  // --------------------------------------------------
  // SPEECH RECOGNITION
  // --------------------------------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition is not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      // Don't automatically restart here.
      // It will be started when required.
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
        recognition.abort();
      } catch (error) {}

      recognitionRef.current = null;
    };
  }, []);

  // --------------------------------------------------
  // TOGGLE MICROPHONE
  // --------------------------------------------------

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
      setIsMicOn(false);
    } else {
      setIsMicOn(true);
      startMic();
    }
  };

  // --------------------------------------------------
  // SPEAK TEXT
  // --------------------------------------------------

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(
        humanText
      );

      utterance.voice = selectedVoice;

      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);

        stopMic();

        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      };

      utterance.onend = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      utterance.onerror = () => {
        setIsAIPlaying(false);
        setSubtitle("");
        resolve();
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  // --------------------------------------------------
  // INTRO + QUESTION SPEAKING
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedVoice) return;

    const runInterviewSpeech = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((resolve) =>
          setTimeout(resolve, 800)
        );

        if (currentIndex === questions.length - 1) {
          await speakText(
            "Alright, this one might be a bit more challenging."
          );
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }
    };

    runInterviewSpeech();
  }, [
    selectedVoice,
    isIntroPhase,
    currentIndex,
  ]);

  // --------------------------------------------------
  // RESET TIMER WHEN QUESTION CHANGES
  // --------------------------------------------------

  useEffect(() => {
    if (!currentQuestion) return;

    setTimeLeft(currentQuestion.timeLimit || 60);
  }, [currentIndex, currentQuestion]);

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
    if (feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    isIntroPhase,
    currentIndex,
    isSubmitting,
    feedback,
    currentQuestion,
  ]);

  // --------------------------------------------------
  // AUTO SUBMIT WHEN TIMER REACHES ZERO
  // --------------------------------------------------

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (
      timeLeft === 0 &&
      !isSubmitting &&
      !feedback
    ) {
      submitAnswer();
    }
  }, [timeLeft]);

  // --------------------------------------------------
  // SUBMIT ANSWER
  // --------------------------------------------------

  const submitAnswer = async () => {
    if (isSubmitting) return;
    if (feedback) return;
    if (!currentQuestion) return;

    stopMic();

    setIsSubmitting(true);

    try {
      const result = await axios.post(
        import.meta.env.VITE_SERVER_URL +
          "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken:
            currentQuestion.timeLimit - timeLeft,
        },
        {
          withCredentials: true,
        }
      );

      setFeedback(result.data.feedback);

      await speakText(result.data.feedback);

      setIsSubmitting(false);
    } catch (error) {
      console.log(
        "Submit answer error:",
        error
      );

      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // NEXT QUESTION
  // --------------------------------------------------

  const handleNext = async () => {
    stopMic();

    setAnswer("");
    setFeedback("");

    // Last question
    if (currentIndex + 1 >= questions.length) {
      await finishInterview();
      return;
    }

    await speakText(
      "Alright, let's move to the next question."
    );

    const nextIndex = currentIndex + 1;

    setCurrentIndex(nextIndex);

    setTimeLeft(
      questions[nextIndex]?.timeLimit || 60
    );

    setTimeout(() => {
      if (isMicOn) {
        startMic();
      }
    }, 500);
  };

  // --------------------------------------------------
  // FINISH INTERVIEW
  // --------------------------------------------------

  const finishInterview = async () => {
    stopMic();

    setIsMicOn(false);

    try {
      const result = await axios.post(
        import.meta.env.VITE_SERVER_URL +
          "/api/interview/finish",
        {
          interviewId,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Final Result:", result.data);

      onFinish(result.data);
    } catch (error) {
      console.log(
        "Finish interview error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // CLEANUP ON UNMOUNT
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch (error) {}
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-200">

          {/* VIDEO */}
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* SUBTITLE */}
          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* TIMER BOX */}
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Interview Status
              </span>

              {isAIPlaying && (
                <span className="text-emerald-600 font-semibold text-sm">
                  AI Speaking
                </span>
              )}
            </div>d

            <div className="h-px bg-gray-200"></div>

            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="grid grid-cols-2 gap-6 text-center">

              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  {currentIndex + 1}
                </span>

                <span className="block text-xs text-gray-400">
                  Current Question
                </span>
              </div>

              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  {questions.length}
                </span>

                <span className="block text-xs text-gray-400">
                  Total Questions
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative">

          <div>

            <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
              AI Smart Interview
            </h2>

            {/* QUESTION */}
            {!isIntroPhase && (
              <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">

                <p className="text-xs sm:text-sm text-gray-400 mb-2">
                  Question {currentIndex + 1} of{" "}
                  {questions.length}
                </p>

                <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                  {currentQuestion?.question}
                </div>

              </div>
            )}

            {/* ANSWER */}
            <textarea
              placeholder="Type your answer here..."
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
              value={answer}
              rows={10}
              disabled={isSubmitting || !!feedback}
              className="w-full bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800 disabled:opacity-70"
            />

          </div>

          {/* ACTIONS */}
          <div>

            {!feedback ? (
              <div className="flex items-center gap-4 mt-6">

                {/* MIC */}
                <motion.button
                  onClick={toggleMic}
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg shrink-0 disabled:opacity-50"
                >
                  {isMicOn ? (
                    <FaMicrophone size={20} />
                  ) : (
                    <FaMicrophoneSlash size={20} />
                  )}
                </motion.button>

                {/* SUBMIT */}
                <motion.button
                  onClick={submitAnswer}
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500 disabled:opacity-70"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Submit Answer"}
                </motion.button>

              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
              >

                <p className="text-emerald-700 font-medium mb-4">
                  {feedback}
                </p>

                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  {currentIndex + 1 >= questions.length
                    ? "Finish Interview"
                    : "Next Question"}

                  <BsArrowRight size={18} />
                </button>

              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;