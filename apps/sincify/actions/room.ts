"use server";

import { z } from "zod";
import { randomUUID } from "crypto";

export async function joinRoom(data: { id: string }) {
  try {
    if (!data.id || data.id.trim().length === 0) {
      return { success: false, error: "Invalid room id" };
    }

    return {
      success: true,
      room: { id: data.id },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid room code format" };
    }
    console.error("Failed to join room:", error);
    return { success: false, error: "Failed to join room" };
  }
}

export async function createRoom() {
  try {
    const room = { id: randomUUID() };

    return {
      success: true,
      room,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid room name format",
        errorMessage: error.message,
      };
    }
    console.error("Failed to create room:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create room",
    };
  }
}

export async function getRoom(data: { id: string }) {
  try {
    if (!data.id || data.id.trim().length === 0) {
      return { success: false, error: "Invalid room id" };
    }

    return {
      success: true,
      room: { id: data.id, Shape: [] },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid room code format" };
    }
    console.error("Failed to join room:", error);
    return { success: false, error: "Failed to join room" };
  }
}

export async function deleteRoom(data: { id: string }) {
  try {
    const _roomId = data.id;
    return {
      success: false,
      error:
        "Manual room deletion is disabled in anonymous mode. Empty rooms are auto-deleted.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid room name format" };
    }
    console.error("Failed to delete room:", error);
    return { success: false, error: "Failed to delete room" };
  }
}

export async function getUserRooms() {
  return { success: true, rooms: [], error: null };
}
