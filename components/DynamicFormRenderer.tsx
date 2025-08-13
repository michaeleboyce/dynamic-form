"use client";

import { useForm, useWatch } from "react-hook-form";
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
  const { register, handleSubmit, formState: { isSubmitting }, control } = useForm({
    defaultValues: initialValues
  });

  // Watch all form values for conditional rendering
  const watchedValues = useWatch({ control });

  // Check if a field should be shown based on showIf or visibleWhen conditions
  const shouldShowField = (field: DynamicFormSpec['fields'][number]) => {
    // Support both showIf and visibleWhen
    const condition = field.showIf || field.visibleWhen;
    if (!condition) return true;
    
    const dependentValue = watchedValues[condition.field];
    
    if (condition.equals !== undefined) {
      return dependentValue === condition.equals;
    }
    
    if (condition.anyOf && typeof dependentValue === 'string') {
      return condition.anyOf.includes(dependentValue);
    }
    
    if (condition.minSelected !== undefined && Array.isArray(dependentValue)) {
      return dependentValue.length >= condition.minSelected;
    }
    
    // Support anySelected for checking if any items are selected
    if (condition.anySelected && Array.isArray(dependentValue)) {
      return dependentValue.length > 0;
    }
    
    return true;
  };

  // Process form data to handle multiselect checkboxes
  const processFormData = (data: Record<string, unknown>) => {
    const processed: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Check if this is a multiselect field
      const field = spec.fields.find(f => f.id === key);
      if (field && (field.type === 'multiselect' || field.type === 'multi_select' || field.type === 'checkbox-group')) {
        // Convert checkbox object to array of selected values
        const selected: string[] = [];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          for (const [option, isChecked] of Object.entries(value as Record<string, unknown>)) {
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

        // Normalize field types from AI variations
        let fieldType = field.type;
        if (fieldType === 'single_select') fieldType = 'select';
        if (fieldType === 'multi_select') fieldType = 'multiselect';
        
        // Get currency symbol - support both currency and currencyCode
        const currencySymbol = field.currency === "USD" || field.currencyCode === "USD" ? "$" : 
                              field.currency || field.currencyCode || "$";

        switch (fieldType) {
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
                {field.prefix ? (
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500">
                      {field.prefix}
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
                      step={field.step}
                    />
                  </div>
                ) : (
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
                    step={field.step}
                  />
                )}
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
                    {currencySymbol}
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
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isSubmitting ? "Continuing..." : "Continue to Submit →"}
      </button>
    </form>
  );
}