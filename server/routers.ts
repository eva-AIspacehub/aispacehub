import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createPartnerApplication, listPartnerApplications } from "./db";
import { notifyOwner } from "./_core/notification";

const cooperationIntentEnum = z.enum([
  "技术合作",
  "市场推广",
  "投资对接",
  "教育合作",
  "其他",
]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  partnerApplication: router({
    submit: publicProcedure
      .input(
        z.object({
          companyName: z.string().min(1, "请填写公司名称").max(256),
          contactName: z.string().min(1, "请填写联系人姓名").max(128),
          contactInfo: z.string().min(1, "请填写联系方式").max(320),
          cooperationIntent: cooperationIntentEnum,
          additionalNotes: z.string().max(2000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createPartnerApplication({
          companyName: input.companyName,
          contactName: input.contactName,
          contactInfo: input.contactInfo,
          cooperationIntent: input.cooperationIntent,
          additionalNotes: input.additionalNotes ?? null,
        });

        // 通知平台所有者
        await notifyOwner({
          title: `新生态合作申请：${input.companyName}`,
          content: `公司：${input.companyName}\n联系人：${input.contactName}\n联系方式：${input.contactInfo}\n合作意图：${input.cooperationIntent}\n补充说明：${input.additionalNotes ?? "无"}`,
        });

        return { success: true };
      }),

    list: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "仅管理员可查看申请列表" });
        }
        return next({ ctx });
      })
      .query(async () => {
        return listPartnerApplications();
      }),
  }),
});

export type AppRouter = typeof appRouter;
