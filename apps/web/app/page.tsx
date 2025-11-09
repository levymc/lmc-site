import type { Metadata } from "next";
import { DashboardHero } from "./components/DashboardHero";

export const metadata: Metadata = {
  title: "Painel • LMC",
  description: "Área autenticada"
};

export default function DashboardPage() {
  return <DashboardHero />;
}
