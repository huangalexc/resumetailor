'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/hooks/useResumeStore'
import { ContactInfo } from '@/lib/types/resume'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

interface ContactEditorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactEditorModal({ isOpen, onClose }: ContactEditorModalProps) {
  const { currentResumeData, updateCurrentResume } = useResumeStore()

  const [formData, setFormData] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  })

  // Load existing contact info when modal opens
  useEffect(() => {
    if (currentResumeData?.contactInfo) {
      setFormData({ ...currentResumeData.contactInfo })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
      })
    }
  }, [currentResumeData])

  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    // Clean up optional fields
    const cleanedData: ContactInfo = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      location: formData.location || undefined,
      linkedin: formData.linkedin || undefined,
      website: formData.website || undefined,
    }

    await updateCurrentResume({ contactInfo: cleanedData })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Contact Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., John Doe"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(123) 456-7890"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="pl-10"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="linkedin"
                value={formData.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
                className="pl-10"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website / Portfolio</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="johndoe.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name || !formData.email}
          >
            Save Contact Info
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
