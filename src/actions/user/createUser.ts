"use server";
import { CreateUserSchema } from "@/app/admin-dashboard/schemas/createUserSchema";
import { db } from "@/lib/db";
import * as z from "zod";
import { Role } from "@prisma/client";
import { revalidateTag } from "next/cache";

interface User {
  name: string;
  email: string;
  accessLevel: Role;
}

export async function createUser(values: z.infer<typeof CreateUserSchema>) {
  const validatedUser = CreateUserSchema.safeParse(values);

  if (!validatedUser.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, accessLevel } = validatedUser.data;

  try {
    const newUser = await db.user.create({
      data: {
        name,
        email,
        accessLevel,
      },
    });
    revalidateTag("all-users-data");
    return {
      success: true,
      message: "New user created successfully",
      user: newUser,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      "meta" in error &&
      error.code === "P2002" &&
      (error.meta as { target: string[] }).target?.includes("email")
    ) {
      return {
        success: false,
        message: "The email is already registered",
      };
    }
    return {
      success: false,
      message: "Error creating the user",
    };
  }
}
