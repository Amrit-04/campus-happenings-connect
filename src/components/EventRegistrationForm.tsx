import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Event } from '@/types/Event';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { registerForEvent, isUserRegistered } from '@/services/mockData';

interface EventRegistrationFormProps {
  event: Event;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  studentId: z.string().min(5, {
    message: "Student ID must be at least 5 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({ event, onSuccess }) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.full_name || '',
      email: user?.email || '',
      studentId: '',
      department: '',
      notes: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this event.",
        variant: "destructive",
      });
      return;
    }
    
    if (isUserRegistered(user.id, event.id)) {
      toast({
        title: "Already registered",
        description: "You have already registered for this event.",
        variant: "destructive",
      });
      return;
    }
    
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      toast({
        title: "Event is full",
        description: "Sorry, this event has reached its maximum capacity.",
        variant: "destructive",
      });
      return;
    }
    
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      toast({
        title: "Registration closed",
        description: "The registration deadline for this event has passed.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      registerForEvent(event.id, user.id, {
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        department: data.department,
      });
      
      toast({
        title: "Registration successful",
        description: "You have successfully registered for this event!",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your student ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your department" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any special accommodations or information?" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={
            !user || 
            isUserRegistered(user.id, event.id) ||
            (event.maxAttendees && event.currentAttendees >= event.maxAttendees) ||
            (event.registrationDeadline && new Date(event.registrationDeadline) < new Date())
          }
        >
          Register for Event
        </Button>
      </form>
    </Form>
  );
};

export default EventRegistrationForm;
