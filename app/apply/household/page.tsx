"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/localStorage";

const HouseholdSchema = z.object({
  size: z.coerce.number().min(1, "Household size must be at least 1"),
  members: z.array(z.object({
    relation: z.string().min(1, "Relation is required"),
    ageRange: z.string().min(1, "Age range is required"),
    incomeBand: z.string().min(1, "Income band is required"),
  })).optional(),
});

export default function HouseholdStep() {
  const router = useRouter();
  const [memberCount, setMemberCount] = useState(1);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(HouseholdSchema),
  });

  const size = watch("size");

  useEffect(() => {
    const data = getFromLocalStorage();
    if (data.household) {
      reset(data.household);
      setMemberCount(data.household.size || 1);
    }
  }, [reset]);

  useEffect(() => {
    if (size) {
      setMemberCount(Number(size));
    }
  }, [size]);

  const onSubmit = (values: z.infer<typeof HouseholdSchema>) => {
    saveToLocalStorage({ household: values });
    router.push("/apply/eligibility");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-semibold">Household Information</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Household Size *</label>
        <input
          type="number"
          className="w-full rounded border p-2"
          {...register("size")}
          min={1}
        />
        {errors.size && (
          <p className="text-red-600 text-sm mt-1">{errors.size.message}</p>
        )}
      </div>
      
      {memberCount > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Household Members</h3>
          {Array.from({ length: memberCount - 1 }).map((_, index) => (
            <div key={index} className="border rounded p-4 space-y-3">
              <h4 className="font-medium">Member {index + 2}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Relation *</label>
                  <select
                    className="w-full rounded border p-2"
                    {...register(`members.${index}.relation`)}
                  >
                    <option value="">Select...</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.members?.[index]?.relation && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.members[index]?.relation?.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Age Range *</label>
                  <select
                    className="w-full rounded border p-2"
                    {...register(`members.${index}.ageRange`)}
                  >
                    <option value="">Select...</option>
                    <option value="0-5">0-5</option>
                    <option value="6-17">6-17</option>
                    <option value="18-24">18-24</option>
                    <option value="25-64">25-64</option>
                    <option value="65+">65+</option>
                  </select>
                  {errors.members?.[index]?.ageRange && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.members[index]?.ageRange?.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Income Band *</label>
                  <select
                    className="w-full rounded border p-2"
                    {...register(`members.${index}.incomeBand`)}
                  >
                    <option value="">Select...</option>
                    <option value="none">No income</option>
                    <option value="0-500">$0-$500/month</option>
                    <option value="501-1000">$501-$1,000/month</option>
                    <option value="1001-2000">$1,001-$2,000/month</option>
                    <option value="2001+">$2,001+/month</option>
                  </select>
                  {errors.members?.[index]?.incomeBand && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.members[index]?.incomeBand?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/apply/housing")}
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