import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      { message: "All applications fetched successfully", data: applications },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { company, role, platform, url, status, followUpDate, notes } =
      await request.json();
    const createApplication = await prisma.application.create({
      data: {
        company,
        role,
        platform: platform || null,
        url: url || null,
        status,
        followUpDate: followUpDate
          ? new Date(followUpDate).toISOString()
          : null,
        notes,
      },
    });
    return NextResponse.json(
      { message: "Application created successfully", data: createApplication },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `failed to create application. error: ${error}` },
      { status: 500 },
    );
  }
}
