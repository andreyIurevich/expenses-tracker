import { auth } from "@/auth";
import { connection } from "next/server";

export const instant = false;

export default async function Home() {
  await connection();

  const session = await auth();
  const isAuthorized = !!session;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <p>Учёт доходов и расходов</p>
      {isAuthorized ? (
        <p>
          Ваш ID {session.user?.id}
        </p>
      ) : (
        <p>Не авторизован</p>
      )}
    </main>
  );
}
