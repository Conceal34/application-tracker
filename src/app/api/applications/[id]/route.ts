import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  try {
    const application = await prisma.application.findUnique({
      where: { id },
    });
    if (!application) {
      return NextResponse.json(
        { error: `Application with id ${id} not found` },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        message: `Application with id ${id} fetched successfully`,
        data: application,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch application with id ${id}. error: ${error}`,
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);

  try {
    const { company, role, platform, url, status, followUpDate, notes } =
      await request.json();
    const application = await prisma.application.update({
      where: { id },
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
      {
        message: `Application with id ${id} updated successfully`,
        data: application,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update application with id ${id}. error: ${error}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  try {
    const application = await prisma.application.delete({
      where: { id },
    });
    return NextResponse.json(
      {
        message: `Application with id ${id} deleted successfully`,
        data: application,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete application with id ${id}. error: ${error}` },
      { status: 500 },
    );
  }
}
