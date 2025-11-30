import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Upload, X, Loader2 } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import type { Memory } from './MemoryWall';

const TAGS = ['Family', 'Church', 'Cooking', 'Travel', 'Classmates', 'Worklife', '4H Club'];

interface MemoryFormProps {
  onSubmit: (memory: Omit<Memory, 'id' | 'createdAt' | 'likes'>) => void;
  onCancel: () => void;
}

export function MemoryForm({ onSubmit, onCancel }: MemoryFormProps) {
  const [headline, setHeadline] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [memory, setMemory] = useState('');
  const [memoryDate, setMemoryDate] = useState('');
  const [memoryLocation, setMemoryLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const uploadFile = async (file: File, type: 'photo' | 'video'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json() as { error?: string };
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json() as { url: string };
    return data.url;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'Photo must be less than 5MB' });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setPhotoFile(file);
      setErrors({ ...errors, photo: '' });
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setErrors({ ...errors, video: 'Video must be less than 50MB' });
        return;
      }
      
      setVideoFile(file);
      setErrors({ ...errors, video: '' });
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!headline.trim()) {
      newErrors.headline = 'Headline is required';
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!memory.trim()) {
      newErrors.memory = 'Memory is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setUploadProgress('Uploading media...');

    try {
      // Upload photo if present
      let uploadedPhotoUrl = '';
      if (photoFile) {
        setUploadProgress('Uploading photo...');
        uploadedPhotoUrl = await uploadFile(photoFile, 'photo');
      }

      // Upload video if present
      let uploadedVideoUrl = '';
      if (videoFile) {
        setUploadProgress('Uploading video...');
        uploadedVideoUrl = await uploadFile(videoFile, 'video');
      }

      setUploadProgress('Saving memory...');

      // Submit the memory with uploaded URLs
      onSubmit({
        headline: headline.trim(),
        name: name.trim(),
        email: email.trim(),
        photo: uploadedPhotoUrl || undefined,
        video: uploadedVideoUrl || undefined,
        memory: memory.trim(),
        memoryDate: memoryDate.trim() || undefined,
        memoryLocation: memoryLocation.trim() || undefined,
        tags: selectedTags,
      });

      setUploading(false);
      setUploadProgress('');
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ ...errors, submit: error instanceof Error ? error.message : 'Failed to upload media' });
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        {/* Headline */}
        <div className="space-y-1.5">
          <Label htmlFor="headline" className="text-sm font-medium">Headline *</Label>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Give your memory a memorable title"
            className={errors.headline ? 'border-destructive' : ''}
            disabled={uploading}
          />
          {errors.headline && <p className="text-xs text-destructive">{errors.headline}</p>}
        </div>

        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={errors.name ? 'border-destructive' : ''}
              disabled={uploading}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">Your Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={errors.email ? 'border-destructive' : ''}
              disabled={uploading}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
        </div>

        {/* Memory Date and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="memoryDate" className="text-sm font-medium">When (Optional)</Label>
            <Input
              id="memoryDate"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
              placeholder="e.g., June 2015"
              disabled={uploading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memoryLocation" className="text-sm font-medium">Where (Optional)</Label>
            <Input
              id="memoryLocation"
              value={memoryLocation}
              onChange={(e) => setMemoryLocation(e.target.value)}
              placeholder="e.g., Grandma's house"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Upload Media */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Upload Media (Optional)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photo Upload */}
            <div className="space-y-1.5">
              <Label htmlFor="photo" className="cursor-pointer block">
                <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors text-center min-h-[160px] flex items-center justify-center">
                  {photoPreview ? (
                    <div className="relative w-full">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-36 object-cover rounded"
                      />
                      {!uploading && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPhotoFile(null);
                            setPhotoPreview('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="py-3">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">Upload Photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                    </div>
                  )}
                </div>
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={uploading}
              />
            </div>

            {/* Video Upload */}
            <div className="space-y-1.5">
              <Label htmlFor="video" className="cursor-pointer block">
                <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors text-center min-h-[160px] flex items-center justify-center">
                  {videoFile ? (
                    <div className="relative w-full">
                      <div className="w-full h-36 flex items-center justify-center bg-muted rounded">
                        <div className="text-center px-3">
                          <p className="text-sm font-medium text-muted-foreground break-all">{videoFile.name}</p>
                        </div>
                      </div>
                      {!uploading && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setVideoFile(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="py-3">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">Upload Video</p>
                      <p className="text-xs text-muted-foreground mt-1">Max 50MB</p>
                    </div>
                  )}
                </div>
              </Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>
          {errors.photo && <p className="text-xs text-destructive">{errors.photo}</p>}
          {errors.video && <p className="text-xs text-destructive">{errors.video}</p>}
        </div>

        {/* Memory */}
        <div className="space-y-1.5">
          <Label htmlFor="memory" className="text-sm font-medium">Your Memory *</Label>
          <Textarea
            id="memory"
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="Share your memory and story here..."
            rows={12}
            className={errors.memory ? 'border-destructive' : ''}
            disabled={uploading}
          />
          {errors.memory && <p className="text-xs text-destructive">{errors.memory}</p>}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tags (Optional)</Label>
          <div className="flex flex-wrap gap-3">
            {TAGS.map((tag) => (
              <div key={tag} className="flex items-center gap-3">
                <Checkbox
                  id={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                  disabled={uploading}
                />
                <Label
                  htmlFor={tag}
                  className="text-sm font-normal cursor-pointer"
                >
                  {tag}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-xs text-destructive">{errors.submit}</p>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-xs text-muted-foreground">{uploadProgress}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={uploading}
            className="w-full sm:w-auto min-w-[120px]"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={uploading}
            className="w-full sm:w-auto min-w-[120px]"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Share Memory'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
