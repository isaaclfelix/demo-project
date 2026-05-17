"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema, type SignInSchema } from "@/lib/schemas";

export function SignInForm(): React.ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors: schemaErrors },
  } = useForm<SignInSchema>({
    resolver: standardSchemaResolver(signInSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { signIn, errors: signInErrors } = useSignIn();

  const router = useRouter();

  /**
   * Handles the form submission after zod validation.
   * Starts a transition to handle the sign in process.
   *
   * @param {SignInSchema} data - The form data
   */
  const onSubmit = async (data: SignInSchema) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const { email: emailAddress, password } = data;

      const { error: signInError } = await signIn.password({
        emailAddress,
        password,
      });

      // If there is an error, simply return.
      // We'll display the error to the user in the UI through 'signInErrors'.
      if (signInError) {
        setIsSubmitting(false);
        return;
      }

      if (signIn.status !== "complete") {
        throw new Error("Sign in failed. Please try again later.");
      }

      const { error: finalizeError } = await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          // Handle session tasks.
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          if (session?.currentTask) {
            return;
          }

          // If no session tasks, navigate the signed-in user to the home page.
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
      setIsSubmitting(false);

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
                <FieldLabel htmlFor="email-input">Email</FieldLabel>
                <Input
                  id="email-input"
                  placeholder="john.doe@example.com"
                  type="email"
                  disabled={isSubmitting}
                  required
                  {...register("email")}
                />
                {schemaErrors.email && (
                  <FieldError>
                    <p>{schemaErrors.email.message}</p>
                  </FieldError>
                )}
                {signInErrors.fields.identifier && (
                  <FieldError>
                    <p>{signInErrors.fields.identifier.message}</p>
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password-input">Password</FieldLabel>
                <Input
                  id="password-input"
                  type="password"
                  disabled={isSubmitting}
                  required
                  {...register("password")}
                />
                {schemaErrors.password && (
                  <FieldError>
                    <p>{schemaErrors.password.message}</p>
                  </FieldError>
                )}
                {signInErrors.fields.password && (
                  <FieldError>
                    <p>{signInErrors.fields.password.message}</p>
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Field orientation="horizontal" className="flex-wrap">
            {isSubmitting ? (
              <Button disabled>
                <CircleNotchIcon className="animate-spin" />
                Signing in...
              </Button>
            ) : (
              <Button type="submit">Sign in</Button>
            )}
            {formError && (
              <FieldError className="w-full">
                <p>{formError}</p>
              </FieldError>
            )}
          </Field>
          <div
            id="clerk-captcha"
            className="mb-0! w-full"
            data-cl-size="flexible"
          />
        </CardFooter>
      </Card>
    </form>
  );
}
