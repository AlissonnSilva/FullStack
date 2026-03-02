"use client"; // Obrigatório para usar hooks como useState
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { User, Image as ImageIcon, Save } from "lucide-react";
import Inventory from "./components/Inventory";
// 1. Definição do Tipo (Contrato de Engenharia)
interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}
export default function PerfilPage() {
  // 2. Estado Único como Objeto (Demonstra Imutabilidade e Spread)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Seu Nome",
    role: "Sua Profissão",
    avatarUrl: "https://github.com/github.png",
  });
  // 3. Handler Genérico (Explicação de Imutabilidade)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // POR QUE NÃO FAZER: profile[name] = value?
    // Porque o React só re-renderiza se a referência do objeto mudar!
    setProfile((prevState) => ({
      ...prevState, // Copia tudo que já existia
      [name]: value, // Sobrescreve apenas o campo que mudou
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perfil salvo com sucesso (Simulação)!");
    console.log("Dados enviados:", profile);
  };
  return (
    <div
      className="min-h-screen bg-black p-8 grid grid-cols-1 md:grid-cols-2 gap-8
items-start"
    >
      {/* COLUNA 1: O FORMULÁRIO (Event Handlers) */}
      <Card>
        <CardHeader
          title="Editor de Perfil"
          description="Altere as informações abaixo."
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-400">
                Nome Completo
              </label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500
outline-none text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-400">
                Cargo/Função
              </label>
              <input
                name="role"
                value={profile.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500
outline-none text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-400">
                URL da Foto
              </label>
              <input
                name="avatarUrl"
                value={profile.avatarUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500
outline-none text-slate-400"
              />
            </div>
            <Button type="submit" className="w-full" icon={<Save size={18} />}>
              Salvar Perfil
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* separador responsivo: mostra quando as colunas empilham (mobile) */}
      <div className="w-full h-px bg-slate-700 my-6 md:hidden" />
      {/* COLUNA 2: O CRACHÁ (Preview em Tempo Real) */}
      <div className="flex flex-col items-center">
        <h2
          className="text-slate-500 font-bold mb-4 uppercase tracking-widest
text-sm"
        >
          Preview do Crachá
        </h2>
        <div
          className="relative w-64 h-96 bg-gray-800 rounded-3xl shadow-2xl border-t-12
border-blue-900 overflow-hidden flex flex-col items-center p-6 text-center"
        >
          <div
            className="w-32 h-32 rounded-full border-4 border-slate-400 overflow-hidden
mb-4 bg-slate-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
          </div>
          <h3 className="text-xl font-bold text-slate-400 wrap-break-words w-full">
            {profile.name || "Nome Vazio"}
          </h3>
          <p className="text-blue-900 font-medium mb-4">
            {profile.role || "Cargo Vazio"}
          </p>
          <div className="mt-auto pt-4 border-t w-full flex justify-around text-slate-400">
            <User size={20} />
            <ImageIcon size={20} />
          </div>
          {/* Efeito de detalhe do Crachá */}
          <div className="absolute top-2 w-12 h-1.5 bg-slate-400 rounded-full" />
        </div>
      </div>

      {/* inventory agora dentro do mesmo container */}
      <div className="w-full mt-10">
        <Inventory />
      </div>
    </div>
  );
}
