"use client";

import { useState } from "react";

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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSessionStarting, setIsSessionStarting] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const { signUp, errors: signUpErrors } = useSignUp();

  /**
   * Handles the form submission after zod validation.
   * Starts a transition to handle the sign up process.
   *
   * @param {SignUpSchema} data - The form data
   */
  const onSubmit = async (data: SignUpSchema) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const { email: emailAddress, password } = data;

      const { error: signUpError } = await signUp.password({
        emailAddress,
        password,
      });

      // If there is an error, simply return.
      // We'll display the error to the user in the UI through 'signUpErrors'.
      if (signUpError) {
        setIsSubmitting(false);
        return;
      }

      const { error: sendEmailCodeError } =
        await signUp.verifications.sendEmailCode();

      if (sendEmailCodeError) {
        throw new Error(sendEmailCodeError.message);
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
          <Field orientation="horizontal" className="flex-wrap">
            {isSubmitting ? (
              <Button disabled>
                <CircleNotchIcon className="animate-spin" />
                Creating account...
              </Button>
            ) : (
              <Button type="submit">Create account</Button>
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
