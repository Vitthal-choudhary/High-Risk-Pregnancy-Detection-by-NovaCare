"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, X, Loader2, AlertCircle } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { useRouter } from "next/navigation";
import { parseFile } from "@/lib/parser";
import clsx from "clsx";

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

const ACCEPTED = ".pdf,.csv,.json";

function isAccepted(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.endsWith(".csv") ||
    file.name.endsWith(".json")
  );
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const sizeKB = (file.size / 1024).toFixed(1);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="glass-cyan rounded-lg px-4 py-3 flex items-center gap-3"
    >
      <FileText size={18} className="text-cyan-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{file.name}</p>
        <p className="text-slate-500 text-xs">{sizeKB} KB</p>
      </div>
      <button
        onClick={onRemove}
        className="text-slate-500 hover:text-red-400 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export function DropZone() {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
    const dropped = Array.from(e.dataTransfer.files).filter(isAccepted);
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleAnalyze = async () => {
    if (!files.length) return;
    setState("uploading");
    setErrorMsg("");
    try {
      const result = await parseFile(files[0]);
      sessionStorage.setItem("prenatalAnalysis", JSON.stringify(result));
      setState("success");
      await new Promise((r) => setTimeout(r, 600));
      router.push("/results");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to parse file. Please check the format and try again.");
      setState("error");
    }
  };

  const isDragging = state === "dragging";
  const isUploading = state === "uploading";

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Drop area */}
      <motion.label
        onDragOver={(e) => {
          e.preventDefault();
          setState("dragging");
        }}
        onDragLeave={() => setState("idle")}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={clsx(
          "relative block cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center",
          "transition-all duration-300",
          isDragging
            ? "border-cyan-400 bg-cyan-500/10 glow-cyan"
            : "border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5"
        )}
      >
        <input
          type="file"
          multiple
          accept={ACCEPTED}
          className="sr-only"
          onChange={handleFileInput}
        />

        <motion.div
          animate={isDragging ? { scale: 1.3, y: -8 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex justify-center mb-4"
        >
          <div
            className={clsx(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
              isDragging ? "glass-cyan glow-cyan" : "glass"
            )}
          >
            <Upload
              size={28}
              className={isDragging ? "text-cyan-400" : "text-slate-400"}
            />
          </div>
        </motion.div>

        <p
          className={clsx(
            "font-semibold text-lg mb-1 transition-colors duration-300",
            isDragging ? "text-cyan-300" : "text-white"
          )}
        >
          {isDragging ? "Drop files here" : "Drag & drop your files"}
        </p>
        <p className="text-slate-500 text-sm">
          or <span className="text-cyan-400 underline">browse files</span>
        </p>
        <p className="text-slate-600 text-xs mt-3">
          Supports PDF reports, CSV lab data, and JSON patient records
        </p>

        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: "inset 0 0 40px rgba(34,211,238,0.1)" }}
          />
        )}
      </motion.label>

      {/* File list */}
      <AnimatePresence>
        {files.map((f, i) => (
          <FilePreview
            key={`${f.name}-${i}`}
            file={f}
            onRemove={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
          />
        ))}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {state === "error" && errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 flex gap-2 items-start"
          >
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze button */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <GlowButton
              variant="cyan"
              size="lg"
              className="w-full"
              onClick={handleAnalyze}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing with AI...
                </>
              ) : state === "success" ? (
                <>
                  <CheckCircle size={20} />
                  Analysis Complete!
                </>
              ) : (
                <>
                  Analyze {files.length} File{files.length > 1 ? "s" : ""}
                </>
              )}
            </GlowButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
