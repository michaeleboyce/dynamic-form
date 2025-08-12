"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertCore, getApplication } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EligibilitySchema = z.object({
  hardship: z.boolean().refine(val => val === true, {
    message: "You must acknowledge experiencing COVID-19 related hardship",
  }),
  typedSignature: z.string().min(1, "Signature is required"),
});

export default function EligibilityStep() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(EligibilitySchema),
  });

  useEffect(() => {
    async function loadData() {
      const app = await getApplication();
      if (app?.core) {
        setExistingData(app.core);
        const eligibility = (app.core as any).eligibility;
        if (eligibility) {
          reset({
            hardship: eligibility.hardship,
            typedSignature: eligibility.typedSignature,
          });
        }
      }
    }
    loadData();
  }, [reset]);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const coreData = {
        applicant: existingData?.applicant || {
          firstName: "",
          lastName: "",
          dob: "",
          phone: "",
          email: "",
        },
        housing: existingData?.housing || {
          address1: "",
          city: "",
          state: "",
          zip: "",
          monthlyRent: 0,
          monthsBehind: 0,
        },
        household: existingData?.household || {
          size: 1,
        },
        eligibility: {
          ...values,
          signedAtISO: new Date().toISOString(),
        },
      };
      
      await upsertCore(coreData);
      router.push("/apply/review");
    } catch (error) {
      console.error("Error saving eligibility data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-semibold">Eligibility Attestation</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-semibold mb-2">COVID-19 Hardship Acknowledgement</h3>
        <p className="text-sm text-gray-700 mb-4">
          By checking this box, you attest that one or more individuals within your household:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
          <li>Qualified for unemployment benefits or experienced a reduction in household income</li>
          <li>Incurred significant costs or experienced financial hardship due to COVID-19</li>
          <li>Is at risk of experiencing homelessness or housing instability</li>
        </ul>
        
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            {...register("hardship")}
          />
          <span className="text-sm">
            I acknowledge that I have experienced COVID-19 related financial hardship *
          </span>
        </label>
        {errors.hardship && (
          <p className="text-red-600 text-sm mt-1">{errors.hardship.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Electronic Signature *
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Please type your full legal name as it appears on your identification
        </p>
        <input
          className="w-full rounded border p-2"
          {...register("typedSignature")}
          placeholder="Your Full Legal Name"
        />
        {errors.typedSignature && (
          <p className="text-red-600 text-sm mt-1">{errors.typedSignature.message}</p>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-sm text-gray-700">
          <strong>Important:</strong> By signing above, you certify that all information provided 
          in this application is true and accurate to the best of your knowledge. Providing false 
          information may result in denial of assistance and potential legal consequences.
        </p>
      </div>
      
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/apply/household")}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </form>
  );
}