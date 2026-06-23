import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

// ─── Constants ────────────────────────────────────────────────────────────────

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
  cooperationIntent: z
    .enum(["技术合作", "市场推广", "投资对接", "教育合作", "其他"])
    .refine((v) => !!v, { message: "请选择合作意图" }),
  additionalNotes: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const C = {
  pink: "#FF4FD8",
  violet: "#9B6FFF",
  cyan: "#2DECFF",
  green: "#4DFFB0",
  gold: "#FFD36E",
  text: "#F7F8FF",
  muted: "#C4C8E8",
  soft: "#E5E7FF",
  line: "rgba(255,255,255,.22)",
  card: "rgba(255,255,255,.09)",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
});

// ─── Input component ──────────────────────────────────────────────────────────

type FormInputProps = {
  as?: "input";
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

type FormTextareaProps = {
  as: "textarea";
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function FormInput(props: FormInputProps | FormTextareaProps) {
  const { as: Tag = "input", error, ...rest } = props as any;
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <Tag
        {...(props as any)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 14,
          fontSize: 14,
          outline: "none",
          background: focused ? "rgba(49,217,255,0.06)" : "rgba(255,255,255,0.06)",
          border: `1.5px solid ${focused ? "rgba(49,217,255,0.55)" : error ? "rgba(255,79,216,0.5)" : "rgba(255,255,255,0.14)"}`,
          color: C.text,
          transition: "all 0.2s",
          resize: Tag === "textarea" ? "none" : undefined,
          boxShadow: focused ? "0 0 0 3px rgba(49,217,255,0.1)" : "none",
        }}
      />
      {error && (
        <p style={{ marginTop: 5, fontSize: 12, color: C.pink }}>{error}</p>
      )}
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 0", textAlign: "center" }}
    >
      <div style={{ position: "relative", marginBottom: 28 }}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: 8, height: 8,
              borderRadius: "50%",
              background: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.pink : C.green,
              top: "50%", left: "50%",
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * (55 + Math.random() * 35),
              y: Math.sin((i * 30 * Math.PI) / 180) * (55 + Math.random() * 35),
              scale: 0, opacity: 0,
            }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          />
        ))}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{
            width: 88, height: 88, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, rgba(49,217,255,0.18), rgba(91,255,178,0.18))",
            border: "2px solid rgba(49,217,255,0.5)",
            boxShadow: "0 0 50px rgba(49,217,255,0.28)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path
              className="check-path"
              d="M10 22L18 30L34 14"
              stroke={C.cyan}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      <motion.h2 {...fadeUp(0.35)} style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>
        <span className="grad-text">申请已成功提交！</span>
      </motion.h2>
      <motion.p {...fadeUp(0.42)} style={{ fontSize: 15, color: C.muted, marginBottom: 6, lineHeight: 1.7 }}>
        感谢您的加入意向，AI SpaceHub 团队将在 2–3 个工作日内与您联系。
      </motion.p>
      <motion.p {...fadeUp(0.46)} style={{ fontSize: 13, color: "#6B6FA0", marginBottom: 36 }}>
        Thank you! Our team will reach out within 2–3 business days.
      </motion.p>
      <motion.button
        {...fadeUp(0.52)}
        onClick={onReset}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "11px 28px", borderRadius: 999, fontWeight: 700, fontSize: 14,
          background: "rgba(255,255,255,0.08)", border: `1px solid ${C.line}`,
          color: C.soft, cursor: "pointer",
        }}
      >
        再次提交 / Submit Another
      </motion.button>
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "7px 14px", borderRadius: 999,
      border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.07)",
      fontSize: 12, fontWeight: 700, color: "#DDE2FF",
      backdropFilter: "blur(12px)", marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const submitMutation = trpc.partnerApplication.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => toast.error("提交失败，请稍后重试", { description: err.message }),
  });

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const onSubmit = (data: FormValues) => submitMutation.mutate(data);

  const handleReset = () => {
    setSubmitted(false);
    setSelectedIntent("");
    reset();
  };

  // ── Shared styles ──
  const sectionStyle: React.CSSProperties = { padding: "60px 0" };
  const h2Style: React.CSSProperties = {
    fontSize: "clamp(24px, 3.8vw, 42px)",
    fontWeight: 900, lineHeight: 1.08,
    letterSpacing: -1.5, margin: 0, color: C.text,
  };
  const cardBase: React.CSSProperties = {
    border: `1px solid ${C.line}`,
    borderRadius: 28,
    background: "linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.045))",
    backdropFilter: "blur(22px)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 12% 8%,rgba(255,79,216,.42),transparent 30%), radial-gradient(circle at 88% 0%,rgba(49,217,255,.36),transparent 28%), radial-gradient(circle at 70% 72%,rgba(139,92,255,.36),transparent 32%), radial-gradient(circle at 40% 55%,rgba(91,255,178,.12),transparent 40%), linear-gradient(180deg,#0C0E2A 0%,#131640 50%,#0A0C22 100%)",
        color: C.text,
        overflowX: "hidden",
        fontFamily: '"Inter","Noto Sans SC",system-ui,sans-serif',
      }}
    >
      <div className="noise-overlay" />

      <div style={{ width: "min(1180px,92vw)", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ══════════════════════════════════════════════════════
            NAV
        ══════════════════════════════════════════════════════ */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 900 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 13,
              background: `linear-gradient(135deg,${C.pink},${C.violet},${C.cyan})`,
              boxShadow: "0 0 30px rgba(139,92,255,.55)",
              display: "grid", placeItems: "center",
              fontWeight: 900, color: "#080A1F", fontSize: 13,
            }}>AI</div>
            <span style={{ fontSize: 16, color: C.text }}>AI SpaceHub</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{
              fontSize: 12, color: C.muted,
              border: `1px solid ${C.line}`, padding: "8px 14px",
              borderRadius: 999, background: "rgba(255,255,255,.05)",
              display: "none",
            }} className="hidden-mobile">Global AI Ecosystem Platform</span>
            <Link href="/admin">
              <span style={{
                fontSize: 12, color: C.muted, cursor: "pointer",
                border: `1px solid ${C.line}`, padding: "8px 14px",
                borderRadius: 999, background: "rgba(255,255,255,.05)",
                transition: "background 0.2s",
              }}>管理员 / Admin</span>
            </Link>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════ */}
        <section style={{ ...sectionStyle, paddingTop: 52, paddingBottom: 40 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.06fr .94fr",
            gap: 40, alignItems: "center",
          }} className="hero-grid">
            {/* Left */}
            <div>
              <motion.div {...fadeUp(0)} style={{ marginBottom: 20 }}>
                <div style={{
                  display: "inline-flex", gap: 8, alignItems: "center",
                  border: `1px solid ${C.line}`, background: "rgba(255,255,255,.07)",
                  padding: "9px 14px", borderRadius: 999,
                  color: "#DDE2FF", fontWeight: 700, fontSize: 12,
                  backdropFilter: "blur(16px)",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 14px ${C.green}` }} className="pulse-dot" />
                  From AI Capability to Global Business Ecosystem
                </div>
              </motion.div>

              <motion.h1 {...fadeUp(0.08)} style={{
                fontSize: "clamp(36px,5.8vw,66px)",
                lineHeight: 1.0, margin: "0 0 20px",
                letterSpacing: -3, fontWeight: 900,
              }}>
                <span className="grad-text">连接全球 AI 创新</span>
                <br />
                <span style={{ color: C.text }}>走向真实商业市场</span>
              </motion.h1>

              <motion.p {...fadeUp(0.14)} style={{
                fontSize: 17, lineHeight: 1.75, color: "#D8DBF8",
                margin: "0 0 28px", maxWidth: 620,
              }}>
                AI SpaceHub 是一个立足新加坡、面向全球 AI 时代的生态连接平台，推动 AI Agent、AIGC、AI 教育、AI 创业与企业 AI 转型从技术创新走向产业协同、市场教育和商业落地。
              </motion.p>

              <motion.div {...fadeUp(0.2)} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={scrollToForm}
                  style={{
                    border: "none", borderRadius: 999, padding: "13px 22px",
                    fontWeight: 800, fontSize: 14, cursor: "pointer",
                    color: "#090B20",
                    background: `linear-gradient(90deg,${C.cyan},${C.green})`,
                    boxShadow: `0 16px 44px rgba(49,217,255,.32)`,
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  生态伙伴共创加入 →
                </button>
                <button style={{
                  borderRadius: 999, padding: "13px 22px",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  color: "#fff", background: "rgba(255,255,255,.08)",
                  border: `1px solid ${C.line}`,
                }}>
                  项目制对外开放｜下月启动
                </button>
              </motion.div>
            </div>

            {/* Right – Orb Card */}
            <motion.div {...fadeUp(0.12)} style={{
              position: "relative", minHeight: 460,
              border: `1px solid ${C.line}`, borderRadius: 36,
              background: "linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.05))",
              boxShadow: "0 28px 80px rgba(0,0,0,.38)",
              overflow: "hidden", backdropFilter: "blur(24px)",
            }}>
              {/* Globe */}
              <div style={{
                position: "absolute", inset: "52px 30px 110px",
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 25%,rgba(255,255,255,.9),rgba(49,217,255,.3) 22%,rgba(139,92,255,.28) 48%,rgba(255,79,216,.2) 70%,transparent 72%)`,
                filter: "drop-shadow(0 0 55px rgba(49,217,255,.28))",
              }} />
              {/* Rings */}
              <div style={{ position: "absolute", left: "50%", top: "45%", width: "84%", height: "42%", border: "1px solid rgba(255,255,255,.35)", borderRadius: "50%", transform: "translate(-50%,-50%) rotate(-14deg)" }} />
              <div style={{ position: "absolute", left: "50%", top: "45%", width: "68%", height: "34%", border: "1px solid rgba(255,255,255,.35)", borderRadius: "50%", transform: "translate(-50%,-50%) rotate(24deg)", opacity: 0.45 }} />

              {/* Nodes */}
              {[
                { label: "United States", style: { left: 40, top: 80 } },
                { label: "China", style: { right: 36, top: 106 } },
                { label: "Australia", style: { left: 54, bottom: 158 } },
                { label: "Middle East", style: { right: 44, bottom: 146 } },
                { label: "Southeast Asia", style: { left: "50%", transform: "translateX(-50%)", bottom: 72 } },
              ].map((n) => (
                <div key={n.label} style={{
                  position: "absolute", padding: "7px 11px", borderRadius: 999,
                  background: "rgba(8,10,31,.72)", border: "1px solid rgba(255,255,255,.2)",
                  fontSize: 11, fontWeight: 800, color: "#F4F7FF",
                  boxShadow: "0 10px 24px rgba(0,0,0,.25)", ...n.style,
                }}>{n.label}</div>
              ))}
              <div style={{
                position: "absolute", left: "42%", top: 196,
                padding: "7px 11px", borderRadius: 999,
                background: `linear-gradient(90deg,${C.pink},${C.violet})`,
                fontSize: 11, fontWeight: 800, color: "#fff",
              }}>Singapore Hub</div>

              {/* Stats */}
              <div style={{
                position: "absolute", left: 18, right: 18, bottom: 18,
                display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10,
              }}>
                {[["10+", "全球关系网络"], ["3", "核心落地项目"], ["1", "AI 可持续社区"]].map(([val, label]) => (
                  <div key={label} style={{
                    background: "rgba(255,255,255,.09)", border: `1px solid ${C.line}`,
                    borderRadius: 18, padding: "13px 10px", textAlign: "center",
                  }}>
                    <b style={{ fontSize: 22, display: "block", color: C.cyan }}>{val}</b>
                    <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 11 }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CORE LOGIC
        ══════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <motion.div {...fadeUp(0)} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
            <h2 style={h2Style}>我们的核心判断</h2>
            <p style={{ color: C.muted, lineHeight: 1.7, maxWidth: 480, margin: 0, fontSize: 14 }}>
              AI 下一阶段的竞争，不只是模型能力和工具能力，而是全球生态、区域市场、产业场景、资本网络和人才系统之间的协同能力。
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="logic-grid">
            {[
              { icon: "🌐", title: "Global Ecosystem", desc: "连接不同区域的 AI 公司、投资机构、教育资源、产业伙伴和本地渠道。", color: C.cyan },
              { icon: "🧭", title: "Market Education", desc: "帮助 AI Agent 公司完成区域市场认知教育、用户启蒙和行业场景转化。", color: C.pink },
              { icon: "🚀", title: "Business Landing", desc: "从工具展示进入真实客户、真实场景、真实收入和长期合作网络。", color: C.violet },
              { icon: "♾️", title: "Human Sustainability", desc: "关注人在智能时代的学习、创造、创业、投资和可持续成长。", color: C.green },
            ].map((card, i) => (
              <motion.div key={card.title} {...fadeUp(i * 0.07)} style={{
                ...cardBase,
                padding: 24, minHeight: 200,
                position: "relative", overflow: "hidden",
                boxShadow: "0 16px 44px rgba(0,0,0,.2)",
              }}>
                <div style={{
                  position: "absolute", inset: "auto -20% -40% -20%", height: 100,
                  background: `radial-gradient(circle,${card.color}40,transparent 62%)`,
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  display: "grid", placeItems: "center",
                  background: `linear-gradient(135deg,${card.color}dd,${C.cyan}bb)`,
                  fontSize: 20, marginBottom: 18,
                }}>{card.icon}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: C.text }}>{card.title}</h3>
                <p style={{ margin: 0, color: C.muted, lineHeight: 1.65, fontSize: 13 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ECOSYSTEM MAP
        ══════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <motion.div {...fadeUp(0)} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
            <h2 style={h2Style}>全球关系网络与平台角色</h2>
            <p style={{ color: C.muted, lineHeight: 1.7, maxWidth: 460, margin: 0, fontSize: 14 }}>
              AI SpaceHub 不是单一活动组织者，而是 AI 公司进入多区域市场的生态连接器、市场教育器和商业化加速器。
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: 22, alignItems: "stretch" }} className="eco-grid">
            {/* Map Panel */}
            <motion.div {...fadeUp(0.06)} style={{ ...cardBase, padding: 28, minHeight: 440, position: "relative", overflow: "hidden" }}>
              {/* Grid */}
              <div style={{
                position: "absolute", inset: 0, opacity: 0.18,
                backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px,transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage: "radial-gradient(circle,#000 35%,transparent 78%)",
              }} />
              {/* Hub */}
              <div style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%,-50%)",
                width: 120, height: 120, borderRadius: "50%",
                background: `radial-gradient(circle,#fff 0%,#A5F5FF 15%,${C.violet} 54%,${C.pink} 100%)`,
                display: "grid", placeItems: "center", textAlign: "center",
                fontWeight: 900, color: "#080A1F", fontSize: 13,
                boxShadow: `0 0 60px rgba(139,92,255,.55)`,
              }}>AI<br />SpaceHub</div>

              {/* Cities */}
              {[
                { label: "美国", style: { left: 22, top: 60 } },
                { label: "中国", style: { right: 28, top: 54 } },
                { label: "澳洲", style: { left: 54, top: 166 } },
                { label: "日本", style: { right: 68, top: 170 } },
                { label: "中东", style: { left: 28, bottom: 108 } },
                { label: "马来西亚", style: { right: 32, bottom: 110 } },
                { label: "新加坡", style: { left: "50%", transform: "translateX(-50%)", bottom: 44 } },
                { label: "越南", style: { left: "40%", top: 52 } },
                { label: "泰国", style: { right: 118, bottom: 40 } },
                { label: "菲律宾", style: { left: 108, bottom: 36 } },
              ].map((c) => (
                <div key={c.label} style={{
                  position: "absolute", border: `1px solid ${C.line}`,
                  background: "rgba(8,10,31,.7)", borderRadius: 999,
                  padding: "7px 10px", fontSize: 11, fontWeight: 800,
                  whiteSpace: "nowrap", color: C.text, ...c.style,
                }}>{c.label}</div>
              ))}
            </motion.div>

            {/* Flow Panel */}
            <motion.div {...fadeUp(0.1)} style={{ ...cardBase, padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { num: "01", title: "筛选优质 AI Agent 与 AIGC 项目", desc: "识别具备技术能力、场景价值和全球化潜力的 AI 公司与创业项目。" },
                { num: "02", title: "构建区域市场教育与内容传播", desc: "通过培训、活动、社群、课程和本地内容，降低用户认知门槛。" },
                { num: "03", title: "连接渠道、企业客户与合作伙伴", desc: "对接本地资源、行业客户、教育机构、投资机构和生态组织。" },
                { num: "04", title: "推动商业转化、孵化与全球扩张", desc: "以项目制推进真实交付，形成区域试点、复制增长和资本对接。" },
              ].map((step, i) => (
                <motion.div key={step.num} {...fadeUp(0.08 + i * 0.06)} style={{
                  display: "grid", gridTemplateColumns: "52px 1fr", gap: 14,
                  alignItems: "start", padding: "16px 18px", borderRadius: 22,
                  background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: "rgba(255,255,255,.1)",
                    display: "grid", placeItems: "center",
                    fontWeight: 900, color: C.cyan, fontSize: 17,
                  }}>{step.num}</div>
                  <div>
                    <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 800, color: C.text }}>{step.title}</h3>
                    <p style={{ margin: 0, color: C.muted, lineHeight: 1.6, fontSize: 13 }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            PROJECTS
        ══════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <motion.div {...fadeUp(0)} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
            <h2 style={h2Style}>三个正在落地的核心项目</h2>
            <p style={{ color: C.muted, lineHeight: 1.7, maxWidth: 460, margin: 0, fontSize: 14 }}>
              从投资认知、内容生产到创业教育，AI SpaceHub 以项目为抓手，形成可复制的全球生态增长模型。
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }} className="projects-grid">
            {[
              {
                tag: "Project 01｜Singapore & SEA",
                title: "AI 时代下的投资逻辑",
                desc: "面向投资人、创业者、高净值人群、金融科技平台和商业社群，构建 AI 时代下的投资认知、工具应用和项目连接机制。",
                pills: ["投资培训", "项目推广", "资本连接"],
                accent: C.cyan,
              },
              {
                tag: "Project 02｜Malaysia Pilot",
                title: "AIGC 视频工具应用推广",
                desc: "以马来西亚为试点，推动 AIGC 视频工具在内容创作、企业营销、教育培训、品牌传播和商业转化中的应用。",
                pills: ["工具培训", "内容实战", "商业变现"],
                accent: C.pink,
              },
              {
                tag: "Project 03｜AI Entrepreneurship",
                title: "AI 创业研究院文凭教育",
                desc: "筛选优质 AI 创业导师，让学生参与真实创业项目，并结合创业基金、产业资源和投融资网络进行后续孵化。",
                pills: ["文凭教育", "创业实践", "基金孵化"],
                accent: C.violet,
              },
            ].map((proj, i) => (
              <motion.div key={proj.tag} {...fadeUp(i * 0.08)} style={{
                ...cardBase,
                padding: 26, minHeight: 320,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", width: 160, height: 160, borderRadius: "50%",
                  right: -56, top: -56,
                  background: `radial-gradient(circle,${proj.accent}44,transparent 68%)`,
                }} />
                <div style={{
                  display: "inline-flex", borderRadius: 999, padding: "7px 12px",
                  background: "rgba(255,255,255,.08)", border: `1px solid ${C.line}`,
                  fontSize: 11, fontWeight: 900, color: "#D9F8FF", marginBottom: 16,
                }}>{proj.tag}</div>
                <h3 style={{ fontSize: 21, margin: "0 0 12px", lineHeight: 1.2, fontWeight: 900, color: C.text }}>{proj.title}</h3>
                <p style={{ color: C.muted, lineHeight: 1.72, margin: "0 0 16px", fontSize: 13 }}>{proj.desc}</p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {proj.pills.map((p) => (
                    <span key={p} style={{
                      fontSize: 11, padding: "6px 10px", borderRadius: 999,
                      background: `${proj.accent}18`, color: proj.accent,
                      border: `1px solid ${proj.accent}40`, fontWeight: 700,
                    }}>{p}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            COMMUNITY
        ══════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <motion.div {...fadeUp(0)} style={{
            ...cardBase,
            padding: "36px 40px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
            alignItems: "center", overflow: "hidden", position: "relative",
          }} className="community-grid">
            <div style={{
              position: "absolute", right: -100, bottom: -120, width: 340, height: 340, borderRadius: "50%",
              background: `radial-gradient(circle,${C.pink}22,transparent 70%)`,
            }} />
            <div style={{ position: "relative" }}>
              <SectionLabel>AI 可持续社区</SectionLabel>
              <p style={{
                fontSize: "clamp(20px,2.6vw,30px)", lineHeight: 1.22,
                fontWeight: 900, letterSpacing: -1, margin: "0 0 16px", color: C.text,
              }}>
                AI 时代下，人类的可持续发展，不是抵抗智能，而是重新定义人的创造力、连接力与价值位置。
              </p>
              <p style={{ color: C.muted, lineHeight: 1.75, fontSize: 14, margin: 0 }}>
                AI SpaceHub 正在推出面向全球的生态社区，让个人、企业、教育机构、创业者和投资人共同参与，从 AI 的使用者成长为 AI 时代的建设者和受益者。
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, position: "relative" }}>
              {[
                { title: "学习", desc: "建立 AI 时代的新认知、新工具和新能力。", color: C.cyan },
                { title: "创造", desc: "用 AIGC 与 Agent 释放内容、产品和服务创新。", color: C.pink },
                { title: "创业", desc: "通过真实项目、导师和资金支持进入创业实践。", color: C.violet },
                { title: "投资", desc: "理解 AI 如何重塑资产发现、项目判断和资本流动。", color: C.gold },
              ].map((item) => (
                <div key={item.title} style={{
                  padding: "18px 16px", borderRadius: 20,
                  background: "rgba(255,255,255,.08)", border: `1px solid ${C.line}`,
                }}>
                  <b style={{ display: "block", marginBottom: 6, fontSize: 15, color: item.color }}>{item.title}</b>
                  <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.55 }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            INVITE + FORM
        ══════════════════════════════════════════════════════ */}
        <section style={{ ...sectionStyle, paddingBottom: 80 }} ref={formRef}>
          {/* Invite banner */}
          <motion.div {...fadeUp(0)} style={{
            padding: "52px 56px", borderRadius: 36,
            background: `linear-gradient(135deg,${C.pink}44,${C.violet}38,${C.cyan}2a)`,
            border: `1px solid ${C.line}`,
            boxShadow: "0 28px 80px rgba(0,0,0,.38)",
            textAlign: "center", marginBottom: 56,
            position: "relative", overflow: "hidden",
          }} className="invite-banner">
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(circle at 50% 0%,${C.violet}18,transparent 60%)`,
            }} />
            <div style={{ position: "relative" }}>
              <SectionLabel>🌏 Global Ecosystem Partnership</SectionLabel>
              <h2 style={{ ...h2Style, maxWidth: 760, margin: "0 auto 16px" }}>
                邀请全球生态伙伴共创加入
              </h2>
              <p style={{ maxWidth: 700, margin: "0 auto 28px", color: "#DCE0FF", lineHeight: 1.78, fontSize: 16 }}>
                AI SpaceHub 平台目前处于内测阶段，预计下月以项目制方式正式对外开放。我们诚邀全球 AI Agent 公司、AIGC 工具平台、教育机构、投资机构、产业伙伴、区域渠道方和生态共建者加入，共同打造连接亚洲、北美、澳洲、中东与全球市场的 AI 生态增长平台。
              </p>
              <button
                onClick={scrollToForm}
                style={{
                  border: "none", borderRadius: 999, padding: "13px 28px",
                  fontWeight: 800, fontSize: 15, cursor: "pointer",
                  color: "#090B20",
                  background: `linear-gradient(90deg,${C.cyan},${C.green})`,
                  boxShadow: `0 16px 44px rgba(49,217,255,.32)`,
                }}
              >
                Build the Global AI Ecosystem Together →
              </button>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div {...fadeUp(0.1)} style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <SectionLabel>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 12px ${C.green}`, display: "inline-block" }} className="pulse-dot" />
                生态合作申请 · Partnership Application
              </SectionLabel>
              <h2 style={{ ...h2Style, fontSize: "clamp(22px,3vw,36px)", marginTop: 10 }}>
                填写合作申请表单
              </h2>
              <p style={{ color: C.muted, fontSize: 14, marginTop: 8 }}>
                提交后我们将在 2–3 个工作日内与您联系
              </p>
            </div>

            <div style={{
              padding: 2, borderRadius: 28,
              background: `linear-gradient(135deg,${C.pink}88,${C.violet}88,${C.cyan}88)`,
            }}>
              <div style={{
                borderRadius: 26, padding: "36px 40px",
                background: "linear-gradient(180deg,rgba(18,20,56,0.97) 0%,rgba(10,12,32,0.99) 100%)",
                backdropFilter: "blur(24px)",
              }} className="form-inner">
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
                      style={{ display: "flex", flexDirection: "column", gap: 22 }}
                    >
                      {/* Company */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8B8FBF", marginBottom: 8 }}>
                          公司名称 <span style={{ color: C.pink }}>*</span>
                          <span style={{ marginLeft: 8, fontWeight: 400, color: "#555A8A" }}>Company Name</span>
                        </label>
                        <FormInput {...register("companyName")} placeholder="请输入您的公司名称" error={errors.companyName?.message} />
                      </div>

                      {/* Contact Name */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8B8FBF", marginBottom: 8 }}>
                          联系人姓名 <span style={{ color: C.pink }}>*</span>
                          <span style={{ marginLeft: 8, fontWeight: 400, color: "#555A8A" }}>Contact Person</span>
                        </label>
                        <FormInput {...register("contactName")} placeholder="请输入联系人姓名" error={errors.contactName?.message} />
                      </div>

                      {/* Contact Info */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8B8FBF", marginBottom: 8 }}>
                          联系方式 <span style={{ color: C.pink }}>*</span>
                          <span style={{ marginLeft: 8, fontWeight: 400, color: "#555A8A" }}>Email / Phone</span>
                        </label>
                        <FormInput {...register("contactInfo")} placeholder="邮箱或电话，例如：hello@company.com" error={errors.contactInfo?.message} />
                      </div>

                      {/* Intent */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8B8FBF", marginBottom: 12 }}>
                          合作意图 <span style={{ color: C.pink }}>*</span>
                          <span style={{ marginLeft: 8, fontWeight: 400, color: "#555A8A" }}>Cooperation Intent</span>
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }} className="intent-grid">
                          {cooperationOptions.map((opt) => {
                            const sel = selectedIntent === opt.value;
                            return (
                              <motion.button
                                key={opt.value}
                                type="button"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => {
                                  setSelectedIntent(opt.value);
                                  setValue("cooperationIntent", opt.value, { shouldValidate: true });
                                }}
                                style={{
                                  display: "flex", flexDirection: "column", alignItems: "center",
                                  gap: 4, padding: "12px 6px", borderRadius: 16,
                                  cursor: "pointer", position: "relative",
                                  background: sel
                                    ? "linear-gradient(135deg,rgba(49,217,255,0.18),rgba(91,255,178,0.12))"
                                    : "rgba(255,255,255,0.05)",
                                  border: sel ? `1.5px solid rgba(49,217,255,0.6)` : "1.5px solid rgba(255,255,255,0.1)",
                                  color: sel ? C.cyan : "#8B8FBF",
                                  boxShadow: sel ? "0 0 18px rgba(49,217,255,0.18)" : "none",
                                  transition: "all 0.18s",
                                }}
                              >
                                <span style={{ fontSize: 18 }}>{opt.icon}</span>
                                <span style={{ fontSize: 11, fontWeight: 800 }}>{opt.label}</span>
                                <span style={{ fontSize: 10, color: sel ? C.green : "#555A8A" }}>{opt.desc}</span>
                                {sel && (
                                  <motion.div
                                    layoutId="intent-dot"
                                    style={{
                                      position: "absolute", top: 6, right: 6,
                                      width: 7, height: 7, borderRadius: "50%",
                                      background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`,
                                    }}
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                        {errors.cooperationIntent && (
                          <p style={{ marginTop: 6, fontSize: 12, color: C.pink }}>{errors.cooperationIntent.message}</p>
                        )}
                      </div>

                      {/* Notes */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8B8FBF", marginBottom: 8 }}>
                          补充说明
                          <span style={{ marginLeft: 8, fontWeight: 400, color: "#555A8A" }}>Additional Notes (optional)</span>
                        </label>
                        <FormInput
                          as="textarea"
                          {...register("additionalNotes")}
                          rows={4}
                          placeholder="请简要描述您的合作设想、资源背景或其他希望告知我们的信息..."
                        />
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={submitMutation.isPending}
                        whileHover={!submitMutation.isPending ? { scale: 1.01 } : {}}
                        whileTap={!submitMutation.isPending ? { scale: 0.98 } : {}}
                        style={{
                          width: "100%", padding: "15px", borderRadius: 18,
                          fontWeight: 900, fontSize: 15, cursor: submitMutation.isPending ? "not-allowed" : "pointer",
                          border: "none",
                          background: submitMutation.isPending
                            ? "rgba(255,255,255,0.1)"
                            : `linear-gradient(90deg,${C.cyan},${C.green})`,
                          color: submitMutation.isPending ? "#8B8FBF" : "#080A1F",
                          boxShadow: submitMutation.isPending ? "none" : `0 16px 44px rgba(49,217,255,.3)`,
                          transition: "all 0.2s",
                          position: "relative", overflow: "hidden",
                        }}
                      >
                        {submitMutation.isPending ? (
                          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                            </svg>
                            提交中... Submitting
                          </span>
                        ) : "提交申请 · Submit Application →"}
                        {!submitMutation.isPending && (
                          <div className="shimmer" style={{ position: "absolute", inset: 0, opacity: 0.25, pointerEvents: "none" }} />
                        )}
                      </motion.button>

                      <p style={{ textAlign: "center", fontSize: 12, color: "#555A8A", margin: 0 }}>
                        提交即表示您同意 AI SpaceHub 团队与您联系 · By submitting, you agree to be contacted by our team.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════ */}
        <footer style={{ padding: "24px 0 48px", textAlign: "center", fontSize: 13, color: "#555A8A", borderTop: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: `linear-gradient(135deg,${C.pink},${C.violet},${C.cyan})`,
              display: "grid", placeItems: "center",
              fontWeight: 900, color: "#080A1F", fontSize: 10,
            }}>AI</div>
            <span style={{ fontWeight: 700, color: C.muted }}>AI SpaceHub</span>
          </div>
          <p style={{ margin: 0 }}>AI SpaceHub｜Singapore-based Global AI Ecosystem Platform</p>
        </footer>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .eco-grid { grid-template-columns: 1fr !important; }
          .logic-grid { grid-template-columns: 1fr 1fr !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .community-grid { grid-template-columns: 1fr !important; }
          .intent-grid { grid-template-columns: repeat(3,1fr) !important; }
          .invite-banner { padding: 32px 24px !important; }
          .form-inner { padding: 28px 22px !important; }
        }
        @media (max-width: 540px) {
          .logic-grid { grid-template-columns: 1fr !important; }
          .intent-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        input::placeholder, textarea::placeholder { color: #555A8A; }
      `}</style>
    </div>
  );
}
