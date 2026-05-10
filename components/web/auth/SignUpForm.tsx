"use client";

import { useState, useTransition } from "react";

import { useSignUp } from "@clerk/nextjs";
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
import { VerifyForm } from "@/components/web/auth/VerifyForm";
import { signUpSchema, type SignUpSchema } from "@/lib/schemas";

export function SignUpForm(): React.ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors: schemaErrors },
  } = useForm<SignUpSchema>({
    resolver: standardSchemaResolver(signUpSchema),
  });

  const [isSubmitLoading, startSubmitTransition] = useTransition();

  const { signUp, errors: signUpErrors } = useSignUp();

  const [isSessionStarting, setIsSessionStarting] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  /**
   * Handles the form submission after zod validation.
   * Starts a transition to handle the sign up process.
   *
   * @param {SignUpSchema} data - The form data
   */
  const onSubmit = (data: SignUpSchema) => {
    startSubmitTransition(async () => {
      const { email: emailAddress, password } = data;

      const { error } = await signUp.password({
        emailAddress,
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

  if (
    isSessionStarting ||
    (signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address") &&
      signUp.missingFields.length === 0)
  ) {
    return (
      <VerifyForm
        code={code}
        setCode={setCode}
        isSessionStarting={isSessionStarting}
        setIsSessionStarting={setIsSessionStarting}
      />
    );
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
                  disabled={isSubmitLoading}
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
                  disabled={isSubmitLoading}
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
        <CardFooter className="flex flex-col items-start">
          <Field orientation="horizontal">
            {isSubmitLoading ? (
              <Button disabled>
                <CircleNotchIcon className="animate-spin" />
                Creating account...
              </Button>
            ) : (
              <Button type="submit">Create account</Button>
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
