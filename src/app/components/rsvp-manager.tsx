"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookText, Loader2, Mail, Search, User } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createRsvp, findRsvpByEmail } from "@/app/actions/rsvp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Rsvp } from "@/lib/types";

const RsvpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  special_requests: z
    .string()
    .max(500, { message: "Requests must not exceed 500 characters." })
    .optional(),
});

function NewRsvpForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof RsvpSchema>>({
    resolver: zodResolver(RsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      special_requests: "",
    },
  });

  function onSubmit(values: z.infer<typeof RsvpSchema>) {
    startTransition(async () => {
      const result = await createRsvp(values);
      if (result.success) {
        toast({
          title: "RSVP Confirmed!",
          description: "Thank you, your RSVP has been submitted successfully.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: result.error,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="e.g. Jane Doe" {...field} className="pl-9" />
                </div>
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
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="e.g. jane.doe@example.com"
                    {...field}
                    className="pl-9"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="special_requests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests</FormLabel>
              <FormControl>
                <div className="relative">
                  <BookText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    placeholder="Any dietary restrictions or special needs?"
                    {...field}
                    className="pl-9"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Optional: Let us know if you have any special requirements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Submitting..." : "Submit RSVP"}
        </Button>
      </form>
    </Form>
  );
}

function FindRsvpForm() {
  const [foundRsvp, setFoundRsvp] = useState<Rsvp | null | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address to search.",
      });
      return;
    }

    setIsSearching(true);
    setFoundRsvp(undefined);
    try {
      const result = await findRsvpByEmail(email);
      setFoundRsvp(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      setFoundRsvp(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email to find your RSVP"
          className="flex-grow"
          required
        />
        <Button type="submit" disabled={isSearching} variant="secondary">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="sr-only">Search</span>
        </Button>
      </form>

      {isSearching && (
        <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
      )}

      {foundRsvp === null && !isSearching && (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle>No RSVP Found</CardTitle>
            <CardDescription>
              We couldn't find an RSVP with that email address. Please check for
              typos or submit a new RSVP.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {foundRsvp && !isSearching && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Your RSVP Details</CardTitle>
            <CardDescription>
              Here's the information we have for your attendance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex">
              <strong className="w-28 text-muted-foreground">Name</strong>
              <span>{foundRsvp.name}</span>
            </div>
            <div className="flex">
              <strong className="w-28 text-muted-foreground">Email</strong>
              <span>{foundRsvp.email}</span>
            </div>
            <div className="flex">
              <strong className="w-28 text-muted-foreground">
                Requests
              </strong>
              <span className="flex-1">
                {foundRsvp.special_requests || "None"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function RsvpManager() {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="new-rsvp" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-rsvp">New RSVP</TabsTrigger>
            <TabsTrigger value="find-rsvp">Find My RSVP</TabsTrigger>
          </TabsList>
          <TabsContent value="new-rsvp" className="pt-6">
            <NewRsvpForm />
          </TabsContent>
          <TabsContent value="find-rsvp" className="pt-6">
            <FindRsvpForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
