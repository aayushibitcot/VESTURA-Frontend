"use client"
import { useState, useRef } from "react";
import { SectionHeading } from "../ui/section-heading";
import { useToast } from "@/hooks/use-toast";
import { submitContact } from "@/store/contact/action";
import SimpleReactValidator from "simple-react-validator";
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant";

const defaultForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

type FormType = typeof defaultForm

export default function Contact() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldShowErrors, setShouldShowErrors] = useState(false)
  const { toast } = useToast()
  const [, forceUpdate] = useState(0)
  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        required: ":attribute" + VALIDATION_ERROR_MESSAGE.REQUIRED,
        email: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_EMAIL,
      },
    })
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (shouldShowErrors) {
      validator.current.showMessageFor(name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()    

    if (validator.current.allValid()) { 
      setIsSubmitting(true)
      try {
        const result = await submitContact(form)
        if (result.success) {
          toast({
            title: VALIDATION_ERROR_MESSAGE.CONTACT_SUBMITTED_SUCCESSFULLY,
            description: result.message || VALIDATION_ERROR_MESSAGE.CONTACT_SUBMITTED_SUCCESSFULLY_DESCRIPTION,
            variant: "success",
          })
          // Reset form after successful submission
          setForm(defaultForm)
          setShouldShowErrors(false)
          validator.current.hideMessages()
          forceUpdate((prev) => prev + 1)
        } else {
          toast({
            title: VALIDATION_ERROR_MESSAGE.FAILED_TO_SUBMIT_CONTACT,
            description: result.message || VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: VALIDATION_ERROR_MESSAGE.FAILED_TO_SUBMIT_CONTACT,
          description: VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
    else {
      setShouldShowErrors(true)
      validator.current.showMessages()
      forceUpdate((prev) => prev + 1)
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
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="h-11 w-full border border-border px-4 py-2 bg-background"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  name="name"
                />
                {shouldShowErrors && validator.current.message("name", form.name, "required|min:2", { className: "text-sm text-destructive mt-1" })}
                </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="h-11 w-full border border-border px-4 py-2 bg-background"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  name="email"
                />
                {shouldShowErrors && validator.current.message("email", form.email, "required|email", { className: "text-sm text-destructive mt-1" })}
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  className="h-11 w-full border border-border px-4 py-2 bg-background"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={handleChange}
                  name="subject"
                />
                {shouldShowErrors && validator.current.message("subject", form.subject, "required|min:3", { className: "text-sm text-destructive mt-1" })}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="h-11 w-full border border-border px-4 py-2 bg-background resize-none"
                  placeholder="Your message..."
                  value={form.message}
                  onChange={handleChange}
                  name="message"
                />
                {shouldShowErrors && validator.current.message("message", form.message, "required|min:10", { className: "text-sm text-destructive mt-1" })}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-foreground text-background hover:bg-foreground/90 px-6 py-3 uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

