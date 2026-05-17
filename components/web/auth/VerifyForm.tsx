"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { verifySchema, type VerifySchema } from "@/lib/schemas";

type VerifyFormProps = {
  code: string;
  setCode: (code: string) => void;
  isSessionStarting: boolean;
  setIsSessionStarting: (isSessionStarting: boolean) => void;
};

export function VerifyForm({
  code,
  setCode,
  isSessionStarting,
  setIsSessionStarting,
}: VerifyFormProps): React.ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors: schemaErrors },
  } = useForm<VerifySchema>({
    resolver: standardSchemaResolver(verifySchema),
  });

  const { onChange, onBlur, name, ref } = register("code");

  const [isVerifyPending, setIsVerifyPending] = useState<boolean>(false);
  const [isNewCodePending, setIsNewCodePending] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { signUp, errors: signUpErrors } = useSignUp();

  const router = useRouter();

  /**
   * Handles the code change event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   */
  const onCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    setCode(event.target.value);
  };

  /**
   * Handles the code verification after the email code is sent.
   * Starts a transition to handle the verification process.
   *
   * @param {VerifySchema} data - The form data
   */
  const onSubmit = async (data: VerifySchema) => {
    try {
      setIsVerifyPending(true);
      setIsNewCodePending(false);
      setFormError(null);

      const { code } = data;

      const { error: verifyEmailCodeError } =
        await signUp.verifications.verifyEmailCode({
          code,
        });

      if (verifyEmailCodeError) {
        throw new Error(verifyEmailCodeError.message);
      }

      if (signUp.status !== "complete") {
        return;
      }

      setIsSessionStarting(true);

      const { error: finalizeError } = await signUp.finalize({
        navigate: async ({ session, decorateUrl }) => {
          // Handle session tasks.
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          if (session?.currentTask) {
            return;
          }

          // Store user in Convex.
          const response = await fetch("/api/auth/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            // For now just send the error to the console.
            try {
              const decodedResponse = await response.json();
              console.error(
                "Failed to store user in Convex",
                response.status,
                decodedResponse.error,
              );
            } catch (error) {
              console.error("Failed to decode response", error);
            }
          }

          // If no session tasks, navigate the signed-in user to the onboarding route.
          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });

      if (finalizeError) {
        throw new Error(finalizeError.message);
      }
    } catch (error) {
      setIsVerifyPending(false);

      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unknown error occurred. Please try again later.");
        console.error(error);
      }
    }
  };

  /**
   * Handles the request for a new code.
   */
  const handleNewCode = async () => {
    try {
      setIsNewCodePending(true);
      setFormError(null);

      const { error: sendEmailCodeError } =
        await signUp.verifications.sendEmailCode();

      if (sendEmailCodeError) {
        throw new Error(sendEmailCodeError.message);
      }

      setIsNewCodePending(false);
    } catch (error) {
      setIsNewCodePending(false);

      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unknown error occurred. Please try again later.");
        console.error(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm"
      noValidate
    >
      <Card className="w-full">
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="code-input">Code</FieldLabel>
                <Input
                  id="code-input"
                  type="text"
                  disabled={
                    isVerifyPending || isNewCodePending || isSessionStarting
                  }
                  value={code}
                  onChange={onCodeChange}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  required
                />
                {schemaErrors.code && (
                  <FieldError>
                    <p>{schemaErrors.code.message}</p>
                  </FieldError>
                )}
                {signUpErrors.fields.code && (
                  <FieldError>
                    <p>{signUpErrors.fields.code.message}</p>
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Field orientation="horizontal" className="flex-wrap">
            {isVerifyPending || isSessionStarting ? (
              <ButtonGroup>
                <Button disabled>
                  <CircleNotchIcon className="animate-spin" />
                  Verifying account...
                </Button>
                <Button variant="outline" disabled>
                  I need a new code
                </Button>
              </ButtonGroup>
            ) : isNewCodePending ? (
              <ButtonGroup>
                <Button disabled>Verify account</Button>
                <Button variant="outline" disabled>
                  <CircleNotchIcon className="animate-spin" />
                  Sending new code...
                </Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <Button type="submit">Verify account</Button>
                <Button variant="outline" onClick={handleNewCode}>
                  I need a new code
                </Button>
              </ButtonGroup>
            )}
            {formError && (
              <FieldError className="w-full">
                <p>{formError}</p>
              </FieldError>
            )}
          </Field>
        </CardFooter>
      </Card>
    </form>
  );
}
