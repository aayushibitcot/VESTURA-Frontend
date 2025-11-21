import ProfileForm from "./profile-form"
import { SectionHeading } from "../ui/section-heading"

export default function Profile() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-background rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border">
          <div className="text-center mb-10">
            <SectionHeading title="Your profile" description="Update your personal information and profile photo" />
          </div>
          <ProfileForm />
        </div>
      </div>
    </section>
  )
}


