"use client"

import { useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile, uploadImage } from "@/store/users/action"
import SimpleReactValidator from "simple-react-validator"
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant"
import { Camera } from "lucide-react"

const defaultForm = {
  firstName: "",
  lastName: "",
  phone: "",
  role: "",
}

type FormType = typeof defaultForm

export default function ProfileForm() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s) => s.auth)
  const { toast } = useToast()

  const [form, setForm] = useState<FormType>(defaultForm)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  const [, forceUpdate] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate },
      messages: {
        required: ":attribute" + VALIDATION_ERROR_MESSAGE.REQUIRED,
        phone: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_PHONE,
      },
    })
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      role: user?.role || "customer",
    })
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    validator.current.showMessageFor(name)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (!file) {
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const fileType = file.type.toLowerCase()
    
    if (!allowedTypes.includes(fileType)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, JPEG, or PNG images.",
        variant: "destructive",
      })
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    // Validate file size (500 KB = 500 * 1024 bytes)
    const maxSize = 500 * 1024 // 500 KB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File size too large",
        description: "Image size must not exceed 500 KB. Please choose a smaller image.",
        variant: "destructive",
      })
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    // File is valid, set it
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const uploadImageFile = async (file: File): Promise<string | null> => {
    const res = await uploadImage(file)
    if (!res.success) {
      return res.message || "Failed to upload image"
    }
    
    return res.data?.image || null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validator.current.allValid()) {
      setIsLoading(true)
      try {
        let uploadedImageUrl: string | null = null
        if (selectedFile) {
          const uploadResult = await uploadImageFile(selectedFile)
          if (!uploadResult) {
            toast({
              title: VALIDATION_ERROR_MESSAGE.UPDATE_FAILED,
              variant: "destructive",
            })
            setIsLoading(false)
            return
          }
          uploadedImageUrl = uploadResult
        }
        
        const userId = user?.id || user?._id || ""
        if (!userId) {
          toast({
            title: VALIDATION_ERROR_MESSAGE.UPDATE_FAILED_USER_ID_NOT_FOUND,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        const res = await updateUserProfile(
          userId,
          {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            ...(uploadedImageUrl && { avatar: uploadedImageUrl }),
          },
          dispatch
        )

        if (res.success) {
          toast({ 
            title: res.message || VALIDATION_ERROR_MESSAGE.UPDATE_SUCCESS, 
            variant: "success"
          })
          // Clear the selected file and preview after successful upload
          setSelectedFile(null)
          setPreviewUrl(null)
        } else {
          toast({
            title: res.message || VALIDATION_ERROR_MESSAGE.UPDATE_FAILED,
            variant: "destructive",
          })
        }
      } catch (err) {
        toast({
          title: err instanceof Error ? err.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      validator.current.showMessages()
      forceUpdate((prev) => prev + 1)
    }
  }

  const getUserInitials = () => {
    const first = (form.firstName || user?.firstName || "").trim()
    const last = (form.lastName || user?.lastName || "").trim()
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
    if (first) return first[0].toUpperCase()
    if (last) return last[0].toUpperCase()
    if (user?.email) return user.email[0].toUpperCase()
    return ""
  }

  const currentAvatarUrl = mounted ? (previewUrl || user?.avatar) : null

  if (!mounted) {
    // Avoid SSR/client mismatch by rendering nothing until mounted
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-center">
        <div className="relative flex-shrink-0">
          <div className="h-32 w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-blue-500">
            {currentAvatarUrl ? (
              <img src={currentAvatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-muted-foreground uppercase">
                {getUserInitials()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCameraClick}
            className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-md border-2 border-white transition-colors z-10"
            aria-label="Change profile photo"
          >
            <Camera className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            id="avatar"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="h-11"
          />
          {validator.current.message("firstName", form.firstName, "required", { className: "text-sm text-destructive mt-1", attribute: "first name" })}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className="h-11"
          />
          {validator.current.message("lastName", form.lastName, "required", { className: "text-sm text-destructive mt-1", attribute: "last name" })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="h-11"
            placeholder="+1 (555) 000-0000"
          />
          {validator.current.message("phone", form.phone, "required|phone", { className: "text-sm text-destructive mt-1", attribute: "phone" })}
        </div>
        <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={user?.email || ""}
          disabled
          className="h-11"
        />
        {validator.current.message("email", user?.email || "", "required|email", { className: "text-sm text-destructive mt-1", attribute: "email" })}
          {/* <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            type="text"
            value={form.role}
            onChange={handleChange}
            className="h-11"
            disabled
          />
          {validator.current.message("role", form.role, "required", { className: "text-sm text-destructive mt-1", attribute: "role" })} */}
        </div>
      </div>   
      <div className="space-y-2">
      
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="h-11 px-8" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}


