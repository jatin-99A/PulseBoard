import { z } from "zod";
import BaseDto from "../../../../common/dto/dto-base.js";


const signupSchema = z.object({
  firstName: z
    .string({ message: "First name must be a string" })
    .min(2, "First name must be at least 2 characters")
    .max(45, "First name must be at most 45 characters"),

  lastName: z
    .string({ message: "Last name must be a string" })
    .min(2, "Last name must be at least 2 characters")
    .max(45, "Last name must be at most 45 characters"),

  email: z
    .email("Invalid email address"),

  password: z
    .string({ message: "Password must be a string" })
    .min(6, "Password must be at least 6 characters")
    .max(66, "Password must be at most 66 characters"),
});

export type SignupDtoType = z.infer<typeof signupSchema>;

export class SignupDto extends BaseDto {
  static schema = signupSchema;
}