import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

const cooperationOptions = [
  { value: "技术合作", label: "技术合作", icon: "⚙️", desc: "Tech Partnership" },
  { value: "市场推广", label: "市场推广", icon: "📣", desc: "Marketing" },
  { value: "投资对接", label: "投资对接", icon: "💰", desc: "Investment" },
  { value: "教育合作", label: "教育合作", icon: "🎓", desc: "Education" },
  { value: "其他", label: "其他", icon: "✨", desc: "Others" },
] as const;

const formSchema = z.object({
  companyName: z.string().min(1, "请填写公司名称").max(256),
  contactName: z.string().min(1, "请填写联系人姓名").max(128),
  contactInfo: z.string().min(1, "请填写联系方式（邮箱或电话）").max(320),
  cooperationIntent: z.enum(["技术合作", "市场推广", "投资对接", "教育合作", "其他"]).refine((v) => !!v, { message: "请选择合作意图" }),
  additionalNotes: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Particle burst */}
      <div className="relative mb-8">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? "#31D9FF" : i % 3 === 1 ? "#FF4FD8" : "#5BFFB2",
              top: "50%",
              left: "50%",
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * (60 + Math.random() * 40),
              y: Math.sin((i * 30 * Math.PI) / 180) * (60 + Math.random() * 40),
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          />
        ))}

        {/* Success circle */}
        <motion.div
          className="success-circle w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(49,217,255,0.2), rgba(91,255,178,0.2))",
            border: "2px solid rgba(49,217,255,0.5)",
            boxShadow: "0 0 60px rgba(49,217,255,0.3)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              className="check-path"
              d="M12 24L20 32L36 16"
              stroke="#31D9FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-3xl font-black mb-3"
        style={{ letterSpacing: "-1px" }}
      >
        <span className="grad-text">申请已成功提交！</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-base mb-2"
        style={{ color: "#B8BCE0" }}
      >
        感谢您的加入意向，AI SpaceHub 团队将在 2-3 个工作日内与您联系。
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="text-sm mb-10"
        style={{ color: "#8B8FBF" }}
      >
        Thank you for your interest. Our team will reach out within 2–3 business days.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        onClick={onReset}
        className="px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.16)",
          color: "#E5E7FF",
        }}
        whileHover={{ background: "rgba(255,255,255,0.12)" }}
      >
        再次提交 / Submit Another
      </motion.button>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const submitMutation = trpc.partnerApplication.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error("提交失败，请稍后重试", { description: err.message });
    },
  });

  const onSubmit = (data: FormValues) => {
    submitMutation.mutate(data);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedIntent("");
    reset();
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(255,79,216,.22), transparent 28%), radial-gradient(circle at 88% 5%, rgba(49,217,255,.18), transparent 26%), radial-gradient(circle at 70% 80%, rgba(139,92,255,.18), transparent 30%), linear-gradient(180deg,#080A1F 0%,#101135 50%,#07091C 100%)",
      }}
    >
      {/* Noise overlay */}
      <div className="noise-overlay" />

      <div className="container relative z-10">
        {/* ── Navigation ── */}
        <nav className="flex justify-between items-center py-7">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm"
              style={{
                background: "linear-gradient(135deg,#FF4FD8,#8B5CFF,#31D9FF)",
                boxShadow: "0 0 30px rgba(139,92,255,.5)",
                color: "#080A1F",
              }}
            >
              AI
            </div>
            <span className="font-black text-base tracking-tight" style={{ color: "#F7F8FF" }}>
              AI SpaceHub
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs px-4 py-2 rounded-full hidden sm:block"
              style={{
                border: "1px solid rgba(255,255,255,.16)",
                background: "rgba(255,255,255,.05)",
                color: "#B8BCE0",
              }}
            >
              Global AI Ecosystem Platform
            </span>
            <Link href="/admin">
              <span
                className="text-xs px-4 py-2 rounded-full cursor-pointer transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,.16)",
                  background: "rgba(255,255,255,.05)",
                  color: "#B8BCE0",
                }}
              >
                管理员 / Admin
              </span>
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="pt-8 pb-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-bold"
            style={{
              border: "1px solid rgba(255,255,255,.16)",
              background: "rgba(255,255,255,.07)",
              color: "#DDE2FF",
              backdropFilter: "blur(16px)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full pulse-dot"
              style={{ background: "#5BFFB2", boxShadow: "0 0 12px #5BFFB2" }}
            />
            Ecosystem Partnership Application · 生态合作申请
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-black mb-4"
            style={{ fontSize: "clamp(36px,6vw,72px)", lineHeight: 1, letterSpacing: "-3px" }}
          >
            <span className="grad-text">加入 AI SpaceHub</span>
            <br />
            <span style={{ color: "#F7F8FF" }}>全球生态共创网络</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base max-w-xl mx-auto mb-10"
            style={{ color: "#B8BCE0", lineHeight: 1.75 }}
          >
            填写以下表单，加入我们覆盖新加坡、东南亚、中东、澳洲的全球 AI 生态网络，共同推动 AI
            技术从创新走向商业落地。
          </motion.p>
        </div>

        {/* ── Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div
            className="p-1 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,79,216,0.4), rgba(139,92,255,0.4), rgba(49,217,255,0.4))",
            }}
          >
            <div
              className="rounded-[22px] p-8 sm:p-10"
              style={{
                background: "linear-gradient(180deg, rgba(18,20,51,0.95) 0%, rgba(8,10,31,0.98) 100%)",
                backdropFilter: "blur(24px)",
              }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <SuccessScreen key="success" onReset={handleReset} />
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Company Name */}
                    <div className="form-input-glow rounded-2xl transition-all">
                      <label className="block text-xs font-bold mb-2" style={{ color: "#8B8FBF" }}>
                        公司名称 <span style={{ color: "#FF4FD8" }}>*</span>
                        <span className="ml-2 font-normal" style={{ color: "#555A8A" }}>
                          Company Name
                        </span>
                      </label>
                      <input
                        {...register("companyName")}
                        placeholder="请输入您的公司名称"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#F7F8FF",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(49,217,255,0.5)";
                          e.target.style.background = "rgba(49,217,255,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.12)";
                          e.target.style.background = "rgba(255,255,255,0.06)";
                        }}
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-xs" style={{ color: "#FF4FD8" }}>
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>

                    {/* Contact Name */}
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: "#8B8FBF" }}>
                        联系人姓名 <span style={{ color: "#FF4FD8" }}>*</span>
                        <span className="ml-2 font-normal" style={{ color: "#555A8A" }}>
                          Contact Person
                        </span>
                      </label>
                      <input
                        {...register("contactName")}
                        placeholder="请输入联系人姓名"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#F7F8FF",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(49,217,255,0.5)";
                          e.target.style.background = "rgba(49,217,255,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.12)";
                          e.target.style.background = "rgba(255,255,255,0.06)";
                        }}
                      />
                      {errors.contactName && (
                        <p className="mt-1 text-xs" style={{ color: "#FF4FD8" }}>
                          {errors.contactName.message}
                        </p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: "#8B8FBF" }}>
                        联系方式 <span style={{ color: "#FF4FD8" }}>*</span>
                        <span className="ml-2 font-normal" style={{ color: "#555A8A" }}>
                          Email / Phone
                        </span>
                      </label>
                      <input
                        {...register("contactInfo")}
                        placeholder="邮箱或电话，例如：hello@company.com"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#F7F8FF",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(49,217,255,0.5)";
                          e.target.style.background = "rgba(49,217,255,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.12)";
                          e.target.style.background = "rgba(255,255,255,0.06)";
                        }}
                      />
                      {errors.contactInfo && (
                        <p className="mt-1 text-xs" style={{ color: "#FF4FD8" }}>
                          {errors.contactInfo.message}
                        </p>
                      )}
                    </div>

                    {/* Cooperation Intent */}
                    <div>
                      <label className="block text-xs font-bold mb-3" style={{ color: "#8B8FBF" }}>
                        合作意图 <span style={{ color: "#FF4FD8" }}>*</span>
                        <span className="ml-2 font-normal" style={{ color: "#555A8A" }}>
                          Cooperation Intent
                        </span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {cooperationOptions.map((opt) => {
                          const isSelected = selectedIntent === opt.value;
                          return (
                            <motion.button
                              key={opt.value}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                setSelectedIntent(opt.value);
                                setValue("cooperationIntent", opt.value, { shouldValidate: true });
                              }}
                              className="relative flex flex-col items-center gap-1 px-3 py-4 rounded-2xl text-sm font-bold transition-all"
                              style={{
                                background: isSelected
                                  ? "linear-gradient(135deg, rgba(49,217,255,0.15), rgba(91,255,178,0.1))"
                                  : "rgba(255,255,255,0.05)",
                                border: isSelected
                                  ? "1px solid rgba(49,217,255,0.5)"
                                  : "1px solid rgba(255,255,255,0.1)",
                                color: isSelected ? "#31D9FF" : "#8B8FBF",
                                boxShadow: isSelected ? "0 0 20px rgba(49,217,255,0.15)" : "none",
                              }}
                            >
                              <span className="text-xl">{opt.icon}</span>
                              <span className="text-xs font-black">{opt.label}</span>
                              <span className="text-xs font-normal" style={{ color: isSelected ? "#5BFFB2" : "#555A8A" }}>
                                {opt.desc}
                              </span>
                              {isSelected && (
                                <motion.div
                                  layoutId="intent-indicator"
                                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                                  style={{ background: "#31D9FF", boxShadow: "0 0 8px #31D9FF" }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      {errors.cooperationIntent && (
                        <p className="mt-2 text-xs" style={{ color: "#FF4FD8" }}>
                          {errors.cooperationIntent.message}
                        </p>
                      )}
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: "#8B8FBF" }}>
                        补充说明
                        <span className="ml-2 font-normal" style={{ color: "#555A8A" }}>
                          Additional Notes (optional)
                        </span>
                      </label>
                      <textarea
                        {...register("additionalNotes")}
                        rows={4}
                        placeholder="请简要描述您的合作设想、资源背景或其他希望告知我们的信息..."
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#F7F8FF",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(49,217,255,0.5)";
                          e.target.style.background = "rgba(49,217,255,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.12)";
                          e.target.style.background = "rgba(255,255,255,0.06)";
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={submitMutation.isPending}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-2xl font-black text-base transition-all relative overflow-hidden"
                      style={{
                        background: submitMutation.isPending
                          ? "rgba(255,255,255,0.1)"
                          : "linear-gradient(90deg, #31D9FF, #5BFFB2)",
                        color: submitMutation.isPending ? "#8B8FBF" : "#080A1F",
                        boxShadow: submitMutation.isPending
                          ? "none"
                          : "0 20px 50px rgba(49,217,255,0.3)",
                        cursor: submitMutation.isPending ? "not-allowed" : "pointer",
                      }}
                    >
                      {submitMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle
                              cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="3"
                              strokeDasharray="60" strokeDashoffset="20"
                            />
                          </svg>
                          提交中... Submitting
                        </span>
                      ) : (
                        "提交申请 · Submit Application →"
                      )}
                      {!submitMutation.isPending && (
                        <div
                          className="absolute inset-0 shimmer opacity-30"
                          style={{ pointerEvents: "none" }}
                        />
                      )}
                    </motion.button>

                    <p className="text-center text-xs" style={{ color: "#555A8A" }}>
                      提交即表示您同意 AI SpaceHub 团队与您联系 · By submitting, you agree to be contacted by our team.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <footer className="pb-12 text-center text-xs" style={{ color: "#555A8A" }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs"
              style={{
                background: "linear-gradient(135deg,#FF4FD8,#8B5CFF,#31D9FF)",
                color: "#080A1F",
              }}
            >
              AI
            </div>
            <span className="font-bold" style={{ color: "#8B8FBF" }}>AI SpaceHub</span>
          </div>
          <p>© 2025 AI SpaceHub · Global AI Ecosystem Platform · Singapore</p>
        </footer>
      </div>
    </div>
  );
}
