"use client";

import { useForm } from "react-hook-form";
import type { DynamicFormSpec } from "@/lib/validation";

interface DynamicFormRendererProps {
  spec: DynamicFormSpec;
  onSubmit: (answers: Record<string, unknown>) => Promise<void> | void;
  initialValues?: Record<string, unknown>;
}

export default function DynamicFormRenderer({ 
  spec, 
  onSubmit,
  initialValues = {}
}: DynamicFormRendererProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {spec.fields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-600">{field.helpText}</p>
                )}
                <input
                  className="w-full rounded border p-2"
                  {...register(field.id, { required: field.required })}
                  type="text"
                  placeholder={field.placeholder}
                />
              </div>
            );
            
          case "number":
          case "currency":
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-600">{field.helpText}</p>
                )}
                <div className="relative">
                  {field.type === "currency" && (
                    <span className="absolute left-2 top-2 text-gray-500">$</span>
                  )}
                  <input
                    className={`w-full rounded border p-2 ${
                      field.type === "currency" ? "pl-7" : ""
                    }`}
                    {...register(field.id, { 
                      required: field.required,
                      min: field.validations?.min,
                      max: field.validations?.max,
                    })}
                    type="number"
                    placeholder={field.placeholder}
                    min={field.validations?.min}
                    max={field.validations?.max}
                  />
                </div>
              </div>
            );
            
          case "date":
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-600">{field.helpText}</p>
                )}
                <input
                  className="w-full rounded border p-2"
                  {...register(field.id, { required: field.required })}
                  type="date"
                />
              </div>
            );
            
          case "textarea":
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-600">{field.helpText}</p>
                )}
                <textarea
                  className="w-full rounded border p-2"
                  {...register(field.id, { required: field.required })}
                  rows={4}
                  placeholder={field.placeholder}
                />
              </div>
            );
            
          case "boolean":
            return (
              <div key={field.id} className="space-y-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(field.id)}
                  />
                  <span className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-600 ml-6">{field.helpText}</p>
                )}
              </div>
            );
            
          case "radio":
            return (
              <fieldset key={field.id} className="space-y-2">
                <div className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </div>
                {field.helpText && (
                  <p className="text-sm text-gray-600">{field.helpText}</p>
                )}
                <div className="space-y-2">
                  {field.options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={option.value}
                        {...register(field.id, { required: field.required })}
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            );
            
          case "select":
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-600">{field.helpText}</p>
                )}
                <select
                  className="w-full rounded border p-2"
                  {...register(field.id, { required: field.required })}
                >
                  <option value="">Select...</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
            
          case "checkbox-group":
            return (
              <fieldset key={field.id} className="space-y-2">
                <div className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </div>
                {field.helpText && (
                  <p className="text-sm text-gray-600">{field.helpText}</p>
                )}
                <div className="space-y-2">
                  {field.options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option.value}
                        {...register(`${field.id}.${option.value}`)}
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            );
            
          default:
            return null;
        }
      })}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Answers"}
      </button>
    </form>
  );
}