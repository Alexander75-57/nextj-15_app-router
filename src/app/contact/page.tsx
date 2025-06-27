"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FeedbackSchema } from "@/lib/validation";
import { trpcClient } from "@/app/api/client";

export default function ContactPage() {
  const submitFeedback = trpcClient.addFeedback.useMutation({
    onSuccess: (data) => {
      if (data?.success) {
        setSuccess(true);
        setErrors({});
        formRef.current?.reset();
      } else {
        setSuccess(false);
        setErrors(data?.errors || { general: ['Failed to send message'] });
      }
    },
    onError: (error) => {
      setSuccess(false);
      setErrors({ general: [error.message || 'Unable to connect to server'] });
    }
  });

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const raw = {
      email: formData.get("email")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    };

    const result = FeedbackSchema.safeParse(raw);
    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }
    
    setClientErrors({});
    submitFeedback.mutate(raw);
  };

  const getFieldError = (field: string) => {
    return clientErrors[field]?.[0] || errors[field]?.[0];
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Feedback</h1>
      
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input 
            id="email"
            name="email" 
            type="email"
            placeholder="example@email.com" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            disabled={submitFeedback.isPending}
          />
          {getFieldError('email') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea 
            id="message"
            name="message" 
            placeholder="Your message..." 
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-black"
            disabled={submitFeedback.isPending}
          />
          {getFieldError('message') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('message')}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={submitFeedback.isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitFeedback.isPending ? 'Sending...' : 'Send Message'}
        </button>
        
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            Thank you! Your message has been sent.
          </div>
        )}
        
        {errors.general && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errors.general[0]}
          </div>
        )}

        <div className="flex justify-center">
          <Link 
            href="/" 
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-500 text-white gap-2 hover:bg-green-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Back to main page
          </Link>
        </div>
      </form>
    </div>
  );
}