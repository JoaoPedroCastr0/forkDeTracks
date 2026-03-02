import { z } from "zod";

// Para agora não temos inputs obrigatórios, mas podemos validar query params
export const healthSchema = z.object({
  // Por exemplo, aceitar um ?checkDB=true ou ?checkCache=false
  checkDB: z
    .string()
    .optional()
    .transform((val) => val === "true"), // transforma para boolean
  checkCache: z
    .string()
    .optional()
    .transform((val) => val === "true")
});

// TypeScript type derivado do schema
export type HealthDTO = z.infer<typeof healthSchema>;