"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/localStorage";

const ApplicantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  email: z.string().email("Invalid email address"),
  language: z.string().optional(),
});

export default function ApplicantStep() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(ApplicantSchema),
  });

  useEffect(() => {
    const data = getFromLocalStorage();
    if (data.applicant) {
      reset(data.applicant);
    }
  }, [reset]);

  const onSubmit = (values: z.infer<typeof ApplicantSchema>) => {
    saveToLocalStorage({ applicant: values });
    router.push("/apply/housing");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6">
        <p className="text-sm text-amber-900">
          <strong>Demo Mode:</strong> This data is stored locally in your browser only. 
          No data is saved to a database. Please do not enter real personal information.
        </p>
      </div>

      <h2 className="text-2xl font-semibold">Applicant Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input
            className="w-full rounded border p-2"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Last Name *</label>
          <input
            className="w-full rounded border p-2"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth *</label>
          <input
            type="date"
            className="w-full rounded border p-2"
            {...register("dob")}
          />
          {errors.dob && (
            <p className="text-red-600 text-sm mt-1">{errors.dob.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number *</label>
          <input
            type="tel"
            className="w-full rounded border p-2"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email Address *</label>
          <input
            type="email"
            className="w-full rounded border p-2"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Language</label>
          <select
            className="w-full rounded border p-2"
            {...register("language")}
          >
            <option value="">Select...</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="zh">Chinese</option>
            <option value="vi">Vietnamese</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Continue →
      </button>
    </form>
  );
}