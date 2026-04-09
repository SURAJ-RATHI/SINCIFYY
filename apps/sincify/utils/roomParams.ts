import { RoomParams } from "@/types/canvas";

export const ANONYMOUS_ROOM_ID = "anonymous";
// Base64 of "anonymous-room1!" (16 bytes) for AES-128.
export const ANONYMOUS_ROOM_KEY = "YW5vbnltb3VzLXJvb20xIQ==";

function normalizeRoomId(roomId: string): string {
  return roomId.trim().toLowerCase();
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function deriveRoomKeyFromId(roomId: string): string {
  const normalized = normalizeRoomId(roomId);
  const bytes = new Uint8Array(16);
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    const idx = i % 16;
    const nextIdx = (i * 7 + 3) % 16;
    bytes[idx] = (bytes[idx] + code + i) % 256;
    bytes[nextIdx] = (bytes[nextIdx] ^ ((code * 31 + i) % 256)) % 256;
  }
  return toBase64(bytes);
}

/**
 * Extracts room parameters from URL hash
 * @returns RoomParams object or null if invalid hash
 */
export function getRoomParamsFromHash(hash: string): RoomParams | null {
  // Check if hash has the correct format
  if (!hash.startsWith("#room=")) return null;

  const [, roomIdAndKey] = hash.split("#room=");
  const [roomIdRaw, encryptionKey] = roomIdAndKey.split(",");
  const roomId = roomIdRaw?.trim();

  if (!roomId) return null;
  const normalizedRoomId = normalizeRoomId(roomId);

  if (normalizedRoomId === ANONYMOUS_ROOM_ID) {
    return { roomId: normalizedRoomId, encryptionKey: ANONYMOUS_ROOM_KEY };
  }

  // Named rooms are deterministic by room name; ignore URL key if present.
  if (!isUuid(normalizedRoomId)) {
    return {
      roomId: normalizedRoomId,
      encryptionKey: deriveRoomKeyFromId(normalizedRoomId),
    };
  }

  // Support UUID-based private room format:
  // - #room=<uuid>,<encryptionKey> (preferred)
  // - #room=<uuid> (fallback deterministic key)
  if (!encryptionKey) {
    return {
      roomId: normalizedRoomId,
      encryptionKey: deriveRoomKeyFromId(normalizedRoomId),
    };
  }

  // Backward-compatible format: #room=<roomId>,<encryptionKey>
  return { roomId: normalizedRoomId, encryptionKey };
}

export function createNamedRoomHash(roomName: string): string {
  const roomId = normalizeRoomId(roomName);
  if (!roomId) {
    return "";
  }
  if (roomId === ANONYMOUS_ROOM_ID) {
    return `#room=${ANONYMOUS_ROOM_ID}`;
  }
  return `#room=${roomId}`;
}

/**
 * Creates a room hash string from parameters
 * @param roomId - The room identifier
 * @param encryptionKey - The encryption key
 * @returns Formatted hash string
 */
export function createRoomHash(roomId: string, encryptionKey: string): string {
  const normalizedRoomId = normalizeRoomId(roomId);
  if (normalizedRoomId === ANONYMOUS_ROOM_ID) {
    return `#room=${ANONYMOUS_ROOM_ID}`;
  }
  return `#room=${normalizedRoomId},${encryptionKey}`;
}

/**
 * Sets the room parameters in the URL hash
 * @param roomId - The room identifier
 * @param encryptionKey - The encryption key
 * @param replace - Whether to replace current history entry (defaults to false)
 */
export function setRoomParamsInHash(
  roomId: string,
  encryptionKey: string,
  replace: boolean = false
): void {
  if (typeof window === "undefined") return;

  const hash = createRoomHash(roomId, encryptionKey);

  if (replace) {
    window.history.replaceState(null, "", hash);
  } else {
    window.location.hash = hash;
  }
}

/**
 * Checks if the current URL contains room parameters
 * @returns true if the current URL contains valid room parameters
 */
export function isInRoom(hash: string): boolean {
  return getRoomParamsFromHash(hash) !== null;
}

/**
 * Gets the full room URL with the current path and room parameters
 * @param basePath - The base URL path (e.g., BASE_URL)
 * @param currentPath - The current pathname
 * @returns The full room URL for sharing
 */
export function getRoomSharingUrl(
  basePath: string,
  currentPath: string,
  hash: string
): string {
  const params = getRoomParamsFromHash(hash);
  if (!params) return `${basePath}${currentPath}`;

  return `${basePath}${currentPath}${createRoomHash(params.roomId, params.encryptionKey)}`;
}
