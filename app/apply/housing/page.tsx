"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/localStorage";

const HousingSchema = z.object({
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.string().min(5, "ZIP code must be at least 5 digits"),
  monthlyRent: z.coerce.number().min(0, "Monthly rent must be 0 or greater"),
  monthsBehind: z.coerce.number().min(0, "Months behind must be 0 or greater"),
  landlordName: z.string().optional(),
  landlordPhone: z.string().optional(),
});

export default function HousingStep() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(HousingSchema),
  });

  useEffect(() => {
    const data = getFromLocalStorage();
    if (data.housing) {
      reset(data.housing);
    }
  }, [reset]);

  const onSubmit = (values: any) => {
    saveToLocalStorage({ housing: values });
    router.push("/apply/household");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-semibold">Housing Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Street Address *</label>
          <input
            className="w-full rounded border p-2"
            {...register("address1")}
          />
          {errors.address1 && (
            <p className="text-red-600 text-sm mt-1">{errors.address1.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Apartment/Unit</label>
          <input
            className="w-full rounded border p-2"
            {...register("address2")}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">City *</label>
            <input
              className="w-full rounded border p-2"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">State *</label>
            <input
              className="w-full rounded border p-2"
              {...register("state")}
              maxLength={2}
              placeholder="CA"
            />
            {errors.state && (
              <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code *</label>
            <input
              className="w-full rounded border p-2"
              {...register("zip")}
            />
            {errors.zip && (
              <p className="text-red-600 text-sm mt-1">{errors.zip.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Rent *</label>
            <input
              type="number"
              className="w-full rounded border p-2"
              {...register("monthlyRent")}
              min={0}
            />
            {errors.monthlyRent && (
              <p className="text-red-600 text-sm mt-1">{errors.monthlyRent.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Months Behind *</label>
            <input
              type="number"
              className="w-full rounded border p-2"
              {...register("monthsBehind")}
              min={0}
            />
            {errors.monthsBehind && (
              <p className="text-red-600 text-sm mt-1">{errors.monthsBehind.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Landlord Name</label>
            <input
              className="w-full rounded border p-2"
              {...register("landlordName")}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Landlord Phone</label>
            <input
              type="tel"
              className="w-full rounded border p-2"
              {...register("landlordPhone")}
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/apply")}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue →
        </button>
      </div>
    </form>
  );
}