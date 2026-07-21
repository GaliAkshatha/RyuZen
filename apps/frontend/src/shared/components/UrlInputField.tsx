import { useState, forwardRef, useId } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/utils/cn";
import { Input, type InputProps } from "@/shared/ui/Input";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

function looksLikeImageUrl(url: string): boolean {
  const lower = url.toLowerCase().split("?")[0] ?? "";
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function isValidUrl(value: string): boolean {
  if (!value) return true; // empty is valid (optional field) — required-ness is the form's own concern
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export interface UrlInputFieldProps extends Omit<InputProps, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  /** Shows an inline image preview when the URL looks like an image. Default true. */
  showPreview?: boolean;
  label?: string;
}

/**
 * The resolution to F5's self-review finding: no upload/storage
 * endpoint exists anywhere in the backend (every "file" field —
 * avatar, resume, portfolio images, chat attachments — is a plain
 * `string` URL). Every place in the app that conceptually needs a
 * "file" uses this field: the person pastes a URL, we validate its
 * format and preview it if it looks like an image.
 */
export const UrlInputField = forwardRef<HTMLInputElement, UrlInputFieldProps>(
  ({ value, onChange, showPreview = true, label, className, id, ...props }, ref) => {
    const [imageFailed, setImageFailed] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const valid = isValidUrl(value);
    const isImage = showPreview && valid && value && looksLikeImageUrl(value);

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <label htmlFor={inputId} className="font-body text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <Input
          ref={ref}
          id={inputId}
          type="url"
          value={value}
          onChange={(event) => {
            setImageFailed(false);
            onChange(event.target.value);
          }}
          aria-invalid={!valid}
          className={cn(!valid && "border-destructive focus-visible:ring-destructive")}
          {...props}
        />
        {!valid && (
          <p className="font-body text-xs text-destructive" role="alert">
            Enter a valid URL (e.g. https://example.com/file.png).
          </p>
        )}
        {isImage && (
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            {imageFailed ? (
              <ImageOff className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
        )}
      </div>
    );
  },
);
UrlInputField.displayName = "UrlInputField";
