import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const intentColorMap: Record<string, { bg: string; text: string; border: string }> = {
  技术合作: { bg: "rgba(49,217,255,0.12)", text: "#31D9FF", border: "rgba(49,217,255,0.3)" },
  市场推广: { bg: "rgba(255,79,216,0.12)", text: "#FF4FD8", border: "rgba(255,79,216,0.3)" },
  投资对接: { bg: "rgba(255,211,110,0.12)", text: "#FFD36E", border: "rgba(255,211,110,0.3)" },
  教育合作: { bg: "rgba(91,255,178,0.12)", text: "#5BFFB2", border: "rgba(91,255,178,0.3)" },
  其他: { bg: "rgba(139,92,255,0.12)", text: "#B8A6FF", border: "rgba(139,92,255,0.3)" },
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: applications, isLoading, error } = trpc.partnerApplication.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // ── Loading auth ──
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg,#080A1F 0%,#101135 50%,#07091C 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(49,217,255,0.3)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#31D9FF" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-sm" style={{ color: "#8B8FBF" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ── Not logged in ──
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(139,92,255,.2), transparent 40%), linear-gradient(180deg,#080A1F 0%,#101135 100%)",
        }}
      >
        <div className="noise-overlay" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto px-6 relative z-10"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg,#FF4FD8,#8B5CFF,#31D9FF)",
              boxShadow: "0 0 40px rgba(139,92,255,.5)",
              color: "#080A1F",
            }}
          >
            AI
          </div>
          <h2 className="text-2xl font-black mb-3" style={{ color: "#F7F8FF" }}>
            管理员登录
          </h2>
          <p className="text-sm mb-8" style={{ color: "#8B8FBF", lineHeight: 1.7 }}>
            请登录以查看生态合作申请列表
            <br />
            <span style={{ color: "#555A8A" }}>Please sign in to view applications</span>
          </p>
          <a
            href={getLoginUrl()}
            className="inline-block px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95"
            style={{
              background: "linear-gradient(90deg, #31D9FF, #5BFFB2)",
              color: "#080A1F",
              boxShadow: "0 16px 40px rgba(49,217,255,0.3)",
            }}
          >
            登录 / Sign In
          </a>
          <div className="mt-6">
            <Link href="/">
              <span className="text-xs cursor-pointer" style={{ color: "#555A8A" }}>
                ← 返回表单 / Back to Form
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(255,79,216,.15), transparent 28%), radial-gradient(circle at 88% 5%, rgba(49,217,255,.12), transparent 26%), linear-gradient(180deg,#080A1F 0%,#101135 50%,#07091C 100%)",
      }}
    >
      <div className="noise-overlay" />

      <div className="container relative z-10">
        {/* ── Nav ── */}
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
            <div>
              <span className="font-black text-base tracking-tight block" style={{ color: "#F7F8FF" }}>
                AI SpaceHub
              </span>
              <span className="text-xs" style={{ color: "#555A8A" }}>
                Admin · 管理后台
              </span>
            </div>
          </div>
          <Link href="/">
            <span
              className="text-xs px-4 py-2 rounded-full cursor-pointer transition-all hover:bg-white/10"
              style={{
                border: "1px solid rgba(255,255,255,.16)",
                background: "rgba(255,255,255,.05)",
                color: "#B8BCE0",
              }}
            >
              ← 返回表单 / Back
            </span>
          </Link>
        </nav>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black" style={{ color: "#F7F8FF", letterSpacing: "-1.5px" }}>
              生态合作申请列表
            </h1>
            {applications && (
              <span
                className="px-3 py-1 rounded-full text-xs font-black"
                style={{
                  background: "rgba(49,217,255,0.12)",
                  border: "1px solid rgba(49,217,255,0.3)",
                  color: "#31D9FF",
                }}
              >
                {applications.length} 条
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: "#8B8FBF" }}>
            Partnership Applications · 所有已提交的生态合作申请
          </p>
        </motion.div>

        {/* ── Content ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(49,217,255,0.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#31D9FF" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="text-sm" style={{ color: "#8B8FBF" }}>加载中... Loading</p>
            </div>
          </div>
        ) : error ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "rgba(255,79,216,0.08)",
              border: "1px solid rgba(255,79,216,0.2)",
            }}
          >
            <p className="font-bold mb-1" style={{ color: "#FF4FD8" }}>加载失败</p>
            <p className="text-sm" style={{ color: "#8B8FBF" }}>{error.message}</p>
          </div>
        ) : !applications || applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-3xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              📭
            </div>
            <p className="font-bold text-lg mb-2" style={{ color: "#8B8FBF" }}>
              暂无申请记录
            </p>
            <p className="text-sm" style={{ color: "#555A8A" }}>
              No applications yet · 等待第一份生态合作申请
            </p>
          </motion.div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block mb-12">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {/* Table header */}
                <div
                  className="grid grid-cols-5 px-6 py-4 text-xs font-black uppercase tracking-widest"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    color: "#555A8A",
                  }}
                >
                  <span>#</span>
                  <span>公司名称 / Company</span>
                  <span>联系方式 / Contact</span>
                  <span>合作意图 / Intent</span>
                  <span>提交时间 / Submitted</span>
                </div>

                {/* Table rows */}
                {applications.map((app, idx) => {
                  const colors = intentColorMap[app.cooperationIntent] ?? intentColorMap["其他"];
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="grid grid-cols-5 px-6 py-5 items-center transition-all hover:bg-white/[0.03]"
                      style={{
                        borderBottom:
                          idx < applications.length - 1
                            ? "1px solid rgba(255,255,255,0.06)"
                            : "none",
                      }}
                    >
                      <span className="text-sm font-black" style={{ color: "#555A8A" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "#F7F8FF" }}>
                          {app.companyName}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#8B8FBF" }}>
                          {app.contactName}
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: "#B8BCE0" }}>
                        {app.contactInfo}
                      </p>
                      <span>
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-black"
                          style={{
                            background: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {app.cooperationIntent}
                        </span>
                      </span>
                      <p className="text-xs" style={{ color: "#8B8FBF" }}>
                        {formatDate(app.createdAt)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4 mb-12">
              {applications.map((app, idx) => {
                const colors = intentColorMap[app.cooperationIntent] ?? intentColorMap["其他"];
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-black text-base" style={{ color: "#F7F8FF" }}>
                          {app.companyName}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#8B8FBF" }}>
                          {app.contactName}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-black"
                        style={{
                          background: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {app.cooperationIntent}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: "#B8BCE0" }}>
                      📧 {app.contactInfo}
                    </p>
                    {app.additionalNotes && (
                      <p
                        className="text-xs mb-3 line-clamp-2"
                        style={{ color: "#8B8FBF", lineHeight: 1.6 }}
                      >
                        {app.additionalNotes}
                      </p>
                    )}
                    <p className="text-xs" style={{ color: "#555A8A" }}>
                      🕐 {formatDate(app.createdAt)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
