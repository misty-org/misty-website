import { useRef, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  FieldError,
  FileInput,
  Spinner,
  Text,
} from "@misty/ui";

import { toInitials } from "@/lib/format";
import { avatarUrl, uploadAvatar, type MeResponse } from "../../api";

const MAX_DIMENSION = 512;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

async function toSquarePng(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const size = Math.min(side, MAX_DIMENSION);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not read that image.");
    context.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      size,
      size,
    );

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not process that image."));
      }, "image/png");
    });
  } finally {
    bitmap.close();
  }
}

export function AvatarUpload({
  me,
  onUploaded,
}: {
  me: MeResponse;
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const initials = toInitials(me.username || me.email);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setWorking(true);
    try {
      const png = await toSquarePng(file);
      if (png.size > MAX_UPLOAD_BYTES) {
        throw new Error("That image is too large. Try a smaller one.");
      }
      await uploadAvatar(png);
      onUploaded();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not update your picture.",
      );
    } finally {
      setWorking(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar size="xl">
        <AvatarImage src={avatarUrl(me.avatar_version)} alt="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <Text size="control" tone="bright" weight="medium">
          {me.username}
        </Text>
        <Text size="control" tone="muted" className="mt-0.5">
          {me.email}
        </Text>
        <div className="mt-2 flex items-center gap-2">
          <FileInput
            ref={inputRef}
            id="account-avatar"
            accept="image/*"
            aria-label="Profile picture"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <Button
            size="sm"
            disabled={working}
            aria-busy={working}
            onClick={() => inputRef.current?.click()}
          >
            Change picture
          </Button>
          {working ? <Spinner label="Uploading your picture" /> : null}
        </div>
        <FieldError message={error} className="mt-1" />
      </div>
    </div>
  );
}
