import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  RefreshCcw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  Cpu,
  Hash,
  Clock,
} from "lucide-react";

// Shadcn UI Imports (Assuming standard path)
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Context & Logic
import { useAuth } from "../contexts/AuthContext";
import { hashImage, createVerification } from "../lib/verification";

// Animation Variants (Matching your Dashboard)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export default function Capture() {
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(""); // UI sugar for "Hashing..." -> "Minting..."
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setError("");
    }
  };

  const retake = () => {
    setImage(null);
    setResult(null);
    setError("");
  };

  const verifyAndSave = async () => {
    if (!image || !user) return;

    setProcessing(true);
    setError("");

    // Simulate the steps for the UX "Wow" factor
    const steps = [
      "Hashing Image...",
      "Analyzing with AI...",
      "Minting Proof to Blockchain...",
    ];
    let stepIndex = 0;

    // Simple interval to cycle text (strictly visual)
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 800);

    try {
      const imageHash = await hashImage(image);

      const verification = await createVerification({
        userId: user.id,
        imageHash,
        imageBase64: image,
        location: null,
        isPrivate: false,
      });

      setResult(verification);
    } catch (err: any) {
      setError(err.message || "Failed to verify image");
    } finally {
      clearInterval(interval);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl mx-auto px-4 py-6 min-h-screen flex flex-col"
      >
        {/* Header / Nav */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-6"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <Badge
            variant="outline"
            className="font-mono text-xs border-gray-200"
          >
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2 animate-pulse" />
            SECURE LINK ACTIVE
          </Badge>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col justify-center"
        >
          {/* Main Title */}
          {!result && (
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Capture Reality
              </h1>
              <p className="text-gray-500 text-sm">
                Generate immutable proof of this moment.
              </p>
            </div>
          )}

          {/* ERROR DISPLAY */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- STATE: SUCCESS / VERIFIED --- */}
          {result ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full"
            >
              <Card className="border-2 border-green-600/20 shadow-xl overflow-hidden bg-white">
                <div className="bg-green-50/50 p-4 border-b border-green-100 flex items-center gap-3">
                  <CheckCircle2 className="text-green-600 h-6 w-6" />
                  <div>
                    <h3 className="font-bold text-green-900">
                      Verified Immutable
                    </h3>
                    <p className="text-xs text-green-700">
                      Successfully minted to Polygon Mumbai
                    </p>
                  </div>
                </div>

                <div className="p-0">
                  {/* Image Preview with Watermark style overlay */}
                  <div className="relative aspect-video bg-black w-full overflow-hidden">
                    <img
                      src={image!}
                      alt="Verified"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                      <p className="text-white/80 font-mono text-[10px]">
                        {result.verification.imageHash.substring(0, 32)}...
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Grid of Data */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                          Time Stamp
                        </p>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <Clock size={12} className="text-gray-400" />
                          {new Date(
                            result.verification.timestamp
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                          IPFS CID
                        </p>
                        <div className="flex items-center gap-2 font-mono text-xs truncate">
                          <Hash size={12} className="text-gray-400" />
                          {result.verification.ipfsCid?.substring(0, 12)}...
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Transaction */}
                    {result.verification.blockchainTxHash && (
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                          Blockchain Transaction
                        </p>
                        <a
                          href={
                            result.verification.blockExplorerUrl ||
                            `https://polygonscan.com/tx/${result.verification.blockchainTxHash}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-mono text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          <ShieldCheck size={12} />
                          {result.verification.blockchainTxHash.substring(
                            0,
                            16
                          )}
                          ...
                        </a>
                      </div>
                    )}

                    <Separator />

                    {/* AI Analysis Block */}
                    {result.verification.aiAnalysis && (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu size={14} className="text-blue-600" />
                          <span className="text-xs font-bold uppercase text-blue-900">
                            AI Context Analysis
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {result.verification.aiAnalysis.description ||
                            "Analysis confirmed. No anomalies detected."}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={retake}
                      className="w-full bg-black text-white hover:bg-neutral-800"
                    >
                      Capture Another
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            /* --- STATE: CAMERA / PREVIEW --- */
            <Card className="overflow-hidden border-0 shadow-2xl bg-black rounded-3xl relative ring-4 ring-neutral-100">
              <div className="relative aspect-3/4 md:aspect-4/3 w-full bg-black flex flex-col">
                {/* Viewfinder Overlay (The "Scanner" Look) */}
                <div className="absolute inset-4 z-20 pointer-events-none border-2 border-white/20 rounded-2xl flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-l-2 border-t-2 border-white" />
                    <div className="w-4 h-4 border-r-2 border-t-2 border-white" />
                  </div>

                  {/* Center Crosshair */}
                  {!image && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-50">
                      <div className="absolute top-1/2 w-full h-[1px] bg-white"></div>
                      <div className="absolute left-1/2 h-full w-[1px] bg-white"></div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-l-2 border-b-2 border-white" />
                    <div className="w-4 h-4 border-r-2 border-b-2 border-white" />
                  </div>
                </div>

                {/* Camera / Image Render */}
                <div className="flex-1 relative overflow-hidden rounded-xl">
                  {!image ? (
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                      videoConstraints={{ facingMode: "environment" }} // Changed to environment for "World facing"
                      forceScreenshotSourceSize={true}
                    />
                  ) : (
                    <img
                      src={image}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Controls Area (Bottom of the 'Screen') */}
                <div className="bg-black/90 backdrop-blur-sm p-6 pb-8 z-30">
                  <div className="flex gap-4 items-center justify-center">
                    {!image ? (
                      <button
                        onClick={captureImage}
                        className="group relative flex items-center justify-center"
                      >
                        <div className="w-20 h-20 rounded-full border-4 border-white/30 transition-all group-active:scale-95" />
                        <div className="absolute w-16 h-16 bg-white rounded-full transition-all group-hover:scale-90" />
                      </button>
                    ) : (
                      <div className="flex w-full gap-3">
                        <Button
                          variant="outline"
                          onClick={retake}
                          className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white h-12"
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" /> Retake
                        </Button>

                        <Button
                          onClick={verifyAndSave}
                          disabled={processing}
                          className="flex-1 bg-white text-black hover:bg-neutral-200 h-12 font-semibold"
                        >
                          {processing ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              <span>{loadingStep || "Processing"}</span>
                            </div>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-4 w-4" /> Verify &
                              Mint
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Footer Note */}
          {!result && (
            <p className="text-center text-xs text-gray-400 mt-6 font-mono">
              GLASS-TO-CHAIN PROTOCOL v1.0
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
