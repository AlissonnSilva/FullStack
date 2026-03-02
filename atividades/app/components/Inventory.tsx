"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

const STORAGE_KEY = "inventory.items";

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState<number | "">("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p) => ({
            id: String(p.id ?? ""),
            name: String(p.name ?? ""),
            quantity: Number(p.quantity ?? 0),
          }));
          setItems(normalized);
        }
      } catch (e) {
        console.warn("Não foi possível carregar o estoque:", e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Não foi possível salvar o estoque:", e);
    }
  }, [items]);

  const reset = () => {
    setName("");
    setQty("");
    setEditingId(null);
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!name || qty === "" || Number(qty) < 0) return;

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId ? { ...it, name, quantity: Number(qty) } : it,
        ),
      );
    } else {
      const newItem: InventoryItem = {
        id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
        name,
        quantity: Number(qty),
      };
      setItems((prev) => [newItem, ...prev]);
    }
    reset();
  };

  const handleEdit = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setName(it.name);
    setQty(it.quantity);
    setEditingId(id);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (editingId === id) reset();
  };

  return (
    <Card>
      <CardHeader
        title="Gerenciador de Estoque"
        description="Adicione, edite ou remova itens."
      />
      <CardContent>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-slate-400">
              Nome do Item
            </label>
            <input
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Ex: Parafuso M4"
              className="w-full p-2 border border-slate-700 bg-transparent rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">
              Quantidade
            </label>
            <input
              type="number"
              value={qty === "" ? "" : qty}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQty(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="0"
              min={0}
              className="w-full p-2 border border-slate-700 bg-transparent rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-slate-400"
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <Button type="submit" className="px-4 py-2">
              {editingId ? "Atualizar" : "Adicionar"}
            </Button>
            {editingId && (
              <Button
                type="button"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600"
                onClick={reset}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6">
          <h4 className="text-slate-400 font-semibold mb-3">
            Itens ({items.length})
          </h4>
          {items.length === 0 ? (
            <p className="text-slate-500">Nenhum item no estoque.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between bg-gray-800/60 border border-slate-700 p-3 rounded-md hover:shadow-sm"
                >
                  <div>
                    <div className="font-medium text-slate-200">{it.name}</div>
                    <div className="text-sm text-slate-400">
                      Quantidade: {it.quantity}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
                      onClick={() => handleEdit(it.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      onClick={() => handleRemove(it.id)}
                    >
                      Remover
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
