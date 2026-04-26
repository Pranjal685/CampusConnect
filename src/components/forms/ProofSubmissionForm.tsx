"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Link2, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ProofSubmissionFormProps {
  taskId: string;
  onSubmit: (data: { proof_text: string; proof_url: string }) => void;
}

export default function ProofSubmissionForm({ taskId, onSubmit }: ProofSubmissionFormProps) {
  const [proofText, setProofText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ proof_text: proofText, proof_url: proofUrl });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Proof Submitted!</h3>
        <p className="text-sm text-[#6b6b8a]">
          Your submission is under review. Points will be awarded once approved.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass p-5 space-y-4"
    >
      <h3 className="text-sm font-semibold text-white mb-1">Submit Your Proof</h3>

      <div>
        <Label className="label-text mb-1.5">Describe what you did</Label>
        <Textarea
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          placeholder="I posted on LinkedIn and got 200+ impressions. I tagged 5 connections including..."
          className="glass border-white/10 text-white text-sm min-h-[100px]"
          required
        />
      </div>

      <div>
        <Label className="label-text mb-1.5 flex items-center gap-1">
          <Link2 className="w-3 h-3" /> Proof Link (optional)
        </Label>
        <Input
          type="url"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          placeholder="https://linkedin.com/posts/your-post"
          className="glass border-white/10 text-white text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white transition-colors"
      >
        <Send className="w-4 h-4" />
        Submit Proof
      </button>
    </motion.form>
  );
}
