'use client';

import { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  Typography,
  ErrorMessage,
  Spinner
} from "@heroui/react";
import { login } from "./actions";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const response = await login(formData);

    if (response?.error) {
      setError(response?.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Typography type="h4">Кошелёк</Typography>
      <Typography type="body">Вход в систему учёта расходов</Typography>
      <Form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
        <TextField
          isRequired
          name="login"
          type="text"
          validate={(value) => {
            if (!value.length) {
              return "Введите логин";
            }
            return null;
          }}
        >
          <Label>Логин</Label>
          <Input placeholder="admin" />
          <FieldError>
            {(validation) => validation.validationErrors.join(', ')}
          </FieldError>
        </TextField>

        <TextField
          isRequired
          minLength={5}
          name="password"
          type="password"
          validate={(value) => {
            if (!value.length) {
              return "Введите пароль";
            }
            if (value.length < 5) {
              return "Пароль должен содержать не менее 5-ти символов";
            }
            return null;
          }}
        >
          <Label>Пароль</Label>
          <Input />
          <FieldError>
            {(validation) => validation.validationErrors.join(', ')}
          </FieldError>
        </TextField>

        <div className="flex gap-2 justify-center">
          <Button isDisabled={isLoading} isPending={isLoading} type="submit">
            {({isPending}) => (
              <>
                {isPending && <Spinner color="current" size="sm" />}
                {isPending ? "Вход..." : "Войти"}
              </>
            )}
          </Button>
        </div>

        {error?.length && <ErrorMessage className="text-center">{error}</ErrorMessage>}
      </Form>
    </div>
  );
}

