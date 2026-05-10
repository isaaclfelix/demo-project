"use client";

import { useTransition } from "react";
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

  const [isVerifyPending, startVerifyTransition] = useTransition();
  const [isNewCodePending, startNewCodeTransition] = useTransition();

  const { signUp, errors: signUpErrors } = useSignUp();

  const router = useRouter();

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
  const onSubmit = (data: VerifySchema) => {
    startVerifyTransition(async () => {
      const { code } = data;

      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status !== "complete") {
        return;
      }

      setIsSessionStarting(true);

      await signUp.finalize({
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
            body: JSON.stringify({ email: signUp.emailAddress ?? "" }),
          });

          if (!response.ok) {
            // For now just send the error to the console.
            console.error("Failed to store user in Convex", response.status);
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
    });
  };

  /**
   * Handles the request for a new code.
   */
  const handleNewCode = () => {
    startNewCodeTransition(async () => {
      await signUp.verifications.sendEmailCode();
    });
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
        <CardFooter>
          <Field orientation="horizontal">
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
          </Field>
        </CardFooter>
      </Card>
    </form>
  );
}
