import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, ImagePlus, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Event, EventCategory } from '@/types/Event';
import { createEvent, getEventById, updateEvent } from '@/services/mockData';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.string().refine((date) => {
    try {
      Date.parse(date);
      return true;
    } catch (error) {
      return false;
    }
  }, {
    message: "Invalid date format. Please use a valid date string.",
  }),
  endDate: z.string().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  category: z.enum(['hackathon', 'workshop', 'fair', 'seminar', 'conference', 'cultural', 'sports', 'other']),
  organizer: z.string().min(2, {
    message: "Organizer must be at least 2 characters.",
  }),
  image: z.string().optional(),
  registrationDeadline: z.string().optional(),
  maxAttendees: z.number().optional(),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const EventForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      endDate: undefined,
      location: '',
      category: 'other',
      organizer: '',
      image: '',
      registrationDeadline: undefined,
      maxAttendees: undefined,
      isFeatured: false,
    },
  });
  
  useEffect(() => {
    if (id) {
      const event = getEventById(id);
      if (event) {
        setInitialValues({
          title: event.title,
          description: event.description,
          date: format(new Date(event.date), 'yyyy-MM-dd'),
          endDate: event.endDate ? format(new Date(event.endDate), 'yyyy-MM-dd') : undefined,
          location: event.location,
          category: event.category,
          organizer: event.organizer,
          image: event.image || '',
          registrationDeadline: event.registrationDeadline || undefined,
          maxAttendees: event.maxAttendees || undefined,
          isFeatured: event.isFeatured,
        });
      }
    }
  }, [id]);
  
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Remove currentAttendees from form values as it's not expected in the type
      const eventData: Omit<Event, 'id' | 'currentAttendees'> = {
        title: values.title,
        description: values.description,
        date: values.date,
        endDate: values.endDate,
        location: values.location,
        category: values.category as EventCategory,
        organizer: values.organizer,
        image: values.image,
        registrationDeadline: values.registrationDeadline,
        maxAttendees: values.maxAttendees,
        isFeatured: values.isFeatured,
      };
      
      if (id) {
        // Update existing event
        updateEvent(id, eventData);
        toast({
          title: "Event updated successfully!",
        });
      } else {
        // Create new event
        createEvent(eventData);
        toast({
          title: "Event created successfully!",
        });
      }
      
      navigate('/admin/events');
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Failed to create/update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/admin/events')}>
          &larr; Back to Events
        </Button>
        <h1 className="text-3xl font-bold mt-4">{id ? 'Edit Event' : 'Create Event'}</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event Title" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a detailed description about the event"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={
                            "w-full pl-3.5 font-normal" +
                            (field.value ? " text-left" : " text-muted-foreground")
                          }
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : "")}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Date of the event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>End Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={
                            "w-full pl-3.5 font-normal" +
                            (field.value ? " text-left" : " text-muted-foreground")
                          }
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick an end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : "")}
                        disabled={(date) =>
                          date < new Date(form.getValues('date'))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    End date of the event (if multi-day).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event Location" {...field} />
                </FormControl>
                <FormDescription>
                  Where will the event be held?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category that best describes the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer</FormLabel>
                <FormControl>
                  <Input placeholder="Event Organizer" {...field} />
                </FormControl>
                <FormDescription>
                  Who is organizing this event?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Image URL" {...field} />
                </FormControl>
                <FormDescription>
                  Provide a URL for the event image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="registrationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Deadline (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Registration Deadline" {...field} />
                </FormControl>
                <FormDescription>
                  Set a deadline for event registration.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxAttendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Attendees (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Maximum number of attendees"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Limit the number of attendees for the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Featured Event</FormLabel>
                  <FormDescription>
                    Should this event be featured on the homepage?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;
