import { z } from "zod";

export const sprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),
  startDate: z.date(),
  endDate: z.date(),
});
