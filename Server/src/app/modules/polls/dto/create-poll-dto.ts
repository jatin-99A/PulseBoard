import { z } from "zod";
import DtoBase from "../../../../common/dto/dto-base.js";

const questionSchema = z.object({
  questionText: z
    .string({ message: "Question text must be a string" })
    .min(3, "Question must be at least 3 characters")
    .max(500, "Question must be at most 500 characters"),

  isMandatory: z
    .boolean({ message: "isMandatory must be a boolean" })
    .default(false),

  questionOrder: z
    .number({ message: "Question order must be a number" })
    .int("Question order must be an integer")
    .min(1, "Question order must be at least 1"),

  options: z
    .array(
      z.object({
        optionText: z
          .string({ message: "Option text must be a string" })
          .min(1, "Option must be at least 1 character")
          .max(255, "Option must be at most 255 characters"),

        optionOrder: z
          .number({ message: "Option order must be a number" })
          .int("Option order must be an integer")
          .min(1, "Option order must be at least 1"),
      })
    )
    .min(2, "Each question must have at least 2 options")
    .max(50, "Each question can have at most 50 options"),
});

const createPollSchema = z.object({
  title: z
    .string({ message: "Title must be a string" })
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must be at most 255 characters"),

  description: z
    .string({ message: "Description must be a string" })
    .max(1000, "Description must be at most 1000 characters")
    .optional(),

  publicLink: z
    .string({ message: "Public link must be a string" })
    .min(3, "Public link must be at least 3 characters")
    .max(255, "Public link must be at most 255 characters"),

  expiryDays: z
    .number({ message: "Expiry days must be a number" })
    .int("Expiry days must be an integer")
    .min(1, "Expiry days must be at least 1")
    .max(365, "Expiry days must be at most 365")
    .default(7),

  isAnonymousAllowed: z
    .boolean({ message: "isAnonymousAllowed must be a boolean" })
    .default(false),

  questions: z
    .array(questionSchema)
    .min(1, "Poll must have at least 1 question")
    .max(100, "Poll can have at most 100 questions"),
});

export type CreatePollDtoType = z.infer<typeof createPollSchema>;

export class CreatePollDto extends DtoBase {
  static schema = createPollSchema;
}
