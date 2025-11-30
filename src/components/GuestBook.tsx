import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MapPin, Heart, Mail } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import { AppNav } from './AppNav';

interface GuestBookEntry {
  id: string;
  name: string;
  location: string;
  relationship: string;
  firstMet: string;
  message: string;
  createdAt: string;
}

const RELATIONSHIPS = [
  'Family',
  'Relative',
  'Friend',
  'Co-Worker',
  'Never Met Directly',
];

export function GuestBook() {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [relationship, setRelationship] = useState('');
  const [firstMet, setFirstMet] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  // Fetch entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/guestbook`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load guest book entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !location.trim() || !relationship || !firstMet.trim() || !message.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`${baseUrl}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
          relationship,
          firstMet: firstMet.trim(),
          message: message.trim(),
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to submit entry');
      }

      const newEntry = await response.json() as GuestBookEntry;
      
      // Add new entry to the top of the list
      setEntries([newEntry, ...entries]);

      // Reset form
      setName('');
      setLocation('');
      setRelationship('');
      setFirstMet('');
      setMessage('');
      setEmail('');
      
      // Scroll to top to show success
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getRelationshipColor = (rel: string) => {
    switch (rel) {
      case 'Family': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
      case 'Relative': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Friend': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Co-Worker': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Never Met Directly': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav currentPage="guestbook" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-2">
            Guest Book
          </h1>
          <p className="text-muted-foreground text-lg">
            Leave a message and let us know how we're connected!
          </p>
        </div>

        {/* Form */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-heading font-semibold">Sign Our Guest Book</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship *</Label>
                <Select value={relationship} onValueChange={setRelationship} required>
                  <SelectTrigger id="relationship">
                    <SelectValue placeholder="How do you know them?" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIPS.map((rel) => (
                      <SelectItem key={rel} value={rel}>
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstMet">Where did you first meet? *</Label>
                <Input
                  id="firstMet"
                  value={firstMet}
                  onChange={(e) => setFirstMet(e.target.value)}
                  placeholder="College, work event, mutual friend..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, memories, or well wishes..."
                  rows={4}
                  required
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  {message.length} characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your email won't be displayed publicly
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Sign Guest Book'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Entries Feed */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold">
            Guest Book Entries ({entries.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">
                  Be the first to sign the guest book!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {entry.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {entry.location}
                          </span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(entry.relationship)}`}>
                            {entry.relationship}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4 flex-shrink-0" />
                      <span>First met: <span className="text-foreground">{entry.firstMet}</span></span>
                    </div>

                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {entry.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
