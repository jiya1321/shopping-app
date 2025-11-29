import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { toast } = useToast();

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "We've received your message and will get back to you shortly.",
    });
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">Get in Touch</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="bg-primary text-white p-8 rounded-lg shadow-lg h-fit">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="mb-8 text-gray-300">Fill up the form and our team will get back to you within 24 hours.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="text-secondary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-secondary" />
                  <span>support@krishnaelectronics.com</span>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-secondary mt-1" />
                  <span>123 Tech Street, Silicon Valley,<br/>CA 94000, USA</span>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="text-secondary mt-1" />
                  <span>Mon - Fri: 9:00 AM - 8:00 PM<br/>Sat: 10:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input {...register("firstName", { required: true })} placeholder="John" />
                    {errors.firstName && <span className="text-red-500 text-xs">Required</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input {...register("lastName", { required: true })} placeholder="Doe" />
                    {errors.lastName && <span className="text-red-500 text-xs">Required</span>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} placeholder="john@example.com" />
                  {errors.email && <span className="text-red-500 text-xs">Valid email required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    {...register("message", { required: true })} 
                    placeholder="How can we help you?" 
                    className="min-h-[150px]"
                  />
                  {errors.message && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <Button type="submit" size="lg" className="w-full bg-secondary text-primary font-bold hover:bg-secondary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
