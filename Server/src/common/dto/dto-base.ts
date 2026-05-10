import { z, ZodType } from "zod";

interface ValidationReturnType {
    error: string | null;
    data: any;
}

export default class DtoBase {
    static schema: ZodType<any> = z.object({});

    static validate<T>(this: { schema: ZodType<any> }, data: unknown): ValidationReturnType {
        const result = this.schema.safeParse(data);

        if (!result.success) {
            return {
                error: result.error.issues.map((e) => e.message).join(","),
                data: null
            };
        }

        return {
            error: null,
            data: result.data
        }
    }
}