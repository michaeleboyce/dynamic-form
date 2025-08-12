"use client";

import { useForm, useWatch } from "react-hook-form";
import type { DynamicFormSpec } from "@/lib/validation";
import { useMemo } from "react";

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
  const { register, handleSubmit, formState: { isSubmitting }, control } = useForm({
    defaultValues: initialValues
  });

  // Watch all form values for conditional rendering
  const watchedValues = useWatch({ control });

  // Check if a field should be shown based on showIf conditions
  const shouldShowField = (field: any) => {
    if (!field.showIf) return true;
    
    const { showIf } = field;
    const dependentValue = watchedValues[showIf.field];
    
    if (showIf.equals !== undefined) {
      return dependentValue === showIf.equals;
    }
    
    if (showIf.anyOf) {
      return showIf.anyOf.includes(dependentValue);
    }
    
    if (showIf.minSelected !== undefined && Array.isArray(dependentValue)) {
      return dependentValue.length >= showIf.minSelected;
    }
    
    return true;
  };

  // Process form data to handle multiselect checkboxes
  const processFormData = (data: Record<string, any>) => {
    const processed: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Check if this is a multiselect field
      const field = spec.fields.find(f => f.id === key);
      if (field && (field.type === 'multiselect' || field.type === 'checkbox-group')) {
        // Convert checkbox object to array of selected values
        const selected = [];
        if (typeof value === 'object' && value !== null) {
          for (const [option, isChecked] of Object.entries(value)) {
            if (isChecked) selected.push(option);
          }
        }
        processed[key] = selected;
      } else {
        processed[key] = value;
      }
    }
    
    return processed;
  };

  const handleFormSubmit = handleSubmit((data) => {
    const processedData = processFormData(data);
    return onSubmit(processedData);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {spec.fields.map((field) => {
        if (!shouldShowField(field)) return null;

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
                  {...register(field.id, { 
                    required: field.required,
                    min: field.min || field.validations?.min,
                    max: field.max || field.validations?.max,
                  })}
                  type="number"
                  placeholder={field.placeholder}
                  min={field.min || field.validations?.min}
                  max={field.max || field.validations?.max}
                />
              </div>
            );

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
                  <span className="absolute left-2 top-2 text-gray-500">
                    {field.currency === "USD" ? "$" : field.currency || "$"}
                  </span>
                  <input
                    className="w-full rounded border p-2 pl-7"
                    {...register(field.id, { 
                      required: field.required,
                      min: field.min || field.validations?.min,
                      max: field.max || field.validations?.max,
                    })}
                    type="number"
                    placeholder={field.placeholder}
                    min={field.min || field.validations?.min}
                    max={field.max || field.validations?.max}
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
                  {field.options?.map((option) => (
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
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
            
          case "multiselect":
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
                  {field.options?.map((option) => (
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
            return (
              <div key={field.id} className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  Unsupported field type: {field.type}
                </p>
              </div>
            );
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