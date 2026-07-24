import { useForm, type FieldValues, type UseFormProps, type UseFormReturn } from "react-hook-form";

/**
 * Drop-in replacement for react-hook-form's `useForm` that turns on
 * live validation app-wide from one place, rather than repeating the
 * same `mode`/`reValidateMode` config in all 51 forms individually —
 * a real, flagged-since-the-first-audit gap ("every form should have
 * live validation") that never actually got fixed until this pass.
 *
 * `mode: "onBlur"` — a field isn't marked invalid while someone is
 * still in the middle of typing their first attempt at it; validation
 * fires when they move on, which is the moment a mistake is actually
 * worth surfacing.
 * `reValidateMode: "onChange"` — once a field HAS been flagged, fixing
 * it clears the error live, keystroke by keystroke, so the form
 * doesn't feel like it's ignoring the correction until the next blur.
 *
 * Any call site can still override either mode explicitly if a
 * specific form genuinely needs different behavior — this only
 * changes the default.
 */
export function useAppForm<TFieldValues extends FieldValues = FieldValues, TContext = unknown>(
  props?: UseFormProps<TFieldValues, TContext>,
): UseFormReturn<TFieldValues, TContext> {
  return useForm<TFieldValues, TContext>({
    mode: "onBlur",
    reValidateMode: "onChange",
    ...props,
  });
}
