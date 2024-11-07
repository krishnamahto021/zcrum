import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assigneeId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select assignee"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
});
