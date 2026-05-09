"use client";

import { useTransition } from "react";

import { useAuth, useSignUp } from "@clerk/nextjs";
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
import { VerifyForm } from "@/components/web/VerifyForm";
import { signUpSchema, type SignUpSchema } from "@/lib/schemas";

export function SignUpForm(): React.ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors: schemaErrors },
  } = useForm<SignUpSchema>({
    resolver: standardSchemaResolver(signUpSchema),
  });

  const [isPending, startTransition] = useTransition();

  const { signUp, errors: signUpErrors } = useSignUp();
  const { isSignedIn } = useAuth();

  /**
   * Handles the form submission after zod validation.
   * Starts a transition to handle the sign up process.
   *
   * @param {SignUpSchema} data - The form data
   */
  const onSubmit = (data: SignUpSchema) => {
    startTransition(async () => {
      const { email, password } = data;

      const { error } = await signUp.password({
        emailAddress: email,
        password,
      });

      // If there is an error, simply return.
      // We'll display the error to the user in the UI.
      if (error) {
        return;
      }

      await signUp.verifications.sendEmailCode();
    });
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return <VerifyForm />;
  }

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
                  disabled={isPending}
                  required
                  {...register("email")}
                />
                {schemaErrors.email && (
                  <FieldError>
                    <p>{schemaErrors.email.message}</p>
                  </FieldError>
                )}
                {signUpErrors.fields.emailAddress && (
                  <FieldError>
                    <p>{signUpErrors.fields.emailAddress.message}</p>
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password-input">Password</FieldLabel>
                <Input
                  id="password-input"
                  type="password"
                  disabled={isPending}
                  required
                  {...register("password")}
                />
                {schemaErrors.password && (
                  <FieldError>
                    <p>{schemaErrors.password.message}</p>
                  </FieldError>
                )}
                {signUpErrors.fields.password && (
                  <FieldError>
                    <p>{signUpErrors.fields.password.message}</p>
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            {isPending ? (
              <Button disabled>
                <CircleNotchIcon className="animate-spin" />
                Creating account...
              </Button>
            ) : (
              <Button type="submit">Create account</Button>
            )}
          </Field>
        </CardFooter>
      </Card>
      <div id="clerk-captcha" />
    </form>
  );
}
