"use client"
import { useState } from "react";
import { SectionHeading } from "../ui/section-heading";
import { useToast } from "@/hooks/use-toast";

const defaultForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

type FormType = typeof defaultForm

export default function Contact() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [errors, setErrors] = useState<Partial<FormType>>({})
  const { toast } = useToast()

  const validate = () => {
    const newErrors: Partial<FormType> = {}
    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    }
    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required"
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      toast({
        title: "Validation error",
        description: error,
        variant: "destructive",
      })
      return
    }
  }

  return (
    <main className="flex-1 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <SectionHeading title="Contact Us" align="left" />

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Get in Touch</h3>
              <p className="text-muted-foreground">
                Have questions about our products or services? We're here to help.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium uppercase tracking-wide mb-1">Email</h4>
                <p className="text-muted-foreground">info@bitcot.com</p>
              </div>
              <div>
                <h4 className="text-sm font-medium uppercase tracking-wide mb-1">Phone</h4>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="text-sm font-medium uppercase tracking-wide mb-1">Address</h4>
                <p className="text-muted-foreground">
                  123 Business Street
                  <br />
                  City, State 12345
                  <br />
                  United States
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium uppercase tracking-wide mb-2">Business Hours</h4>
              <p className="text-muted-foreground text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>

          <div className="border border-border p-6">
            <h3 className="font-medium text-lg mb-4">Send Us a Message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border border-border px-4 py-2 bg-background"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value })
                    setErrors({ ...errors, name: "" })
                  }}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-border px-4 py-2 bg-background"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value })
                    setErrors({ ...errors, email: "" })
                  }}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full border border-border px-4 py-2 bg-background"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => {
                    setForm({ ...form, subject: e.target.value })
                    setErrors({ ...errors, subject: "" })
                  }}
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full border border-border px-4 py-2 bg-background resize-none"
                  placeholder="Your message..."
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value })
                    setErrors({ ...errors, message: "" })
                  }}
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 px-6 py-3 uppercase tracking-wide transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

