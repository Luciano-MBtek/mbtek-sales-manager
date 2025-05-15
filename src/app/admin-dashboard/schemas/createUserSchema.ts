import * as z from "zod";
import { Role } from "@prisma/client";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  accessLevel: z.nativeEnum(Role, {
    required_error: "Selecciona un nivel de acceso",
  }),
  hubspotId: z
    .string()
    .regex(/^\d+$/, "HubSpot ID debe contener solo números")
    .min(1, "HubSpot ID es requerido"),
});
