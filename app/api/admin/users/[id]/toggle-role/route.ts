import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "root";

  if (!session || !isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.role === "root") {
      return new NextResponse("Cannot modify root admin role", { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        role: user.role === "admin" ? "user" : "admin",
      },
    });

    console.log("Updated user role:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
