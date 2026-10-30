'use client';

import { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextField, Typography, Card } from "@heroui/react";
import { login } from "./actions";

export default function LoginPage() {
  //const [state, formAction, isPending] = useActionState(login, null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await login(formData);
    console.log('auth response ', response);
  };

  return (
    // <div>
    //   <h3>Вход в систему</h3>
    //   <form action={formAction}>
    //     <div>
    //       <label htmlFor="login">Логин</label>
    //       <input
    //         id="login"
    //         name="login"
    //         type="text"
    //         required
    //         placeholder="admin"
    //       />
    //     </div>
    //
    //     <div>
    //       <label htmlFor="password">Пароль</label>
    //       <input
    //         id="password"
    //         name="password"
    //         type="password"
    //         required
    //       />
    //     </div>
    //
    //     <button
    //       type="submit"
    //       disabled={isPending}
    //     >
    //       {isPending ? "Вход..." : "Войти"}
    //     </button>
    //
    //     {state?.error && <div>{state.error}</div>}
    //   </form>
    // </div>

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
          <Button type="submit">
            Войти
          </Button>
        </div>
      </Form>
    </div>
  );
}

