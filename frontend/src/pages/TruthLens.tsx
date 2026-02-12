import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion, type Variants } from "motion/react";
import { TruthLensLogo } from "@/components/icons/TruthLens";
import {
  Camera,
  Upload,
  Images,
  Rss,
  User,
  ShieldCheck,
  Fingerprint,
  ChevronRight,
} from "lucide-react";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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

export default function TruthLensDashboard() {
  const { user } = useAuth();

  // Updated Quick Links with Icons and distinct styling logic
  const actions = [
    {
      title: "Upload & Verify",
      description: "Check media authenticity.",
      to: "/gallary", // reuse gallery route for now
      icon: Upload,
      primary: false,
    },
    {
      title: "Gallery",
      description: "View your secured proofs.",
      to: "/gallary",
      icon: Images,
      primary: false,
    },
    {
      title: "Feeds",
      description: "Global verified news. (placeholder)",
      to: "/TruthLens", // keep user on dashboard until feeds exist
      icon: Rss,
      primary: false,
    },
    {
      title: "Profile",
      description: "Wallet & Identity. (placeholder)",
      to: "/TruthLens", // replace when profile route exists
      icon: User,
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Background Grid Pattern for Technical Feel */}
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
        className="relative z-10 mx-auto max-w-md md:max-w-4xl px-6 py-8 space-y-8"
      >
        {/* --- Header Section --- */}
        <header className="flex flex-col gap-2 pt-4">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="bg-black text-white p-1.5 rounded-sm">
                <TruthLensLogo height={24} width={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-wider uppercase">
                TruthLens
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono border border-gray-200 px-3 py-1 rounded-full bg-gray-50">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              BLOCKCHAIN + AI
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-1 mt-4 inline-flex gap-2"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Welcome back,
            </p>
            <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase ">
              {user?.name || "Observer"}
            </h2>
          </motion.div>
        </header>

        {/* --- Hero Action: CAPTURE (The most important button) --- */}
        <motion.section variants={itemVariants}>
          <Link to="/Capture">
            {/* Assuming Gallery is camera route for now */}
            <div className="group relative overflow-hidden rounded-3xl bg-black text-white p-8 shadow-xl cursor-pointer transition-transform transform active:scale-95 hover:scale-[1.02]">
              {/* Background Animation inside the card */}
              <div className="absolute inset-0 bg-linear-to-br from-neutral-800 to-black z-0" />
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-br from-transparent via-white to-transparent opacity-20 animate-scan" />

              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4 py-6">
                <div className="relative">
                  {/* Animated Rings around camera */}
                  <div className="absolute inset-0 border border-white/20 rounded-full scale-150 animate-ping duration-3000" />
                  <div className="bg-white text-black p-5 rounded-full mb-2 shadow-lg shadow-white/10">
                    <Camera size={42} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">New Capture</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    Generate immutable proof
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* --- Dashboard Grid (Bento Box Style) --- */}
        <motion.section
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {actions.map((item) => (
            <Link key={item.title} to={item.to} className="col-span-1">
              <Card className="h-full border-2 border-gray-100 bg-gray-50/50 hover:bg-white hover:border-black transition-all duration-300 group cursor-pointer p-4 flex flex-col justify-between">
                <div className="mb-4 bg-white w-fit p-3 rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                  <item.icon
                    size={20}
                    className="text-gray-600 group-hover:text-black"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm group-hover:underline decoration-1 underline-offset-4">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    {item.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </motion.section>

        {/* --- Status & Education Section --- */}
        <motion.section
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-4"
        >
          {/* Recent Activity / Status */}
          <Card className="p-6 border-black/5 bg-white shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Fingerprint size={20} className="text-black" />
              <h3 className="font-bold text-sm uppercase tracking-wide">
                Verification Status
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-500">Last Proof</span>
                <span className="font-mono text-xs">...8x29a</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                Waiting for input...
              </div>
            </div>
          </Card>

          {/* Security Tip */}
          <Link to="/guide">
            <Card className="p-6 bg-black text-white h-full flex flex-row items-center justify-between group cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                  <ShieldCheck size={14} />
                  <span>Security</span>
                </div>
                <h3 className="font-bold text-lg">How it works</h3>
                <p className="text-xs text-gray-400">
                  Understanding "Glass-to-Chain"
                </p>
              </div>
              <ChevronRight className="text-gray-500 group-hover:text-white transition-colors" />
            </Card>
          </Link>
        </motion.section>
      </motion.div>
    </div>
  );
}
