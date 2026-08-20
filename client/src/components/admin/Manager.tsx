"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin";
import type { Paginated } from "@/lib/api";
import UploadInput from "./UploadInput";
import MultiUploadInput from "./MultiUploadInput";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "datetime"
  | "select"
  | "checkbox"
  | "url"
  | "image"
  | "images"
  | "pdf";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  step?: number;
}

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface ManagerProps<T extends object> {
  title: string;
  description?: string;
  resource: string;
  columns: Column<T>[];
  fields: Field[];
}

const get = (item: object, key: string): unknown =>
  (item as Record<string, unknown>)[key];

/** Convert any date-ish value to a `YYYY-MM-DD` string for `<input type="date">`. */
function toDateInputValue(raw: unknown): string {
  if (!raw) return "";
  const text = String(raw);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const d = new Date(text);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function renderValue<T extends object>(
  item: T,
  col: Column<T>
): React.ReactNode {
  return col.render ? col.render(item) : String(get(item, col.key) ?? "—");
}

export default function Manager<T extends object>({
  title,
  description,
  resource,
  columns,
  fields,
}: ManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch<Paginated<T>>(`${resource}?limit=100`);
      setItems(data.items);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    let cancelled = false;
    adminFetch<Paginated<T>>(`${resource}?limit=100`)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resource]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const body: Record<string, unknown> = {};

    for (const field of fields) {
      const el = form.elements.namedItem(field.name) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null;
      if (!el) continue;

      let value: unknown = el.value;
      if (field.type === "checkbox") value = (el as HTMLInputElement).checked;
      if (field.type === "images") {
        try {
          const parsed = JSON.parse(el.value);
          value = Array.isArray(parsed) ? parsed : [];
        } catch {
          value = [];
        }
      }
      if (field.type === "datetime") {
        value = el.value ? new Date(el.value).toISOString() : "";
      }
      if (value === "") value = undefined;
      body[field.name] = value;
    }

    try {
      if (editing === "new") {
        await adminFetch(resource, { method: "POST", body: JSON.stringify(body) });
      } else if (editing) {
        await adminFetch(`${resource}/${String(get(editing, "_id"))}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: T) {
    if (!window.confirm("Delete this item?")) return;
    try {
      await adminFetch(`${resource}/${String(get(item, "_id"))}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function renderField(field: Field, current: T | "new") {
    const rawValue = current === "new" ? undefined : get(current, field.name);
    const value =
      field.type === "date"
        ? toDateInputValue(rawValue)
        : rawValue === undefined
          ? ""
          : String(rawValue);
    const common = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100";

    if (field.type === "image") {
      return <UploadInput name={field.name} defaultValue={value} label="Upload image" accept="image/*" />;
    }

    if (field.type === "images") {
      let images: string[] = [];
      if (current !== "new") {
        const raw = get(current, field.name);
        if (Array.isArray(raw)) images = raw as string[];
      }
      return <MultiUploadInput name={field.name} defaultValue={images} label="Upload images" />;
    }

    if (field.type === "pdf") {
      return <UploadInput name={field.name} defaultValue={value} label="Upload PDF" accept="application/pdf" />;
    }

    if (field.type === "textarea") {
      return (
        <textarea
          name={field.name}
          required={field.required}
          defaultValue={value}
          rows={4}
          className={common}
        />
      );
    }

    if (field.type === "checkbox") {
      return (
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(rawValue)}
          className="h-4 w-4 accent-gold-500"
        />
      );
    }

    if (field.type === "select") {
      return (
        <select name={field.name} required={field.required} defaultValue={value} className={common}>
          <option value="">Select...</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    const typeAttr =
      field.type === "date"
        ? "date"
        : field.type === "datetime"
          ? "datetime-local"
          : field.type === "url"
            ? "url"
            : "text";

    return (
      <input
        type={typeAttr}
        name={field.name}
        required={field.required}
        defaultValue={value}
        placeholder={field.placeholder}
        className={common}
      />
    );
  }

  const emptyState = (
    <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
      {loading
        ? "Loading..."
        : "No items yet. Click \u201cAdd New\u201d to create one."}
    </p>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-navy-900 sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <button
          onClick={() => setEditing("new")}
          className="w-full rounded-full bg-gold-500 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400 sm:w-auto"
        >
          + Add New
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6">
        {/* Card list on small screens */}
        <div className="space-y-3 lg:hidden">
          {loading || items.length === 0 ? (
            emptyState
          ) : (
            items.map((item) => (
              <div
                key={String(get(item, "_id"))}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="space-y-2.5">
                  {columns.map((col) => (
                    <div key={col.key} className="flex items-start gap-3">
                      <span className="w-24 shrink-0 pt-0.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                        {col.label}
                      </span>
                      <span className="min-w-0 flex-1 break-words text-right text-sm font-medium text-navy-900">
                        {renderValue(item, col)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditing(item)}
                    className="flex-1 rounded-lg border border-navy-900 px-3 py-2.5 text-xs font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 rounded-lg border border-red-300 px-3 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table on larger screens */}
        <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No items yet. Click &ldquo;Add New&rdquo; to create one.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left font-display text-xs font-bold uppercase tracking-wide text-gray-500"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right font-display text-xs font-bold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={String(get(item, "_id"))} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        {renderValue(item, col)}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditing(item)}
                        className="mr-2 rounded-lg border border-navy-900 px-3 py-1.5 text-xs font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-extrabold text-navy-900 sm:text-xl">
                {editing === "new" ? `Add ${title}` : "Edit Item"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="mb-1.5 block text-sm font-semibold text-navy-900">
                    {field.label}
                  </label>
                  {renderField(field, editing)}
                </div>
              ))}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="w-full rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-navy-900 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}